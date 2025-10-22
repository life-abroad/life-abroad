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

  // Pan responder for handling all gestures (swipes and taps)
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only hijack the gesture if there's significant movement
          console.log('Gesture dx:', gestureState.dx, 'dy:', gestureState.dy);
          return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
        },
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          console.log('Gesture grant');

          // Record tap start time and position
          tapStartTime.current = Date.now();
          setTapPosition({
            x: evt.nativeEvent.locationX,
            y: evt.nativeEvent.locationY,
          });
        },
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (evt: GestureResponderEvent, gestureState) => {
          const currentTime = Date.now();
          const tapDuration = tapStartTime.current > 0 ? currentTime - tapStartTime.current : 0;
          const { dx, dy } = gestureState;
          console.log(
            'Gesture released with dx:',
            gestureState.dx,
            'dy:',
            gestureState.dy,
            'duration:',
            tapDuration,
            'ms'
          );

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
        },
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
        }}>
        <Animated.Image
          source={{ uri: images[currentIndex] }}
          style={{ flex: 1, opacity: imageOpacity }}
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
