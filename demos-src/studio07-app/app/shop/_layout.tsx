import { Stack } from 'expo-router';
import { CartProvider } from '../../src/cart';

export default function ShopLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </CartProvider>
  );
}
