import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeftIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { CourseTree } from './components/course-tree';
import { ProgressProvider, useProgress } from './components/progress-context';
import { useCourses } from '../hooks/use-courses-api';
import type { Course } from '../hooks/use-courses-api';
import { useTreeState } from './components/course-tree-context';

function ProgressBar() {
  const { getTotalLessonCount, getCompletedLessonCount } = useProgress();
  const total = getTotalLessonCount();
  const completed = getCompletedLessonCount();
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const fillPercent = total > 0 ? (completed / total) * 100 : 0;

  if (total === 0) {
    return <p className="text-sm text-muted-foreground">No lessons found</p>;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1D9E75] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {completed} / {total} lessons • {percent}%
      </span>
    </div>
  );
}

function CourseDetailsContent({ course }: { course: Course }) {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handlePlay = (fullPath: string, lessonId: string) => {
    navigate(`/courses/${courseId}/play?path=${encodeURIComponent(fullPath)}&lessonId=${lessonId}`);
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/courses')}
        className="mb-4"
      >
        <HugeiconsIcon icon={ArrowLeftIcon} className="h-4 w-4" />
        Back to Courses
      </Button>

      <h1 className="text-2xl font-bold mb-1">{course.name}</h1>
      <p className="text-muted-foreground text-sm mb-4">{course.root_path}</p>

      <div className="mb-6">
        <ProgressBar />
      </div>

      {course.tree.children.map((child) => (
        <CourseTree key={child.id} node={child} onPlay={handlePlay} />
      ))}
    </div>
  );
}

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourse } = useCourses();
  const { setCourseId } = useTreeState();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setCourseId(courseId);

    async function load() {
      const data = await getCourse(courseId);
      if (!cancelled) {
        setCourse(data);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [courseId, setCourseId]);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <p>Course not found</p>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </div>
    );
  }

  return (
    <ProgressProvider courseRootPath={course.root_path} tree={course.tree}>
      <CourseDetailsContent course={course} />
    </ProgressProvider>
  );
}
