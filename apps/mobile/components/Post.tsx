import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
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
    <View
      className={`mb-1 ${numColumns > 1 ? 'rounded-md' : 'rounded-sm'} bg-background-secondary`}>
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
            <TouchableOpacity
              onPress={() => onImagePress(images, 0)}
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
          <View className="flex-row items-center pl-1">
            <View className="flex-1 flex-row items-center">
              {/* <LocationIcon size={10} /> */}
              <TouchableOpacity
                onPress={() => onImagePress(images, 0)}
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
      <View className={`flex-col ${numColumns > 1 ? 'gap-[0]' : 'gap-[2]'}`}>
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

                // Account for horizontal padding (0.5 * 2 = 1 in tailwind units, which is 4px)
                const paddingOffset = 2; // px-0.5 = 2px on each side (It should be 4, but I made it 2 because fuck you)
                const availableWidth = (screenWidth - paddingOffset) / numColumns;
                const height = (size.h / size.w) * availableWidth;

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
      <View className={`${numColumns > 1 ? 'gap-0' : 'gap-2'} flex-col items-center pb-4 pt-1`}>
        {/* Reaction controls + Reactions */}
        <View className="mt-1 flex-row items-start justify-between self-stretch">
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
            fadingEdgeLength={15}
            className={`${displayReactionControls ? 'pl-3' : 'pl-0.5'} flex-1`}
            contentContainerStyle={{
              flexDirection: 'row',
              gap: numColumns > 1 ? 0 : 8,
              paddingRight: displayReactionControls ? 12 : 4,
              paddingLeft: displayReactionControls ? 0 : 4,
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
        <View className={`${numColumns > 1 ? 'pl-3 pr-2' : 'px-2'} w-full`}>
          <Text className={`${numColumns > 1 ? 'text-xs' : 'text-sm'}`}>
            <Text className="font-semibold">{user.userName}: </Text>
            {comment}
          </Text>
        </View>
      </View>
    </View>
  );
};
