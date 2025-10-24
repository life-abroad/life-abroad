import React, { useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Text } from './Text';
import { HeartIcon, ChatBubbleIcon } from './Icons';
import Blur from './Blur';
import Gallery from './Gallery/Gallery';
import { User } from 'types/user';
import { Reaction } from 'types/post';
import { ImageMeta } from '../hooks/useImageViewer';

interface ImageViewerProps {
  images: string[];
  imageIndex: number;
  setImageIndex: (index: number) => void;
  users: User[];
  isVisible: boolean;
  onClose: () => void;
  hideProgressBar?: boolean;
  hideTopBar?: boolean;
  setHideProgressBar?: (hide: boolean) => void;
  sethideTopBar?: (hide: boolean) => void;
  imageMeta: ImageMeta[];
  hideBottomBar?: boolean;
  reactions?: Reaction[][];
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  imageIndex = 0,
  setImageIndex,
  users,
  isVisible,
  onClose,
  hideProgressBar,
  hideTopBar,
  setHideProgressBar,
  sethideTopBar,
  imageMeta,
  hideBottomBar = false,
  reactions = [],
}) => {
  const [hideBars, setHideBars] = React.useState(true);
  const [shouldRender, setShouldRender] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const bottomBarFadeAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setHideBars(false);
  }, [isVisible]);

  React.useEffect(() => {
    Animated.timing(bottomBarFadeAnim, {
      toValue: hideBars ? 0 : 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [hideBars, bottomBarFadeAnim]);

  // Handle fade in/out animation
  React.useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [isVisible, fadeAnim]);

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
        setHideBars(true);
        setHideProgressBar && setHideProgressBar(true);
      } else {
        setHideBars(false);
        setHideProgressBar && setHideProgressBar(false);
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  return (
    <Animated.View
      className="elevation-50 absolute inset-0 left-0 top-0 z-40 flex-1 bg-black"
      style={{ opacity: fadeAnim }}
      pointerEvents={isVisible ? 'auto' : 'none'}>
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

      {/* Top Bar */}
      {!hideTopBar && images.length > 1 && !hideBars && (
        <View className="absolute left-3 top-14 z-50 gap-2 px-3 py-1">
          <Text className="text-white">
            {imageIndex + 1} / {images.length}
          </Text>
          <View className="max-w-32 items-start">
            <Text className="text-md text-left font-medium">{imageMeta[imageIndex]?.location}</Text>
            <Text className="text-xs font-light">{imageMeta[imageIndex]?.timestamp}</Text>
          </View>
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
              setHideBars={setHideBars}
            />
          </View>
        </View>

        {/* Reactions - Above Bottom Bar */}
        {reactions[imageIndex] && reactions[imageIndex].length > 0 && (
          <Animated.View
            className={`absolute ${hideBottomBar ? 'bottom-[2rem]' : 'bottom-[6.5rem]'} left-0 right-0 h-12`}
            style={{
              opacity: bottomBarFadeAnim,
            }}
            pointerEvents={hideBars ? 'none' : 'auto'}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 8,
                paddingRight: 16,
                gap: 8,
                alignItems: 'center',
              }}>
              {reactions[imageIndex].map((reaction, index) => (
                <View key={index} className="relative h-10 w-10">
                  <Image
                    source={{ uri: reaction.userAvatar }}
                    className="absolute left-0 top-0 size-10 rounded-full border border-white"
                  />
                  <Text className="text-md absolute left-5 top-3 z-10 items-center justify-center">
                    {reaction.emoji}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Bottom Bar - Always show controls */}
        {!hideBottomBar && (
          <Animated.View
            className={`absolute bottom-0 left-0 right-0 flex-row items-center justify-between bg-black/40 p-4 pb-8`}
            style={{
              opacity: bottomBarFadeAnim,
            }}
            pointerEvents={hideBars ? 'none' : 'auto'}>
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
                  <Text className="font-madimi text-lg text-white">
                    {users[imageIndex].userName}
                  </Text>
                ) : (
                  <Text className="font-madimi text-lg text-white">Image</Text>
                )}
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-5">
                <HeartIcon size={30} active={false} />
              </TouchableOpacity>
              <TouchableOpacity>
                <ChatBubbleIcon size={25} onPress={() => {}} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};
