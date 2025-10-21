import { HomePage } from 'screens/homepage/HomePage';
import { StatusBar } from 'expo-status-bar';
import BottomNav from 'components/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import { View } from 'react-native';

export default function App() {
  return (
    <View className="bg-background flex-1">
      <HomePage />
      <BottomNav />
      <StatusBar style="light" translucent />
    </View>
  );
}
