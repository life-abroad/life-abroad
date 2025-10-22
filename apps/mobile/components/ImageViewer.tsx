import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Text } from './Text';
import { HeartIcon, ChatBubbleIcon } from './Icons';
import Blur from './Blur';

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  isVisible: boolean;
  onClose: () => void;
  showControls?: boolean;
  userInfo?: {
    userName?: string;
    userHandle?: string;
    userAvatar?: string;
  };
  showProgressBar?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  initialIndex = 0,
  isVisible,
  onClose,
  showControls = true,
  userInfo,
  showProgressBar = false,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [hideBottomBar, setHideBottomBar] = React.useState(false);
  const [screenDimensions, setScreenDimensions] = React.useState(Dimensions.get('window'));

  // Animation values for transitions
  const position = React.useRef(new Animated.ValueXY()).current;
  const imageOpacity = React.useRef(new Animated.Value(1)).current;

  // Zoom and pan state
  const scale = React.useRef(new Animated.Value(1)).current;
  const translateX = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const lastScale = React.useRef(1);
  const lastTranslate = React.useRef({ x: 0, y: 0 });
  const initialDistance = React.useRef(0);
  const initialCenter = React.useRef({ x: 0, y: 0 });
  const baseScale = React.useRef(1);

  // Update screen dimensions when orientation changes
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Update current index when initialIndex prop changes
  React.useEffect(() => {
    if (isVisible) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isVisible]);

  // Handle screen orientation - unlock when modal opens, lock to portrait when it closes
  React.useEffect(() => {
    if (isVisible) {
      // Allow all orientations when image viewer is open
      ScreenOrientation.unlockAsync();
    } else {
      // Lock to portrait when image viewer is closed
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }

    // Cleanup: lock to portrait when component unmounts
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [isVisible]);

  // Track touch positions for tap navigation
  const tapStartTime = React.useRef(0);
  const [tapPosition, setTapPosition] = React.useState({ x: 0, y: 0 });
  const lastTapTime = React.useRef(0);
  const isPinching = React.useRef(false);

  // Helper function to calculate distance between two touches
  const getDistance = (touches: any[]) => {
    const [touch1, touch2] = touches;
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Helper function to get center point between two touches
  const getCenter = (touches: any[]) => {
    const [touch1, touch2] = touches;
    return {
      x: (touch1.pageX + touch2.pageX) / 2,
      y: (touch1.pageY + touch2.pageY) / 2,
    };
  };

  // Reset zoom when image changes
  React.useEffect(() => {
    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
    lastScale.current = 1;
    lastTranslate.current = { x: 0, y: 0 };
  }, [currentIndex]);

  // Pan responder for handling all gestures (swipes and taps)
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onShouldBlockNativeResponder: (evt, gestureState) => {
          return true;
        },
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          console.log('Gesture grant');

          // Record tap start time and position
          tapStartTime.current = Date.now();
          setTapPosition({
            x: evt.nativeEvent.locationX,
            y: evt.nativeEvent.locationY,
          });

          // Get current animated values - using ._value which is the internal value
          lastScale.current = (scale as any)._value;
          lastTranslate.current = {
            x: (translateX as any)._value,
            y: (translateY as any)._value,
          };

          console.log('Starting gesture with scale:', lastScale.current);

          // Initialize pinch gesture
          const touches = evt.nativeEvent.touches;
          if (touches.length >= 2) {
            isPinching.current = true;
            // Calculate and store the initial distance between fingers
            initialDistance.current = getDistance(touches);
            initialCenter.current = getCenter(touches);
            // Store the base scale that we'll be modifying
            baseScale.current = lastScale.current;

            console.log('Pinch gesture started, initial distance:', initialDistance.current);
          } else {
            // Just mark as not pinching, but don't reset the distance yet
            // so we can recover if a finger temporarily loses contact
            isPinching.current = false;
            // Don't reset initialDistance here
          }

          return true;
        },
        onPanResponderMove: (event, gestureState) => {
          console.log('Gesture move');
          const touches = event.nativeEvent.touches;

          if (touches.length >= 2) {
            // Pinch-to-zoom logic
            const currentDistance = getDistance(touches);
            const currentCenter = getCenter(touches);

            // If this is the first move with 2+ fingers and initial distance wasn't set,
            // initialize it now to avoid division by zero
            if (initialDistance.current === 0) {
              console.log('Setting initial distance during move:', currentDistance);
              initialDistance.current = currentDistance;
              initialCenter.current = currentCenter;
              baseScale.current = lastScale.current;
              isPinching.current = true;
              return true; // Skip this frame to establish baseline
            }

            console.log(
              'Current distance:',
              currentDistance,
              'Initial distance:',
              initialDistance.current
            );

            // Ensure we have a valid initial distance
            if (initialDistance.current > 0) {
              isPinching.current = true;
              // Calculate the scale factor properly
              const scaleFactor = currentDistance / initialDistance.current;
              const newScale = baseScale.current * scaleFactor;

              // Limit scale between 1x and 5x
              const clampedScale = Math.max(1, Math.min(5, newScale));

              console.log(
                'Pinch zoom - scaleFactor:',
                scaleFactor.toFixed(2),
                'new scale:',
                clampedScale.toFixed(2),
                'from base:',
                baseScale.current.toFixed(2)
              );

              // Apply scale
              scale.setValue(clampedScale);

              // Calculate pan to keep zoom centered on pinch point
              if (clampedScale > 1 && initialCenter.current) {
                // Calculate offsets to keep pinch point stable
                const dx = currentCenter.x - initialCenter.current.x;
                const dy = currentCenter.y - initialCenter.current.y;

                // Apply translation
                translateX.setValue(lastTranslate.current.x + dx / clampedScale);
                translateY.setValue(lastTranslate.current.y + dy / clampedScale);

                console.log('Applying translation:', dx, dy);
              }
            }
          } else if (lastScale.current > 1) {
            // Single finger pan when zoomed in
            const newX = lastTranslate.current.x + gestureState.dx;
            const newY = lastTranslate.current.y + gestureState.dy;

            // Apply pan limits based on zoom level
            const maxPan = ((lastScale.current - 1) * screenDimensions.width) / 2;
            const clampedX = Math.max(-maxPan, Math.min(maxPan, newX));
            const clampedY = Math.max(-maxPan, Math.min(maxPan, newY));

            translateX.setValue(clampedX);
            translateY.setValue(clampedY);
          }

          return true;
        },
        onPanResponderRelease: (evt: GestureResponderEvent, gestureState) => {
          const currentTime = Date.now();
          const tapDuration = tapStartTime.current > 0 ? currentTime - tapStartTime.current : 0;
          const { dx, dy } = gestureState;

          console.log('Gesture released, updating scale/position');

          // Update last scale and translate values
          lastScale.current = (scale as any)._value;
          lastTranslate.current = {
            x: (translateX as any)._value,
            y: (translateY as any)._value,
          };

          console.log('Updated values:', {
            scale: lastScale.current,
            translateX: lastTranslate.current.x,
            translateY: lastTranslate.current.y,
          });

          // If we were pinching, don't treat this as a navigation gesture
          if (isPinching.current) {
            console.log('Pinch gesture ended with scale:', lastScale.current);
            isPinching.current = false;
            // Now it's safe to reset the initial distance
            initialDistance.current = 0;
            return true;
          }

          // If zoomed in, don't handle navigation gestures
          if (lastScale.current > 1) {
            return true;
          }

          // Handle as tap if minimal movement and short duration
          if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && tapDuration < 300) {
            console.log('Tap detected - handling navigation');
            handleTapNavigation(evt.nativeEvent.locationX);
            position.setValue({ x: 0, y: 0 });
            return;
          }

          // Vertical swipe to close
          if (Math.abs(dy) > 100) {
            console.log('Vertical swipe detected - closing viewer');
            onClose();
            position.setValue({ x: 0, y: 0 });
            return;
          }

          // Horizontal swipes for navigation
          if (Math.abs(dx) > 50) {
            console.log('Horizontal swipe detected - navigating images');
            if (dx > 0) {
              handlePrev();
            } else {
              handleNext();
            }
            position.setValue({ x: 0, y: 0 });
          }
          return true;
        },
        onPanResponderEnd: (e, gestureState) => {
          console.log(gestureState);
          return true;
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [currentIndex, images.length, onClose, position]
  );

  const handleNext = () => {
    console.log('handleNext called - currentIndex:', currentIndex, 'images length:', images.length);
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log('currentIndex:', currentIndex, '-> nextIndex:', nextIndex);
      // Update the current index
      setCurrentIndex(nextIndex);
    } else {
      //   onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
    }
  };

  const handleTapNavigation = (x: number) => {
    const tapThreshold = screenDimensions.width / 3;
    const currentTime = Date.now();
    const isDoubleTap = currentTime - lastTapTime.current < 300;
    lastTapTime.current = currentTime;

    // Handle double tap to zoom
    if (isDoubleTap) {
      if (lastScale.current > 1) {
        // Reset zoom
        console.log('Double tap - resetting zoom');

        // Animate back to original size
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        ]).start();

        // Update reference values
        lastScale.current = 1;
        lastTranslate.current = { x: 0, y: 0 };
        baseScale.current = 1;
      } else {
        // Zoom in to 2x centered on tap point
        console.log('Double tap - zooming to 2x at point:', x, tapPosition.y);

        // Calculate focal point for zooming (relative to center)
        const focusX = x - screenDimensions.width / 2;
        const focusY = tapPosition.y - screenDimensions.height / 2;

        // Move the focus point to center when zooming
        const newTranslateX = -focusX / 2; // Divide by 2 because we're zooming 2x
        const newTranslateY = -focusY / 2;

        console.log('Setting zoom translation to:', newTranslateX, newTranslateY);

        // Animate both scale and position
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 2,
            useNativeDriver: true,
            friction: 7,
          }),
          Animated.spring(translateX, {
            toValue: newTranslateX,
            useNativeDriver: true,
            friction: 7,
          }),
          Animated.spring(translateY, {
            toValue: newTranslateY,
            useNativeDriver: true,
            friction: 7,
          }),
        ]).start();

        // Update reference values immediately (don't wait for animation)
        lastScale.current = 2;
        lastTranslate.current = { x: newTranslateX, y: newTranslateY };
        baseScale.current = 2;

        // Reset pinch gesture state
        initialDistance.current = 0;
        isPinching.current = false;
      }
      return;
    }

    console.log(
      'Tap detected at:',
      x,
      'Screen width:',
      screenDimensions.width,
      'Threshold:',
      tapThreshold
    );

    // Tapped on right side
    if (x > screenDimensions.width - tapThreshold) {
      console.log('Right tap navigation - next image');
      handleNext();
    }
    // Tapped on left side
    else if (x < tapThreshold) {
      console.log('Left tap navigation - previous image');
      handlePrev();
    } else {
      console.log('Center tap - hiding/showing bottom bar');
      setHideBottomBar((prev) => !prev);
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
      {/* Progress Bar */}
      {showProgressBar && (
        <View className="absolute left-0 right-0 top-11 z-20 flex-row px-2">
          {images.map((_, index) => (
            <View key={index} className="mx-0.5 h-1 flex-1 overflow-hidden rounded bg-gray-500">
              <Animated.View
                className="h-full bg-white"
                style={{
                  width: index <= currentIndex ? '100%' : '0%',
                }}
              />
            </View>
          ))}
        </View>
      )}

      <Blur />
      {/* Black overlay */}
      <View className="absolute inset-0 bg-black/50" />

      {/* Close Button */}
      <TouchableOpacity
        onPress={onClose}
        className="absolute right-4 top-14 z-10 h-8 w-8 items-center justify-center">
        <Text className="text-2xl font-bold text-white">✕</Text>
      </TouchableOpacity>

      {/* Main Image */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.Image
          source={{ uri: images[currentIndex] }}
          style={{
            width: '100%',
            height: '100%',
            opacity: imageOpacity,
            transform: [{ scale: scale }, { translateX: translateX }, { translateY: translateY }],
          }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Bottom Bar - Always show controls */}
      <View
        className={`absolute bottom-0 left-0 right-0 flex-row items-center justify-between bg-black/40 p-4 pb-8 ${hideBottomBar ? 'hidden' : 'flex'}`}>
        {/* User Info */}
        <View className="flex-row items-center">
          {userInfo && userInfo.userAvatar ? (
            <Image
              source={{ uri: userInfo.userAvatar }}
              className="h-12 w-12 rounded-full border-2 border-white"
            />
          ) : (
            <View className="h-12 w-12 rounded-full border-2 border-white bg-gray-500" />
          )}
          <View className="ml-3">
            {userInfo && userInfo.userName ? (
              <Text className="font-madimi text-lg text-white">{userInfo.userName}</Text>
            ) : (
              <Text className="font-madimi text-lg text-white">Image</Text>
            )}
            {/* {userInfo && userInfo.userHandle && (
                  <Text className="text-sm text-white opacity-80">{userInfo.userHandle}</Text>
                )} */}
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-5">
            <HeartIcon size={28} />
          </TouchableOpacity>
          <TouchableOpacity>
            <ChatBubbleIcon size={25} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image counter for multiple images */}
      {images.length > 1 && (
        <View className="absolute left-3 top-14 rounded-full bg-black/50 px-3 py-1">
          <Text className="text-white">
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      )}
    </Modal>
  );
};
