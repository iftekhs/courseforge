import { useState, useEffect, useCallback } from 'react';

const COMPLETED_LESSONS_KEY = 'completedLessons';
const LESSON_COMPLETED_EVENT = 'lesson-completed-changed';

export function getCompletedLessons(): string[] {
  try {
    const stored = localStorage.getItem(COMPLETED_LESSONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCompletedLessons(lessons: string[]): void {
  try {
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(lessons));
  } catch {
    // Silently fail
  }
}

export function useLessonProgress() {
  const [completedLessons, setState] = useState<string[]>(getCompletedLessons);

  useEffect(() => {
    const handleChange = () => {
      setState(getCompletedLessons());
    };
    window.addEventListener(LESSON_COMPLETED_EVENT, handleChange);
    return () => {
      window.removeEventListener(LESSON_COMPLETED_EVENT, handleChange);
    };
  }, []);

  const markLessonCompleted = useCallback((lessonId: string) => {
    const current = getCompletedLessons();
    if (!current.includes(lessonId)) {
      const updated = [...current, lessonId];
      saveCompletedLessons(updated);
      setState(updated);
      window.dispatchEvent(new CustomEvent(LESSON_COMPLETED_EVENT));
    }
  }, []);

  const unmarkLessonCompleted = useCallback((lessonId: string) => {
    const current = getCompletedLessons();
    const updated = current.filter(id => id !== lessonId);
    saveCompletedLessons(updated);
    setState(updated);
    window.dispatchEvent(new CustomEvent(LESSON_COMPLETED_EVENT));
  }, []);

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return completedLessons.includes(lessonId);
  }, [completedLessons]);

  return {
    completedLessons,
    markLessonCompleted,
    unmarkLessonCompleted,
    isLessonCompleted,
  };
}