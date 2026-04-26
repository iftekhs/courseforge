import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeftIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { CourseTree } from './components/course-tree';
import { useCourses } from '../hooks/use-courses-api';
import type { Course } from '../hooks/use-courses-api';
import { usePreferences } from '../../settings/hooks/use-preferences';

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourse } = useCourses();
  const { preferExternal } = usePreferences();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      if (courseId) {
        const data = await getCourse(courseId);
        if (!cancelled) {
          setCourse(data);
          setLoading(false);
        }
      }
    }
    
    load();
    
    return () => { cancelled = true; };
  }, [courseId]);

  const handlePlay = (fullPath: string) => {
    if (preferExternal) {
      const w = window as any;
      if (w.pywebview?.api) {
        w.pywebview.api.open_in_system_player(fullPath);
      }
    } else {
      navigate(`/courses/${courseId}/play?path=${encodeURIComponent(fullPath)}`);
    }
  };

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
    <div className="p-6">
      <Button variant="ghost" onClick={() => navigate('/courses')} className="mb-4">
        <HugeiconsIcon icon={ArrowLeftIcon} className="h-4 w-4 mr-2" />
        Back to Courses
      </Button>
      
      <h1 className="text-2xl font-bold mb-1">{course.name}</h1>
      <p className="text-muted-foreground text-sm mb-6">{course.root_path}</p>

      <CourseTree node={course.tree as any} rootPath={course.root_path} onPlay={handlePlay} />
    </div>
  );
}