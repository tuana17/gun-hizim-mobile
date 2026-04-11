import { Redirect } from 'expo-router';

export default function Index() {
  // Her zaman login sayfasından başla
  return <Redirect href="/login" />;
}
