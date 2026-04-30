import { HugeiconsIcon } from '@hugeicons/react';
import {
  FolderIcon,
  ChevronDown,
  ChevronRight,
} from '@hugeicons/core-free-icons';
import { useTreeState } from './course-tree-context';
import { useProgress } from './progress-context';
import type { TreeNode } from '../../hooks/use-courses-api';

interface TreeNodeProps {
  node: TreeNode;
  onPlay?: (fullPath: string, lessonId: string) => void;
  level?: number;
}

const CheckmarkIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#1D9E75" />
    <path
      d="M4.5 8L7 10.5L11.5 5.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HollowCircleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
    <circle
      cx="8"
      cy="8"
      r="7"
      stroke="#9CA3AF"
      strokeWidth="1.5"
      fill="none"
      className="group-hover:fill-green-500/10 transition-colors"
    />
  </svg>
);

export function CourseTree({ node, onPlay, level = 0 }: TreeNodeProps) {
  const { isNodeExpanded, toggleNode } = useTreeState();
  const { getLessonState, toggleLessonComplete, getFolderCount } =
    useProgress();

  const hasChildren = node.children && node.children.length > 0;
  const nodeId = node.id || '';
  const isExpanded = isNodeExpanded(nodeId);
  const lessonState = node.type === 'video' ? getLessonState(node.path) : null;

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

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'video') {
      toggleLessonComplete(node.path);
    }
  };

  if (node.type === 'video') {
    const completed = lessonState === 'completed';

    return (
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
        style={{ marginLeft: level * 20 }}
        onClick={handlePlay}
      >
        <button
          className="h-4 w-4 shrink-0 flex items-center justify-center"
          onClick={handleIconClick}
        >
          {completed ? <CheckmarkIcon /> : <HollowCircleIcon />}
        </button>
        <span className="text-sm truncate flex-1">{node.name}</span>
      </div>
    );
  }

  const folderCount = getFolderCount(node.id, node);
  const percent =
    folderCount.total > 0
      ? Math.round((folderCount.completed / folderCount.total) * 100)
      : 0;
  const isDone =
    folderCount.completed === folderCount.total && folderCount.total > 0;

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
        {isDone ? (
          <CheckmarkIcon />
        ) : (
          <HugeiconsIcon
            icon={FolderIcon}
            className="h-4 w-4 text-muted-foreground shrink-0"
          />
        )}
        <span className="text-sm font-medium truncate flex-1">{node.name}</span>

        {folderCount.total > 0 && (
          <div
            className={`text-xs px-2 py-0.5 rounded-full ${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-muted-foreground'}`}
          >
            <span>{folderCount.completed}</span>
            <span className="mx-1">/</span>
            <span>{folderCount.total}</span>
            <span className="mx-1">•</span>
            {isDone ? (
              <span className="text-green-600">100%</span>
            ) : (
              <span>{percent}%</span>
            )}
          </div>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child, index) => (
            <CourseTree
              key={child.id || child.path || index}
              node={child}
              onPlay={onPlay}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
