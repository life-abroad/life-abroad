import React, { useRef, useState } from 'react';
import { View, Image, Animated, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { FeedPost } from '../../components/Post';
import { chats, bulletins } from './mockData';
import { CameraIcon, ChatBubbleIcon, CircleLogo } from 'components/Icons';
import { Text } from 'components/Text';
import Blur from 'components/Blur';
import ChatRow from 'components/ChatRow';
import Header from 'components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

export const ChatPage = () => {
  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const handleChatPress = (chatItem: (typeof chats)[0]) => {
    // Handle chat row press
    console.log('Chat pressed:', chatItem.user.userName);
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollX = contentOffset.x;
    const maxScrollX = contentSize.width - layoutMeasurement.width;

    // Show left gradient if scrolled right (not at the start)
    setShowLeftGradient(scrollX > 5);

    // Show right gradient if not at the end
    setShowRightGradient(scrollX < maxScrollX - 5);
  };

  return (
    <View className="flex-1 bg-background-secondary">
      {chats && chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ChatRow
              user={item.user}
              unreadCount={item.unreadCount}
              lastMessage={item.lastMessage}
              timestamp={item.timestamp}
              onPress={() => handleChatPress(item)}
            />
          )}
          onScroll={(event) => {
            scrollY.setValue(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          className="flex-1"
          contentContainerStyle={{ paddingTop: 190, paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text>No posts available</Text>
        </View>
      )}

      {/* bulletins - Floating Header */}
      <Header scrollY={scrollY}>
        {/* bulletins row */}
        <View className="relative py-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            fadingEdgeLength={15}
            className="w-[100%]">
            <View className={`flex-row items-center gap-2 px-3`}>
              {bulletins.map((bulletin, index) => {
                const isGray = index >= bulletins.length - 2;
                return (
                  <TouchableOpacity
                    key={index}
                    className="relative items-center"
                    onPress={() => 0}
                    activeOpacity={0.8}>
                    {/* Message bubble */}
                    <View className="z-10 -mb-3 h-[60px] w-[80px] justify-center overflow-hidden rounded-2xl bg-white px-1 py-2 shadow-md">
                      <ImageBackground
                        source={require('../../assets/textures/snow.png')}
                        resizeMode="repeat"
                        className={`absolute inset-0 opacity-100`}
                      />
                      <Text className="text-center text-[0.6rem] leading-tight text-gray-900">
                        {bulletin.content}
                      </Text>
                    </View>
                    {/* Avatar */}
                    <Image
                      source={{ uri: bulletin.user.userAvatar }}
                      className={`h-[50] w-[50] rounded-full border-2 border-white`}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Header>
      <View className="absolute bottom-28 right-4 items-center justify-center">
        <ChatBubbleIcon active size={35} onPress={() => {}} />
      </View>
    </View>
  );
};
