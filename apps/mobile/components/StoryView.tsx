import React, { useState, useEffect } from 'react';
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
import { Post } from '../types/post';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface StoryViewProps {
  stories: Post[];
  initialIndex: number;
  isVisible: boolean;
  onClose: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  stories,
  initialIndex,
  isVisible,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress] = useState(new Animated.Value(0));

  // Update current index when initialIndex prop changes
  useEffect(() => {
    if (isVisible) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isVisible]);

  // Reset timer and progress when story changes
  useEffect(() => {
    progress.setValue(0);

    // Auto-progress animation
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 5000, // 5 seconds per story
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });

    return () => {
      animation.stop();
    };
  }, [currentIndex, isVisible]);

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
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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

  if (!stories[currentIndex]) {
    return null;
  }

  const currentStory = stories[currentIndex];

  return (
    <Modal visible={isVisible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black" {...panResponder.panHandlers}>
        {/* Progress Bar */}
        <View className="absolute left-0 right-0 top-11 z-10 flex-row px-2">
          {stories.map((_, index) => (
            <View key={index} className="mx-0.5 h-1 flex-1 overflow-hidden rounded bg-gray-500">
              <Animated.View
                className="h-full bg-white"
                style={{
                  width:
                    index === currentIndex
                      ? progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        })
                      : index < currentIndex
                        ? '100%'
                        : '0%',
                }}
              />
            </View>
          ))}
        </View>

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
          <Image source={{ uri: currentStory.images[0] }} className="flex-1" resizeMode="contain" />
        </TouchableOpacity>

        {/* Bottom Bar */}
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between p-4">
          {/* User Info */}
          <View className="flex-row items-center">
            <Image
              source={{ uri: currentStory.user.userAvatar }}
              className="h-12 w-12 rounded-full border-2 border-white"
            />
            <View className="ml-3">
              <Text className="font-madimi text-lg text-white">{currentStory.user.userName}</Text>
              <Text className="text-sm text-white opacity-80">{currentStory.user.userHandle}</Text>
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
      </View>
    </Modal>
  );
};
