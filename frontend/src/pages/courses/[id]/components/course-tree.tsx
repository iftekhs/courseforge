import { HugeiconsIcon } from '@hugeicons/react';
import { FolderIcon, VideoIcon, ChevronDown, ChevronRight, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { useTreeState } from './course-tree-context';
import { useLessonProgress } from '../../hooks/use-lesson-progress';

interface TreeNode {
  id: string;
  name: string;
  path?: string;
  relative_path?: string;
  type: 'directory' | 'video';
  children: TreeNode[];
}

interface CourseTreeProps {
  node: TreeNode;
  rootPath: string;
  onPlay?: (fullPath: string, lessonId: string) => void;
  onNavigate?: (fullPath: string) => void;
  level?: number;
}

export function CourseTree({ node, rootPath, onPlay, onNavigate, level = 0 }: CourseTreeProps) {
  const { isNodeCollapsed, toggleNode } = useTreeState();
  const { isLessonCompleted } = useLessonProgress();

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = !isNodeCollapsed(node.id);
  const isCompleted = node.type === 'video' ? isLessonCompleted(node.id || `fallback-${node.name}`) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNode(node.id);
  };

  const getFullPath = (n: TreeNode): string => {
    const pathField = n.relative_path || n.path || '';
    if (pathField && (pathField.startsWith('D:') || pathField.startsWith('/') || pathField.includes(':'))) {
      return pathField;
    }
    return rootPath + '/' + pathField;
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay && node.type === 'video') {
      onPlay(getFullPath(node), node.id);
    }
  };

  if (node.type === 'video') {
    return (
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
        style={{ marginLeft: level * 20 }}
        onClick={handlePlay}
      >
        <HugeiconsIcon
          icon={isCompleted ? CheckmarkCircle01Icon : VideoIcon}
          className={`h-4 w-4 shrink-0 ${isCompleted ? 'text-green-500' : 'text-indigo-500'}`}
        />
        <span className="text-sm truncate flex-1">{node.name}</span>
        <button
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded transition-opacity"
          onClick={handlePlay}
        >
          <HugeiconsIcon icon={VideoIcon} className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer"
        style={{ marginLeft: level * 20 }}
        onClick={handleToggle}
      >
        <button
          className="p-0.5 hover:bg-accent rounded transition-colors"
          onClick={handleToggle}
        >
          {hasChildren && (
            <HugeiconsIcon
              icon={isExpanded ? ChevronDown : ChevronRight}
              className="h-4 w-4 text-muted-foreground"
            />
          )}
        </button>
        <HugeiconsIcon icon={FolderIcon} className="h-4 w-4 text-slate-500 shrink-0" />
        <span className="text-sm font-medium truncate">{node.name}</span>
        <span className="text-xs text-muted-foreground">
          ({node.children.length})
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child, index) => (
            <CourseTree
              key={`${child.relative_path || child.path || index}-${index}`}
              node={child}
              rootPath={rootPath}
              onPlay={onPlay}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}