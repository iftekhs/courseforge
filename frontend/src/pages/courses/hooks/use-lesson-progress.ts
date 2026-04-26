import { useState, useEffect, useCallback } from 'react';

export type LessonState = 'not_started' | 'in_progress' | 'completed';

export interface CourseProgress {
  courseId: string;
  lessons: Record<string, LessonState>;
}

const PROGRESS_STORAGE_KEY = 'courseProgress';
const SAVE_DEBOUNCE_MS = 300;
const PROGRESS_EVENT = 'progress-changed';

function generateCourseId(rootPath: string): string {
  let hash = 0;
  for (let i = 0; i < rootPath.length; i++) {
    hash = ((hash << 5) - hash) + rootPath.charCodeAt(i);
    hash = hash & hash;
  }
  return `course_${Math.abs(hash).toString(36)}`;
}

function getStableLessonId(lessonPath: string | undefined): string {
  if (!lessonPath) return '';
  let hash = 0;
  const normalized = lessonPath.replace(/\\/g, '/').toLowerCase();
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash = hash & hash;
  }
  return `lesson_${Math.abs(hash).toString(36)}`;
}

export function loadCourseProgress(rootPath: string): CourseProgress {
  const courseId = generateCourseId(rootPath);
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (stored) {
      const allProgress: Record<string, CourseProgress> = JSON.parse(stored);
      if (allProgress[courseId]) {
        return allProgress[courseId];
      }
    }
  } catch {
    // Ignore
  }
  return { courseId, lessons: {} };
}

export function saveCourseProgress(rootPath: string, progress: CourseProgress): void {
  const courseId = generateCourseId(rootPath);
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const allProgress: Record<string, CourseProgress> = stored ? JSON.parse(stored) : {};
    allProgress[courseId] = progress;
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
  } catch {
    // Fail silently
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function debouncedSave(rootPath: string, progress: CourseProgress): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveCourseProgress(rootPath, progress);
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { courseId: progress.courseId } }));
  }, SAVE_DEBOUNCE_MS);
}

export function useLessonProgress(courseRootPath: string) {
  const [progress, setProgress] = useState<CourseProgress>(() => loadCourseProgress(courseRootPath));

  useEffect(() => {
    setProgress(loadCourseProgress(courseRootPath));
  }, [courseRootPath]);

  const getLessonState = useCallback((lessonPath: string | undefined): LessonState => {
    const stableId = getStableLessonId(lessonPath);
    return progress.lessons[stableId] || 'not_started';
  }, [progress.lessons]);

  const isLessonCompleted = useCallback((lessonPath: string | undefined): boolean => {
    return getLessonState(lessonPath) === 'completed';
  }, [getLessonState]);

  const isLessonInProgress = useCallback((lessonPath: string | undefined): boolean => {
    return getLessonState(lessonPath) === 'in_progress';
  }, [getLessonState]);

  const toggleLessonComplete = useCallback((lessonPath: string | undefined) => {
    if (!lessonPath) return;
    const stableId = getStableLessonId(lessonPath);
    setProgress(prev => {
      const currentState = prev.lessons[stableId] || 'not_started';
      const newState: LessonState = currentState === 'completed' ? 'not_started' : 'completed';
      const updated = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [stableId]: newState,
        },
      };
      saveCourseProgress(courseRootPath, updated);
      return updated;
    });
  }, [courseRootPath]);

  const markLessonInProgress = useCallback((lessonPath: string | undefined) => {
    if (!lessonPath) return;
    const stableId = getStableLessonId(lessonPath);
    setProgress(prev => {
      if (prev.lessons[stableId] === 'completed') return prev;
      if (prev.lessons[stableId] === 'in_progress') return prev;
      const updated = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [stableId]: 'in_progress',
        },
      };
      debouncedSave(courseRootPath, updated);
      return updated;
    });
  }, [courseRootPath]);

  return {
    progress,
    getLessonState,
    isLessonCompleted,
    isLessonInProgress,
    toggleLessonComplete,
    markLessonInProgress,
    courseId: progress.courseId,
  };
}