import { HomePage } from 'screens/homepage/HomePage';
import { ChatPage } from 'screens/chatList/ChatPage';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { MadimiOne_400Regular } from '@expo-google-fonts/madimi-one';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomNav from 'components/BottomNav';

const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [hideNav, setHideNav] = useState(false);

  const [fontsLoaded] = useFonts({
    MadimiOne_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: 'rgb(255, 255, 255)',
            background: 'rgb(0, 0, 0)',
            card: 'rgb(0, 0, 0)',
            text: 'rgb(255, 255, 255)',
            border: 'rgb(0, 0, 0)',
            notification: 'rgb(255, 59, 48)',
          },
          fonts: {
            regular: { fontFamily: 'System', fontWeight: '400' },
            medium: { fontFamily: 'System', fontWeight: '500' },
            bold: { fontFamily: 'System', fontWeight: '700' },
            heavy: { fontFamily: 'System', fontWeight: '900' },
          },
        }}>
        <View className="flex-1 bg-background">
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: 'none' },
            }}
            tabBar={(props) => (
              <View className={`absolute bottom-0 left-0 right-0 z-30 ${hideNav ? 'hidden' : ''}`}>
                <BottomNav
                  selectedTab={props.state.routes[props.state.index].name}
                  setSelectedTab={(tab) => {
                    const route = props.state.routes.find((r) => r.name === tab);
                    if (route) {
                      props.navigation.navigate(route.name);
                    }
                  }}
                />
              </View>
            )}>
            <Tab.Screen name="home">{() => <HomePage setHideNav={setHideNav} />}</Tab.Screen>
            <Tab.Screen name="chat" component={ChatPage} />
          </Tab.Navigator>
          <StatusBar style="light" translucent />
        </View>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
