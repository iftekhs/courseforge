import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

interface TreeStateContextType {
  expandedNodes: Record<string, boolean>;
  toggleNode: (nodeId: string) => void;
  isNodeExpanded: (nodeId: string) => boolean;
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
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);

  const toggleNode = useCallback((nodeId: string) => {
    if (!nodeId) return;
    setExpandedNodes(prev => {
      const next = { ...prev };
      if (next[nodeId]) {
        delete next[nodeId];
      } else {
        next[nodeId] = true;
      }
      return next;
    });
  }, []);

  const isNodeExpanded = useCallback((nodeId: string): boolean => {
    if (!nodeId) return false;
    return expandedNodes[nodeId] === true;
  }, [expandedNodes]);

  const setCourseId = useCallback((id: string | null) => {
    if (id !== currentCourseId) {
      setExpandedNodes({});
      setCurrentCourseId(id);
    }
  }, [currentCourseId]);

  const value = useMemo(
    () => ({ expandedNodes, toggleNode, isNodeExpanded, setCourseId }),
    [expandedNodes, toggleNode, isNodeExpanded, setCourseId]
  );

  return (
    <TreeStateContext.Provider value={value}>
      {children}
    </TreeStateContext.Provider>
  );
}