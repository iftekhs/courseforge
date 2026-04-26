import { useCallback } from 'react';

export interface TreeNode {
  id: string;
  name: string;
  path?: string;
  relative_path?: string;
  type: 'directory' | 'video';
  children: TreeNode[];
}

export interface CourseSummary {
  id: string;
  name: string;
  root_path: string;
  lesson_count: number;
}

export interface Course extends CourseSummary {
  tree: TreeNode;
  created_at: string;
}

export function getFullPath(rootPath: string, relativePath: string): string {
  if (!relativePath || relativePath === '.') {
    return rootPath;
  }
  const cleanPath = relativePath
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/^\\+/, '');

  rootPath = rootPath.replace(/\\/g, '/');

  if (rootPath.endsWith('/')) {
    return rootPath + cleanPath;
  }
  return rootPath + '/' + cleanPath;
}

declare global {
  interface Window {
    pywebview?: {
      api: {
        get_courses: () => CourseSummary[];
        add_course: (folderPath: string) => Promise<CourseSummary & { error?: string }>;
        get_course: (id: string) => Promise<Course | { error: string }>;
        remove_course: (id: string) => Promise<boolean>;
        get_video_url: (rootPath: string, relativePath: string) => string;
        open_in_system_player: (rootPath: string, relativePath: string) => void;
        refresh_page: () => void;
        open_folder_dialog: () => Promise<{ folder_path?: string; error?: string }>;
      };
    };
  }
}

function getApi() {
  if (typeof window === 'undefined') {
    throw new Error('Window not available');
  }
  const api = window.pywebview?.api;
  if (!api) {
    throw new Error('pywebview API not ready');
  }
  return api;
}

export function useCourses() {
  const getCourses = useCallback(() => {
    try {
      const api = getApi();
      return api.get_courses() || [];
    } catch {
      console.warn('pywebview API not available');
      return [];
    }
  }, []);

  const getCourse = useCallback(async (id: string): Promise<Course | null> => {
    try {
      const api = getApi();
      const result = await api.get_course(id);
      if ('error' in result) {
        return null;
      }
      return result as Course;
    } catch {
      return null;
    }
  }, []);

  const addCourse = useCallback(async (folderPath: string): Promise<CourseSummary | null> => {
    try {
      const api = getApi();
      const result = await api.add_course(folderPath);
      if (result?.error) {
        console.error('Add course error:', result.error);
        return null;
      }
      return result || null;
    } catch (err) {
      console.error('Error adding course:', err);
      return null;
    }
  }, []);

  const removeCourse = useCallback(async (id: string): Promise<boolean> => {
    try {
      const api = getApi();
      return await api.remove_course(id);
    } catch {
      return false;
    }
  }, []);

  const getVideoUrl = useCallback(() => {
    return '';
  }, []);

  const openInSystemPlayer = useCallback(() => {
  }, []);

  const refreshPage = useCallback(() => {
    try {
      const api = getApi();
      api.refresh_page();
    } catch {
      window.location.reload();
    }
  }, []);

  return {
    getCourses,
    getCourse,
    addCourse,
    removeCourse,
    getVideoUrl,
    openInSystemPlayer,
    refreshPage,
  };
}