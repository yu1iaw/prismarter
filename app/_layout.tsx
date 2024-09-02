import { router, Slot, SplashScreen, Stack, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { UserContextProvider, useUserContext } from '@/contexts/user-provider';
import { initializeDb } from '@/lib/db';
import { getStorageData } from '@/lib/storage-helper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function InitialLayout() {  
  const [dbIsInitialized, setDbIsInitialized] = useState(false);
  const { isLoggedIn } = useUserContext();
  const segments = useSegments();
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
  })

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

  }, [fontsLoaded, error])


  useEffect(() => {
    (async () => {
      await initializeDb();
      setDbIsInitialized(true);
    })()
  }, [])

  useEffect(() => {    
    const inTabsGroup = segments[0] === "(tabs)";
    const inSearchRoute = segments[0] === "search";

    if (isLoggedIn && !inTabsGroup) {
      router.replace('/home');
    }
    if ((inTabsGroup || inSearchRoute) && !isLoggedIn) {
      router.replace('/sign-in');
    } 
  }, [isLoggedIn])


  if (!dbIsInitialized || !fontsLoaded) {
    return <Slot />
  }
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="search/[query]" />
    </Stack>
  )
}

export default function RootLayout<T>() {
  const [storageValue, setStorageValue] = useState<T | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const value = await getStorageData<string | null>('userId');
      setStorageValue(value as T);
      
    })()

  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider storageValue={storageValue}>
        <InitialLayout />
      </UserContextProvider>
    </QueryClientProvider>
  );
}
