import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeftIcon, ArrowRight02Icon, Link01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { usePreferences } from '../../../settings/hooks/use-preferences';
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
  const { preferExternal } = usePreferences();
  const { isLessonCompleted, markLessonCompleted } = useLessonProgress();
  const { getCourse } = useCourses();

  const rawPath = searchParams.get('path') || '';
  const path = rawPath ? decodeURIComponent(rawPath) : '';

  const lessonId = useMemo(() => {
    const idFromUrl = searchParams.get('lessonId');
    return idFromUrl || path;
  }, [searchParams, path]);

  const isCompleted = lessonId ? isLessonCompleted(lessonId) : false;

  const [videoSrc, setVideoSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessons, setLessons] = useState<FlatLesson[]>([]);
  const [prevLesson, setPrevLesson] = useState<FlatLesson | null>(null);
  const [nextLesson, setNextLesson] = useState<FlatLesson | null>(null);

  useEffect(() => {
    if (!path) return;

    setLoading(true);
    setVideoSrc(`${API_BASE}/video/${encodeURIComponent(path)}`);
    const parts = path.split(/[\\/]/);
    const lastPart = parts[parts.length - 1];
    setLessonTitle(lastPart?.split('.')[0]?.replace(/-/g, ' ') || 'Untitled Lesson');
  }, [path]);

  useEffect(() => {
    if (!courseId) return;

    const loadLessons = async () => {
      const course = await getCourse(courseId);
      if (course?.tree) {
        const allLessons = flattenTree(course.tree);
        setLessons(allLessons);

        const currentIndex = allLessons.findIndex(l => l.id === lessonId || l.path === path);
        setPrevLesson(currentIndex > 0 ? allLessons[currentIndex - 1] : null);
        setNextLesson(currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null);
      }
    };
    loadLessons();
  }, [courseId, path]);

  const handleOpenExternal = () => {
    const w = window as any;
    if (w.pywebview?.api) {
      w.pywebview.api.open_in_system_player(path);
    }
  };

  const handleMarkCompleted = () => {
    if (lessonId) {
      markLessonCompleted(lessonId);
    }
  };

  const handlePrevLesson = () => {
    if (prevLesson) {
      navigate(`/courses/${courseId}/play?path=${encodeURIComponent(prevLesson.path)}&lessonId=${prevLesson.id}`);
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/courses/${courseId}/play?path=${encodeURIComponent(nextLesson.path)}&lessonId=${nextLesson.id}`);
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
        <Button variant="ghost" onClick={() => navigate(`/courses/${courseId}`)}>
          <HugeiconsIcon icon={ArrowLeftIcon} className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <video
          src={videoSrc}
          controls
          className="w-full rounded-lg bg-black"
          style={{ maxHeight: '70vh' }}
          onLoadedData={() => setLoading(false)}
          onError={() => setLoading(false)}
        >
          Your browser does not support video playback.
        </video>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p>Loading video...</p>
          </div>
        )}

        <div className="mt-4 text-left">
          <h2 className="text-xl font-semibold capitalize">{lessonTitle}</h2>
          <div className="flex items-center gap-3 mt-3">
            {!preferExternal && (
              <Button variant="outline" onClick={handleOpenExternal}>
                <HugeiconsIcon icon={Link01Icon} className="h-4 w-4 mr-2" />
                Open in System Player
              </Button>
            )}
            {lessonId && (
              <Button
                variant={isCompleted ? "default" : "outline"}
                onClick={handleMarkCompleted}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className="h-4 w-4 mr-2"
                />
                {isCompleted ? 'Completed' : 'Mark as Completed'}
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Button variant="outline" onClick={handlePrevLesson} disabled={!prevLesson}>
              <HugeiconsIcon icon={ArrowLeftIcon} className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {lessons.findIndex(l => l.id === lessonId || l.path === path) + 1} / {lessons.length}
            </span>
            <Button variant="outline" onClick={handleNextLesson} disabled={!nextLesson}>
              Next
              <HugeiconsIcon icon={ArrowRight02Icon} className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}