import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { AddIcon, FolderIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { CourseCard } from './components/course-card';

interface CourseSummary {
  id: string;
  name: string;
  root_path: string;
  lesson_count: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const w = window as any;
      let attempts = 0;
      while (attempts < 20) {
        if (w.pywebview?.api) {
          const result = await w.pywebview.api.get_courses();
          setCourses(result || []);
          break;
        }
        await new Promise(r => setTimeout(r, 200));
        attempts++;
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async () => {
    setIsAdding(true);
    try {
      const w = window as any;
      const api = w.pywebview?.api;
      if (!api) return;

      const dialogResult = await api.open_folder_dialog();
      if (!dialogResult || dialogResult.error) {
        setIsAdding(false);
        return;
      }

      if (dialogResult.folder_path) {
        await api.add_course(dialogResult.folder_path);
        await loadCourses();
      }
    } catch (err) {
      console.error('Error adding course:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCourse = async (id: string) => {
    try {
      const w = window as any;
      const api = w.pywebview?.api;
      if (!api) return;

      await api.remove_course(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error removing course:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-muted-foreground">Track your learning progress</p>
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddCourse} disabled={isAdding}>
          <HugeiconsIcon icon={AddIcon} className="h-4 w-4 mr-2" />
          {isAdding ? 'Adding...' : 'Add Course'}
        </Button>
      </div>
      {courses.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <HugeiconsIcon icon={FolderIcon} className="h-8 w-8 mr-3" />
          <span>No courses added yet</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onRemove={handleRemoveCourse} />
          ))}
        </div>
      )}
    </div>
  );
}