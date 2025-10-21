import React from 'react';
import { View, Text, Image } from 'react-native';
import { Post } from 'types/post';
import { ChatBubbleIcon, LocationIcon, HeartIcon, ShareIcon } from 'components/Icons';

export const FeedPost: React.FC<Post> = ({
  userName,
  userHandle,
  userAvatar,
  location,
  timestamp,
  images,
  caption,
  comment,
  reactions,
}) => (
  <View className="mb-1">
    <View className="h-16 flex-row items-center px-1 py-0.5">
      <Image source={{ uri: userAvatar }} className="h-11 w-11 rounded-full border border-white" />
      <View className="ml-2 flex-1 flex-row items-center justify-between">
        <View className="flex-1 px-1 py-2.5">
          <Text className="text-lg font-normal text-white" style={{ fontFamily: 'System' }}>
            {userName}
          </Text>
          <Text className="text-sm font-light text-white" style={{ fontFamily: 'System' }}>
            {userHandle}
          </Text>
        </View>
        <View className="flex-row items-center justify-end gap-3 px-3 py-2">
          <View>
            <Text className="text-xl font-normal text-white" style={{ fontFamily: 'System' }}>
              {location}
            </Text>
            <Text className="text-xs font-light text-white" style={{ fontFamily: 'System' }}>
              {timestamp}
            </Text>
          </View>
          <View className="h-7 w-5">
            <LocationIcon />
          </View>
        </View>
      </View>
    </View>

    <View className="bg-white">
      {images.map((image, index) => (
        <View key={index} className="relative">
          <Image
            source={{ uri: image }}
            className="w-full"
            style={{ height: index === images.length - 1 ? 586 : 330 }}
            resizeMode="cover"
          />
          {index === 0 && caption && (
            <View className="absolute bottom-2 left-2 px-0 py-2">
              <Text className="text-sm text-white" style={{ fontFamily: 'System' }}>
                {caption}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>

    <View className="flex-col items-center gap-0.5 py-1">
      <View className="h-16 flex-row items-start justify-between self-stretch">
        <View className="w-46 flex-row items-center gap-2.5 rounded-lg px-2 py-0.5">
          <HeartIcon />
          <ChatBubbleIcon />
          <ShareIcon />
        </View>
        <View className="h-16 w-52 flex-row items-center justify-end gap-1 pr-2">
          {reactions.map((reaction, index) => (
            <View key={index} className="relative h-12 w-14">
              <Image
                source={{ uri: reaction }}
                className="absolute left-0 top-0 h-12 w-12 rounded-full"
              />
              <Image
                source={{
                  uri: 'https://api.builder.io/api/v1/image/assets/TEMP/ca55d5715e5cdda061de1f1254914575bfdcc427?width=54',
                }}
                className="absolute left-7 top-5 h-7 w-7"
              />
            </View>
          ))}
        </View>
      </View>
      <View className="w-full px-2">
        <Text className="text-xl font-normal text-white" style={{ fontFamily: 'System' }}>
          {comment}
        </Text>
      </View>
    </View>
  </View>
);
