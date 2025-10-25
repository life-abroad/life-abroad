import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface HeaderContextType {
  headerContent: ReactNode;
  setHeaderContent: (content: ReactNode) => void;
  rightHeaderContent: ReactNode;
  setRightHeaderContent: (content: ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerContent, setHeaderContent] = useState<ReactNode>(null);
  const [rightHeaderContent, setRightHeaderContent] = useState<ReactNode>(null);

  const value = useMemo(
    () => ({
      headerContent,
      setHeaderContent,
      rightHeaderContent,
      setRightHeaderContent,
    }),
    [headerContent, rightHeaderContent]
  );

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}
