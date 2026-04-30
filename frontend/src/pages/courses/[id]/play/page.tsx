import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeftIcon,
  ArrowRight02Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/ui/video-player';
import { useLessonProgress } from '../../hooks/use-lesson-progress';
import { useCourses } from '../../hooks/use-courses-api';
import type { TreeNode } from '../../hooks/use-courses-api';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

interface FlatLesson {
  id: string;
  name: string;
  path: string;
}

function flattenTree(node: TreeNode): FlatLesson[] {
  if (node.type === 'video') {
    return [{ id: node.id, name: node.name, path: node.path }];
  }
  const lessons: FlatLesson[] = [];
  for (const child of node.children || []) {
    lessons.push(...flattenTree(child));
  }
  return lessons;
}

export default function CoursePlayPage() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCourse } = useCourses();

  const rawPath = searchParams.get('path') || '';
  const path = rawPath ? decodeURIComponent(rawPath) : '';

  const lessonId = useMemo(() => {
    const idFromUrl = searchParams.get('lessonId');
    return idFromUrl || path;
  }, [searchParams, path]);

  const [course, setCourse] = useState<{ root_path: string } | null>(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessons, setLessons] = useState<FlatLesson[]>([]);
  const [prevLesson, setPrevLesson] = useState<FlatLesson | null>(null);
  const [nextLesson, setNextLesson] = useState<FlatLesson | null>(null);

  useEffect(() => {
    if (!courseId) return;
    getCourse(courseId).then((data) => {
      if (data) setCourse(data);
    });
  }, [courseId]);

  const {
    isLessonCompleted,
    markLessonInProgress,
    toggleLessonComplete,
    isLessonInProgress,
  } = useLessonProgress(course?.root_path || '');

  const isCompleted = path ? isLessonCompleted(path) : false;
  const inProgress = path ? isLessonInProgress(path) : false;

  useEffect(() => {
    if (!path) return;

    setLoading(true);
    setVideoSrc(`${API_BASE}/video/${encodeURIComponent(path)}`);
    const parts = path.split(/[\\/]/);
    const lastPart = parts[parts.length - 1];
    setLessonTitle(
      lastPart?.split('.')[0]?.replace(/-/g, ' ') || 'Untitled Lesson',
    );
  }, [path]);

  useEffect(() => {
    if (!courseId || !course) return;

    const loadLessons = async () => {
      const courseData = await getCourse(courseId);
      if (courseData?.tree) {
        const allLessons = flattenTree(courseData.tree);
        setLessons(allLessons);

        const currentIndex = allLessons.findIndex(
          (l) => l.id === lessonId || l.path === path,
        );
        setPrevLesson(currentIndex > 0 ? allLessons[currentIndex - 1] : null);
        setNextLesson(
          currentIndex < allLessons.length - 1
            ? allLessons[currentIndex + 1]
            : null,
        );
      }
    };
    loadLessons();
  }, [courseId, path, course]);

  useEffect(() => {
    if (path && course?.root_path && !inProgress && !isCompleted) {
      markLessonInProgress(path);
    }
  }, [path, course?.root_path, inProgress, isCompleted]);

  const handleMarkCompleted = () => {
    if (path) {
      toggleLessonComplete(path);
    }
  };

  const handlePrevLesson = () => {
    if (prevLesson) {
      navigate(
        `/courses/${courseId}/play?path=${encodeURIComponent(prevLesson.path)}&lessonId=${prevLesson.id}`,
      );
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(
        `/courses/${courseId}/play?path=${encodeURIComponent(nextLesson.path)}&lessonId=${nextLesson.id}`,
      );
    }
  };

  if (!path) {
    return (
      <div className="p-6">
        <p>No video selected</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <HugeiconsIcon icon={ArrowLeftIcon} className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <VideoPlayer key={path} src={videoSrc} title={lessonTitle} />

        <div className="mt-4 text-left">
          <h2 className="text-xl font-semibold capitalize">{lessonTitle}</h2>
          <div className="flex items-center gap-3 mt-3">
            {path && (
              <Button
                variant={isCompleted ? 'default' : 'outline'}
                onClick={handleMarkCompleted}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className="h-4 w-4"
                />
                {isCompleted ? 'Completed' : 'Mark as Completed'}
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevLesson}
              disabled={!prevLesson}
            >
              <HugeiconsIcon icon={ArrowLeftIcon} className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {lessons.findIndex((l) => l.id === lessonId || l.path === path) +
                1}{' '}
              / {lessons.length}
            </span>
            <Button
              variant="outline"
              onClick={handleNextLesson}
              disabled={!nextLesson}
            >
              Next
              <HugeiconsIcon icon={ArrowRight02Icon} className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
