import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PhoneFrame } from '../src/PhoneFrame';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PhoneFrame>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#fff' },
          }}
        />
      </PhoneFrame>
    </SafeAreaProvider>
  );
}
