import React, { useState, useEffect } from 'react';
import { View, Animated, Dimensions, PanResponder } from 'react-native';
import { ImageViewer } from './ImageViewer';
import { Post } from '../types/post';

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

  // Update current index when initialIndex prop changes
  useEffect(() => {
    if (isVisible) {
      setCurrentIndex(initialIndex);
    } else {
      // Reset index when closing
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isVisible]);

  if (!isVisible || !stories || !stories[currentIndex]) {
    return null;
  }

  const currentStory = stories[currentIndex];
  const storyImages = stories.map((story) => story.images[0]);

  return (
    <ImageViewer
      images={storyImages}
      initialIndex={currentIndex}
      isVisible={isVisible}
      onClose={onClose}
      userInfo={{
        userName: currentStory.user.userName,
        userHandle: currentStory.user.userHandle,
        userAvatar: currentStory.user.userAvatar,
      }}
      showProgressBar={true}
    />
  );
};
