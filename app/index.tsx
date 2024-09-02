import { useUserContext } from '@/contexts/user-provider';
import tw from '@/lib/tailwind';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';



export default function Index() {
  const { isLoggedIn, isLoading } = useUserContext();
 
  if (!isLoading && !isLoggedIn) {
    return <Redirect href='/welcome' />
  }


  return (
    <View style={tw`bg-primary flex-1 flex-center`}>
      <ActivityIndicator size="large" color="#FF9C01" />
    </View>
  );
}


