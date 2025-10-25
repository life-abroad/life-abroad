import React, { createContext, useContext, ReactNode } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

interface ResponsiveContextType {
  width: number;
  height: number;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isWeb: boolean;
  isNative: boolean;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export function ResponsiveProvider({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();

  const value: ResponsiveContextType = {
    width,
    height,
    // Tailwind breakpoints: sm: 640px, md: 768px, lg: 1024px, xl: 1280px
    isDesktop: Platform.OS === 'web' && width >= 1024,
    isTablet: Platform.OS === 'web' && width >= 768 && width < 1024,
    isMobile: Platform.OS !== 'web' || width < 768,
    isWeb: Platform.OS === 'web',
    isNative: Platform.OS !== 'web',
  };

  return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
}

export function useResponsive() {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
}
