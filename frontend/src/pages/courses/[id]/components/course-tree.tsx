import { memo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FolderIcon, VideoIcon, ChevronDown, ChevronRight, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { useTreeState } from './course-tree-context';
import { useLessonProgress } from '../../hooks/use-lesson-progress';

interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: 'directory' | 'video';
  children: TreeNode[];
}

interface CourseTreeProps {
  node: TreeNode;
  onPlay?: (fullPath: string, lessonId: string) => void;
  onNavigate?: (fullPath: string) => void;
  level?: number;
}

export const CourseTree = memo(function CourseTree({ node, onPlay, onNavigate, level = 0 }: CourseTreeProps) {
  const { isNodeExpanded, toggleNode } = useTreeState();
  const { isLessonCompleted } = useLessonProgress();

  const hasChildren = node.children && node.children.length > 0;
  const nodeId = node.id || '';
  const isExpanded = isNodeExpanded(nodeId);
  const isCompleted = node.type === 'video' ? isLessonCompleted(node.id) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeId) toggleNode(nodeId);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay && node.type === 'video') {
      onPlay(node.path, node.id);
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
              key={child.id || child.path || index}
              node={child}
              onPlay={onPlay}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
});