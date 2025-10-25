import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface PageTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  direction?: 'left' | 'right';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isActive,
  direction = 'left',
}) => {
  const opacity = useSharedValue(isActive ? 1 : 0);
  const translateX = useSharedValue(isActive ? 0 : direction === 'left' ? -50 : 50);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    translateX.value = withTiming(isActive ? 0 : direction === 'left' ? -50 : 50, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      pointerEvents={isActive ? 'auto' : 'none'}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
});
