import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

import './global.css';

export default function App() {
  return (
    <>
      <ScreenContent title="Circle" path="App.tsx"></ScreenContent>
      <StatusBar style="dark" />
    </>
  );
}
