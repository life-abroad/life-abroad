import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { Text } from './Text';
import { HeartIcon, ChatBubbleIcon } from './Icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

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

  // Animation values for open/close effect
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(1.1)).current;

  // Animation values for slide transitions
  const imageOpacity = React.useRef(new Animated.Value(1)).current;

  // Update current index when initialIndex prop changes
  React.useEffect(() => {
    if (isVisible) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isVisible]);

  // Animation for open/close
  React.useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  // Animation for transitioning between images
  const animateToNextImage = (nextIndex: number) => {
    // Determine direction of animation (left or right)

    // Fade out current image slightly
    Animated.timing(imageOpacity, {
      toValue: 0.5,
      duration: 10,
      useNativeDriver: true,
    }).start(() => {
      // Update the current index
      setCurrentIndex(nextIndex);

      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Pan responder for swipe gestures
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        // Vertical swipe to close
        if (gestureState.dy > 50) {
          onClose();
          return;
        }

        // Horizontal swipes
        if (Math.abs(gestureState.dx) > 50) {
          if (gestureState.dx > 0) {
            handlePrev();
          } else {
            handleNext();
          }
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      animateToNextImage(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      animateToNextImage(currentIndex - 1);
    }
  };

  const handleTapNavigation = (x: number) => {
    const tapThreshold = SCREEN_WIDTH / 3;

    // Tapped on right side
    if (x > SCREEN_WIDTH - tapThreshold) {
      handleNext();
    }
    // Tapped on left side
    else if (x < tapThreshold) {
      handlePrev();
    }
  };

  if (!images || !images[currentIndex]) {
    return null;
  }

  return (
    <Modal visible={isVisible} transparent={false} animationType="none" onRequestClose={onClose}>
      <Animated.View
        className="flex-1 bg-black"
        {...panResponder.panHandlers}
        style={{
          opacity,
          transform: [{ scale }],
        }}>
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

        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute right-4 top-14 z-10 h-8 w-8 items-center justify-center">
          <Text className="text-xl font-bold text-white">✕</Text>
        </TouchableOpacity>

        {/* Main Image */}
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1"
          onPress={(e) => handleTapNavigation(e.nativeEvent.locationX)}>
          <Animated.Image
            source={{ uri: images[currentIndex] }}
            className="flex-1"
            resizeMode="contain"
            style={{
              opacity: imageOpacity,
            }}
          />
        </TouchableOpacity>

        {/* Bottom Bar - Always show controls */}
        <View className="absolute bottom-4 left-0 right-0 flex-row items-center justify-between bg-black/40 p-4">
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
      </Animated.View>
    </Modal>
  );
};
