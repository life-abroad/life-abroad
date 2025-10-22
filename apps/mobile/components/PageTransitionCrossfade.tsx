import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface PageTransitionCrossfadeProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const PageTransitionCrossfade: React.FC<PageTransitionCrossfadeProps> = ({
  children,
  isActive,
}) => {
  const opacity = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
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
    ...StyleSheet.absoluteFillObject,
  },
});
