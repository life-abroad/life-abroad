import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Text } from './Text';
import { HeartIcon, ChatBubbleIcon } from './Icons';
import Blur from './Blur';
import Gallery from './Gallery/Gallery';
import { User } from 'types/post';

interface ImageViewerProps {
  images: string[];
  imageIndex: number;
  setImageIndex: (index: number) => void;
  users: User[];
  isVisible: boolean;
  onClose: () => void;
  hideProgressBar?: boolean;
  hideCounter?: boolean;
  setHideProgressBar?: (hide: boolean) => void;
  setHideCounter?: (hide: boolean) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  imageIndex = 0,
  setImageIndex,
  users,
  isVisible,
  onClose,
  hideProgressBar,
  hideCounter,
  setHideProgressBar,
  setHideCounter,
}) => {
  const [hideBottomBar, setHideBottomBar] = React.useState(false);

  // Handle screen orientation - unlock when viewer opens, lock to portrait when it closes
  React.useEffect(() => {
    if (isVisible) {
      // Allow all orientations when image viewer is open
      ScreenOrientation.unlockAsync();
      // Hide status bar when viewer is open
      StatusBar.setHidden(true);
    } else {
      // Lock to portrait when image viewer is closed
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      // Show status bar when viewer is closed
      StatusBar.setHidden(false);
    }

    // Cleanup: lock to portrait and show status bar when component unmounts
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      StatusBar.setHidden(false);
    };
  }, [isVisible]);

  // When landscape, hide bottom bar, hide progress bar
  React.useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      const orientationInfo = event.orientationInfo;
      if (
        orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setHideBottomBar(true);
        setHideProgressBar && setHideProgressBar(true);
      } else {
        setHideBottomBar(false);
        setHideProgressBar && setHideProgressBar(false);
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // If not visible, don't render anything
  if (!isVisible) {
    return null;
  }

  return (
    <View className="elevation-50 absolute inset-0 left-0 top-0 z-40 flex-1 bg-black">
      {/* Progress Bar */}
      {!hideProgressBar && images.length > 1 && (
        <View className="absolute left-0 right-0 top-1 z-50 h-1 flex-row px-2">
          {images.map((_, index) => (
            <View key={index} className="mx-0.5 h-1 flex-1 overflow-hidden rounded bg-gray-500">
              <Animated.View
                className="h-full bg-white"
                style={{
                  width: imageIndex === index ? '100%' : imageIndex > index ? '100%' : '0%',
                }}
              />
            </View>
          ))}
        </View>
      )}

      {/* Image counter for multiple images */}
      {!hideCounter && images.length > 1 && (
        <View className="absolute left-3 top-14 z-50 rounded-full bg-black/50 px-3 py-1">
          <Text className="text-white">
            {imageIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      <Blur />
      {/* Black overlay */}
      <View className="absolute inset-0 bg-black/50" />

      <SafeAreaView className="flex-1">
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute right-4 top-14 z-10 h-8 w-8 items-center justify-center">
          <Text className="text-2xl font-bold text-white">✕</Text>
        </TouchableOpacity>

        {/* Main Image */}
        <View className="flex-1 items-center justify-center">
          <View className="h-[100%] w-[100%]">
            <Gallery
              images={images}
              currentIndex={imageIndex}
              onIndexChange={setImageIndex}
              onVerticalPull={onClose}
            />
          </View>
        </View>

        {/* Bottom Bar - Always show controls */}
        <View
          className={`absolute bottom-0 left-0 right-0 flex-row items-center justify-between bg-black/40 p-4 pb-8 ${hideBottomBar ? 'hidden' : 'flex'}`}>
          {/* User Info */}
          <View className="flex-row items-center">
            {users && users[imageIndex] ? (
              <Image
                source={{ uri: users[imageIndex].userAvatar }}
                className="h-12 w-12 rounded-full border-2 border-white"
              />
            ) : (
              <View className="h-12 w-12 rounded-full border-2 border-white bg-gray-500" />
            )}
            <View className="ml-3">
              {users && users[imageIndex] ? (
                <Text className="font-madimi text-lg text-white">{users[imageIndex].userName}</Text>
              ) : (
                <Text className="font-madimi text-lg text-white">Image</Text>
              )}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-5">
              <HeartIcon size={34} />
            </TouchableOpacity>
            <TouchableOpacity>
              <ChatBubbleIcon size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
