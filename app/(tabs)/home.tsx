import { EmptyList, MotionContainer, SearchInput, Trending, VideoCard } from '@/components';
import { images } from '@/constants';
import { useUserContext } from '@/contexts/user-provider';
import { prisma } from '@/lib/db';
import tw from '@/lib/tailwind';
import { useGetLatestPosts } from '@/lib/tanstack-query/queries';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUserContext();
  const { data: latestPosts, refetch } = useGetLatestPosts();
  const posts = prisma.video.useFindMany({
    include: {
      creator: true,
      likes: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }


  return (
    <SafeAreaView style={tw`bg-primary flex-1 flex-row justify-center`}>
      {!posts ? (
        <ActivityIndicator size="large" color="#FF9C01" style={tw`self-center`} />
      ) : (
        <MotionContainer>
          <FlatList
            data={posts}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
              <VideoCard post={item} renderBookmark />
            )}
            ListHeaderComponent={(
              <View style={tw.style(`my-6 px-4 gap-y-6`)}>
                <View style={tw`flex-row justify-between items-start mb-6`}>
                  <View>
                    <Text style={tw`font-pmedium text-sm text-gray-100`}>Welcome Back, </Text>
                    <Text style={tw`text-white text-2xl font-psemibold`}>{user?.username}</Text>
                  </View>
                  <View style={tw`mt-1.5`}>
                    <Image
                      source={images.logoSmall}
                      style={tw`w-9 h-10`}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                <SearchInput
                  placeholder="Search for a video topic"
                />
                <View style={tw`pt-4 pb-5`}>
                  <Text style={tw`text-gray-100 text-lg font-pregular`}>Latest Videos</Text>

                  {latestPosts && (
                    <Trending posts={latestPosts} />
                  )}
                </View>
              </View>
            )}
            ListEmptyComponent={(
              <EmptyList
                title="No Videos Found"
                subtitle="No videos created yet"
              />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        </MotionContainer>
      )}
    </SafeAreaView>
  )
}


