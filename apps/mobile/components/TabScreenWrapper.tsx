import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface TabScreenWrapperProps {
  children: React.ReactNode;
  isFocused: boolean;
}

export const TabScreenWrapper: React.FC<TabScreenWrapperProps> = ({ children, isFocused }) => {
  const opacity = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(isFocused ? 1 : 0, {
      duration: 0,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      pointerEvents={isFocused ? 'auto' : 'none'}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
