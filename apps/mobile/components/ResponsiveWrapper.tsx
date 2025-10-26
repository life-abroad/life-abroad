import { useResponsive } from 'contexts/ResponsiveContext';
import React from 'react';
import { View } from 'react-native';

function ResponsiveWrapper({
  children,
  className = '',
  numColumns = 2,
  handleLayout,
}: {
  children: React.ReactNode;
  className?: string;
  numColumns?: number;
  handleLayout?: (event: any) => void;
}) {
  const { isDesktop } = useResponsive();
  return (
    <View
      style={{ flex: 1 }}
      onLayout={handleLayout}
      className={`${isDesktop && (numColumns === 1 ? 'mx-auto w-[80%]' : 'mx-auto w-[90%]')} ${className}`}>
      {children}
    </View>
  );
}

export default ResponsiveWrapper;
