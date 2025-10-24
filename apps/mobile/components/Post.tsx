import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Post } from 'types/post';
import { ChatBubbleIcon, LocationIcon, HeartIcon, ShareIcon } from 'components/Icons';
import { Text } from 'components/Text';
import { ImageViewer } from './ImageViewer';
const screenWidth = require('react-native').Dimensions.get('window').width;

interface FeedPostProps extends Post {
  onImagePress: (images: string[], index: number) => void;
  numColumns?: number;
  displayPosterInfo?: boolean;
  displayReactionControls?: boolean;
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
}) => {
  return (
    <TouchableOpacity
      className="mb-1 rounded-md bg-background-secondary"
      onPress={() => onImagePress(images, 0)}
      activeOpacity={0.9}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-1 py-2">
        {displayPosterInfo ? (
          <>
            <View className="flex-row items-center gap-2">
              <Image
                source={{ uri: user.userAvatar }}
                className="h-11 w-11 rounded-full border-2 border-white"
              />
              <Text className="text-md px-1 font-madimi font-semibold">{user.userName}</Text>
            </View>
            <View className="flex-row items-center justify-end gap-3 px-3">
              <View className="max-w-32">
                <Text className="text-md text-right font-medium">{location}</Text>
                <Text className="text-xs font-light">{timestamp}</Text>
              </View>
              <View className="h-7 w-5">
                <LocationIcon />
              </View>
            </View>
          </>
        ) : (
          <View className="w-full flex-col items-start justify-between px-1">
            <View className="-ml-1 flex-row items-center gap-1">
              <LocationIcon size={12} />
              <Text className="text-md font-medium">{location}</Text>
            </View>
            <Text className="text-right text-xs font-light">{timestamp}</Text>
          </View>
        )}
      </View>

      {/* Images */}
      <View className="flex-col gap-[2]">
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            className="relative"
            activeOpacity={1}
            onPress={() => onImagePress(images, index)}>
            {(() => {
              const IntrinsicImage: React.FC = () => {
                const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);

                React.useEffect(() => {
                  Image.getSize(
                    image,
                    (w, h) => setSize({ w, h }),
                    () => setSize({ w: 1, h: 1 }) // fallback
                  );
                }, [image]);

                if (!size) {
                  return <View style={{ width: '100%', height: 200 }} />;
                }

                const height = ((size.h / size.w) * screenWidth) / numColumns;

                return (
                  <Image
                    source={{ uri: image }}
                    className="w-full"
                    style={{ width: '100%', height: height }}
                    resizeMode="contain"
                  />
                );
              };

              return <IntrinsicImage />;
            })()}
            {index === 0 && caption && (
              <View className="absolute bottom-2 left-2 px-0 py-2">
                <Text className="text-sm ">{caption}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View className={`${numColumns > 1 ? 'gap-1' : 'gap-3'} flex-col items-center pb-4 pt-1`}>
        {/* Reaction controls + Reactions */}
        <View className="h-10 flex-row items-start justify-between self-stretch py-2">
          {/* Reaction controls */}
          {displayReactionControls && (
            <View className="w-46 flex-row items-center gap-2.5 rounded-lg px-2 py-0.5">
              <HeartIcon size={30} />
              <ChatBubbleIcon size={23} onPress={() => {}} />
              <ShareIcon size={25} />
            </View>
          )}
          {/* Reactions */}
          <View
            className={`h-10 w-52 flex-row ${numColumns > 1 ? '' : 'gap-2'} ${displayReactionControls ? 'justify-end pr-3' : 'justify-start pl-1'} `}>
            {reactions.map((reaction, index) => (
              <View key={index} className="relative h-10 w-10">
                <Image
                  source={{ uri: reaction.userAvatar }}
                  className={`${numColumns > 1 ? 'size-7' : 'size-10'} absolute -top-1 left-0 rounded-full border border-white`}
                />
                <Text
                  className={`${numColumns > 1 ? 'left-3 top-2 text-sm' : 'text-md left-5 top-3'} absolute z-10 items-center justify-center`}>
                  {reaction.emoji}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {/* Comments */}
        <View className="w-full px-2">
          <Text className={`${numColumns > 1 ? 'text-xs' : 'text-md font-normal'}`}>{comment}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
