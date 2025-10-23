import React, { useRef } from 'react';
import { View, Animated } from 'react-native';
import { CircleLogo } from 'components/Icons';
import Blur from 'components/Blur';

function Header({ children, scrollY }: { children: React.ReactNode; scrollY: Animated.Value }) {
  // Scroll animations
  const diffClampScrollY = Animated.diffClamp(scrollY, 0, 300);
  const headerTranslateY = diffClampScrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });
  // Add opacity interpolation for fade effect
  const headerOpacity = diffClampScrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View
        className="absolute left-0 right-0 top-0 py-0"
        style={{
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }}>
        <Blur topBar />
        <View className="px-4 pt-14">
          <CircleLogo size={80} />
        </View>
        {children}
      </Animated.View>
    </>
  );
}

export default Header;
