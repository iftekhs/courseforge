import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { useLessonProgress, type LessonState, type CourseProgress } from '../../hooks/use-lesson-progress';
import type { TreeNode } from '../../hooks/use-courses-api';

interface FolderCount {
  total: number;
  completed: number;
  inProgress: number;
}

interface ProgressContextType {
  progress: CourseProgress;
  getLessonState: (lessonPath: string | undefined) => LessonState;
  isLessonCompleted: (lessonPath: string | undefined) => boolean;
  isLessonInProgress: (lessonPath: string | undefined) => boolean;
  toggleLessonComplete: (lessonPath: string | undefined) => void;
  markLessonInProgress: (lessonPath: string | undefined) => void;
  getTotalLessonCount: () => number;
  getCompletedLessonCount: () => number;
  getFolderCount: (folderId: string, treeNode: TreeNode) => FolderCount;
  courseId: string;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}

interface ProgressProviderProps {
  children: ReactNode;
  courseRootPath: string;
  tree: TreeNode | null;
}

function getStableLessonId(path: string | undefined): string {
  if (!path) return '';
  let hash = 0;
  const normalized = path.replace(/\\/g, '/').toLowerCase();
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash = hash & hash;
  }
  return `lesson_${Math.abs(hash).toString(36)}`;
}

function countLessonsInTree(node: TreeNode): number {
  if (node.type === 'video') return 1;
  return node.children.reduce((sum, child) => sum + countLessonsInTree(child), 0);
}

function getCompletedCountInTree(node: TreeNode, lessons: Record<string, LessonState>): number {
  if (node.type === 'video') {
    const stableId = getStableLessonId(node.path);
    return lessons[stableId] === 'completed' ? 1 : 0;
  }
  return node.children.reduce((sum, child) => sum + getCompletedCountInTree(child, lessons), 0);
}

function getInProgressCountInTree(node: TreeNode, lessons: Record<string, LessonState>): number {
  if (node.type === 'video') {
    const stableId = getStableLessonId(node.path);
    return lessons[stableId] === 'in_progress' ? 1 : 0;
  }
  return node.children.reduce((sum, child) => sum + getInProgressCountInTree(child, lessons), 0);
}

function getFolderCountRecursive(node: TreeNode, lessons: Record<string, LessonState>): FolderCount {
  const total = countLessonsInTree(node);
  const completed = getCompletedCountInTree(node, lessons);
  const inProgress = getInProgressCountInTree(node, lessons);
  return { total, completed, inProgress };
}

export function ProgressProvider({ children, courseRootPath, tree }: ProgressProviderProps) {
  const {
    progress,
    getLessonState,
    isLessonCompleted,
    isLessonInProgress,
    toggleLessonComplete,
    markLessonInProgress,
    courseId,
  } = useLessonProgress(courseRootPath);

  const getTotalLessonCount = useCallback((): number => {
    if (!tree) return 0;
    return countLessonsInTree(tree);
  }, [tree]);

  const getCompletedLessonCount = useCallback((): number => {
    if (!tree) return 0;
    return getCompletedCountInTree(tree, progress.lessons);
  }, [tree, progress.lessons]);

  const getFolderCount = useCallback((folderId: string, treeNode: TreeNode): FolderCount => {
    const findFolder = (node: TreeNode): TreeNode | null => {
      if (node.id === folderId && node.type === 'directory') return node;
      for (const child of node.children) {
        const found = findFolder(child);
        if (found) return found;
      }
      return null;
    };
    
    if (!treeNode) return { total: 0, completed: 0, inProgress: 0 };
    const folder = findFolder(treeNode);
    if (!folder) return { total: 0, completed: 0, inProgress: 0 };
    return getFolderCountRecursive(folder, progress.lessons);
  }, [tree, progress.lessons]);

  const value = useMemo(
    () => ({
      progress,
      getLessonState,
      isLessonCompleted,
      isLessonInProgress,
      toggleLessonComplete,
      markLessonInProgress,
      getTotalLessonCount,
      getCompletedLessonCount,
      getFolderCount,
      courseId,
    }),
    [
      progress,
      getLessonState,
      isLessonCompleted,
      isLessonInProgress,
      toggleLessonComplete,
      markLessonInProgress,
      getTotalLessonCount,
      getCompletedLessonCount,
      getFolderCount,
      courseId,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}