import React, { useRef, useMemo, useState } from 'react';
import { View, Animated, LayoutChangeEvent } from 'react-native';
import { CircleLogo } from 'components/Icons';
import Blur from 'components/Blur';
import { useResponsive } from 'contexts/ResponsiveContext';

interface HeaderProps {
  children: React.ReactNode;
  scrollY: Animated.Value;
  onHeightChange?: (height: number) => void;
}

function Header({ children, scrollY, onHeightChange }: HeaderProps) {
  const { isDesktop } = useResponsive();

  // Scroll animations - use useMemo to prevent recreating on every render
  const diffClampScrollY = useMemo(() => Animated.diffClamp(scrollY, 0, 300), [scrollY]);

  const headerTranslateY = useMemo(
    () =>
      diffClampScrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -100],
        extrapolate: 'clamp',
      }),
    [diffClampScrollY]
  );

  // Add opacity interpolation for fade effect
  const headerOpacity = useMemo(
    () =>
      diffClampScrollY.interpolate({
        inputRange: [0, 60, 90],
        outputRange: [1, 0.7, 0],
        extrapolate: 'clamp',
      }),
    [diffClampScrollY]
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (onHeightChange) {
      onHeightChange(height);
    }
  };

  return (
    <>
      <Animated.View
        onLayout={handleLayout}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          width: '100%',
          zIndex: 10,
          paddingVertical: 0,
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }}
        pointerEvents="box-none">
        <Blur topBar />
        <View className="web:lg:mx-auto web:lg:w-[90%]" pointerEvents="box-none">
          <View className="native:pt-14 px-4 web:pt-4 web:lg:hidden" pointerEvents="box-none">
            <CircleLogo size={80} />
          </View>
          {children}
        </View>
      </Animated.View>
    </>
  );
}

export default Header;
