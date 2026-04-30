import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { FolderIcon, PlayIcon, DeleteIcon } from '@hugeicons/core-free-icons';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  course: {
    id: string;
    name: string;
    root_path: string;
    lesson_count: number;
  };
  onRemove?: (id: string) => void;
}

export function CourseCard({ course, onRemove }: CourseCardProps) {
  const navigate = useNavigate();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(course.id);
    }
  };

  return (
    <Card
      className="cursor-pointer transition-colors shadow-none"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-slate-50 p-2 rounded-lg">
            <HugeiconsIcon
              icon={FolderIcon}
              className="h-5 w-5 text-slate-600"
            />
          </div>
          <CardTitle className="text-base">{course.name}</CardTitle>
        </div>
        {onRemove && (
          <Button size="icon-sm" variant="ghost" onClick={handleRemove}>
            <HugeiconsIcon icon={DeleteIcon} className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {course.lesson_count}{' '}
            {course.lesson_count === 1 ? 'lesson' : 'lessons'}
          </span>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses/${course.id}`);
            }}
          >
            <HugeiconsIcon icon={PlayIcon} className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
