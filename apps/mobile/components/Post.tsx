import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Post } from 'types/post';
import {
  ChatBubbleIcon,
  LocationIcon,
  HeartIcon,
  ShareIcon,
  CircleIconNav,
} from 'components/Icons';
import { Text } from 'components/Text';
import { ImageViewer } from './ImageViewer';
import { ScrollView } from 'react-native-gesture-handler';
import { Ellipsis, EllipsisVertical, NotebookPen, Pencil, PencilIcon } from 'lucide-react-native';
import { Ellipse } from 'react-native-svg';
import { useResponsive } from 'contexts/ResponsiveContext';
const screenWidth = require('react-native').Dimensions.get('window').width;

interface FeedPostProps extends Post {
  onImagePress: (images: string[], index: number) => void;
  numColumns?: number;
  displayPosterInfo?: boolean;
  displayReactionControls?: boolean;
  containerWidth?: number;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  user,
  location,
  timestamp,
  images,
  caption,
  comment,
  reactions,
  onImagePress,
  numColumns = 1,
  displayPosterInfo = true,
  displayReactionControls = true,
  containerWidth = 0,
}) => {
  return (
    <View
      className={`mb-1 ${numColumns > 1 ? 'rounded-md' : 'rounded-sm'} bg-background-secondary web:lg:rounded-md web:lg:border-[1px] web:lg:border-white/10  web:lg:bg-background web:lg:px-1`}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-2 py-2">
        {displayPosterInfo ? (
          <>
            <View className="flex-row items-center gap-2">
              <Image
                source={{ uri: user.userAvatar }}
                className="h-11 w-11 rounded-full border-2 border-white"
              />
              <Text className="text-md px-1 font-madimi font-semibold">{user.userName}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                onImagePress(
                  images.map((img) => img.url),
                  0
                )
              }
              className="flex-row items-center justify-end gap-3 px-3"
              activeOpacity={0.7}>
              <View className="max-w-32">
                <Text className="text-md text-right font-medium">{location}</Text>
                <Text className="text-xs font-light">{timestamp}</Text>
              </View>
              <View className="h-7 w-5">
                <LocationIcon />
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <View className="w-full flex-row items-center justify-between pl-1">
            <View className="flex-1 flex-row items-center">
              {/* <LocationIcon size={10} /> */}
              <TouchableOpacity
                onPress={() =>
                  onImagePress(
                    images.map((img) => img.url),
                    0
                  )
                }
                activeOpacity={0.7}
                className="ml-1 flex-1">
                <View className="flex-col">
                  <Text className="text-sm font-medium">{location}</Text>
                  <Text className="text-xs font-light">{timestamp}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {}}
              activeOpacity={0.7}
              accessibilityLabel="More options"
              className="size-9 items-center justify-center rounded-full">
              <EllipsisVertical size={25} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Images */}
      <View className={`flex-col gap-[2]`}>
        {containerWidth > 0 &&
          images.map((image, index) => {
            if (index > 0 && numColumns > 1) return null; // only show first image in grid view
            const availableWidth = containerWidth / numColumns;
            const aspectRatio = image.width / image.height;
            const height = availableWidth / aspectRatio;
            const { isDesktop } = useResponsive();
            const padding = 10;

            return (
              <TouchableOpacity
                key={index}
                className="relative"
                activeOpacity={1}
                onPress={() =>
                  onImagePress(
                    images.map((img) => img.url),
                    index
                  )
                }>
                <Image
                  source={{ uri: image.url }}
                  style={{
                    width: availableWidth - padding - numColumns,
                    height,
                    marginHorizontal: 'auto',
                    // borderRadius: 1.5,
                  }}
                  resizeMode="cover"
                />
                {index === 0 && caption && (
                  <View className="absolute bottom-2 left-2 px-0 py-2">
                    <Text className="text-sm ">{caption}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
      </View>

      {/* Footer */}
      <View
        className={`${numColumns > 1 ? 'gap-0' : 'gap-2'} flex-col items-center px-2 pb-4 pt-1`}>
        {/* Reaction controls + Reactions */}
        <View className="mt-1 flex-row items-start justify-between gap-2 self-stretch">
          {/* Reaction controls */}
          {displayReactionControls && (
            <View className="w-46 flex-row items-center gap-3 rounded-lg px-2 py-0.5">
              <HeartIcon size={30} active={false} />
              <ChatBubbleIcon size={27} onPress={() => {}} />
              <ShareIcon size={25} />
            </View>
          )}
          {/* Reactions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            fadingEdgeLength={0}
            className={`${displayReactionControls ? 'pl-3' : 'pl-0'} flex-1`}
            contentContainerStyle={{
              flexDirection: 'row',
              gap: numColumns > 1 ? 0 : 8,
              paddingRight: displayReactionControls ? 12 : 4,
              paddingLeft: displayReactionControls ? 0 : 0,
              alignItems: 'center',
            }}>
            {reactions.map((reaction, index) => (
              <View key={index} className="relative size-10">
                <Image
                  source={{ uri: reaction.userAvatar }}
                  className={`${numColumns > 1 ? 'size-7 border' : 'size-10 border-2'} absolute left-0 rounded-full border-white`}
                />
                <Text
                  className={`${numColumns > 1 ? 'left-3 top-2 text-sm' : 'text-md left-5 top-3'} absolute z-10 items-center justify-center`}>
                  {reaction.emoji}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Comments */}
        <View className={`w-full`}>
          <Text className={`${numColumns > 1 ? 'text-xs' : 'text-sm'}`}>
            <Text className="font-semibold">{user.userName}: </Text>
            {comment}
          </Text>
        </View>
      </View>
    </View>
  );
};
