import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface TreeStateContextType {
  collapsedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
  isNodeCollapsed: (nodeId: string) => boolean;
  setCourseId: (id: string | null) => void;
}

const TreeStateContext = createContext<TreeStateContextType | null>(null);

export function useTreeState() {
  const context = useContext(TreeStateContext);
  if (!context) {
    throw new Error('useTreeState must be used within TreeStateProvider');
  }
  return context;
}

interface TreeStateProviderProps {
  children: ReactNode;
}

export function TreeStateProvider({ children }: TreeStateProviderProps) {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);

  const toggleNode = useCallback((nodeId: string) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const isNodeCollapsed = useCallback((nodeId: string) => {
    return collapsedNodes.has(nodeId);
  }, [collapsedNodes]);

  const setCourseId = useCallback((id: string | null) => {
    if (id !== currentCourseId) {
      setCollapsedNodes(new Set());
      setCurrentCourseId(id);
    }
  }, [currentCourseId]);

  return (
    <TreeStateContext.Provider value={{ collapsedNodes, toggleNode, isNodeCollapsed, setCourseId }}>
      {children}
    </TreeStateContext.Provider>
  );
}