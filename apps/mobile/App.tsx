import { HomePage } from 'screens/homepage/HomePage';
import { StatusBar } from 'expo-status-bar';

import './global.css';

export default function App() {
  return (
    <>
      <HomePage />
      <StatusBar style="light" />
    </>
  );
}
