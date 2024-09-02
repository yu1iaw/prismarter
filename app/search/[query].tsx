import { EmptyList, MotionContainer, SearchInput, VideoCard } from "@/components";
import { useUserContext } from "@/contexts/user-provider";
import tw from "@/lib/tailwind";
import { useGetPostByQuery } from "@/lib/tanstack-query/queries";
import { Creator, Likes } from "@/lib/types";
import { Video } from "@prisma/client";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type TSearchParams = {
  query: string;
  localSearch?: string;
}

type TPosts = Video & Creator & Likes;

export default function Search() {
  const { user } = useUserContext();
  const { query, localSearch }: TSearchParams = useLocalSearchParams();
  const { data: posts, refetch, isLoading } = useGetPostByQuery(query, localSearch ? user?.id : undefined);


  useEffect(() => {
    refetch();
  }, [query, localSearch])


  return (
    <SafeAreaView style={tw`bg-primary flex-1 items-center`}>
      <MotionContainer>
        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <VideoCard post={item} renderBookmark />
          )}
          ListHeaderComponent={() => (
            <View style={tw`my-6 px-4`}>
              <Text style={tw`font-pmedium text-sm text-gray-100`}>Search Results</Text>
              <Text style={tw`text-white text-2xl font-psemibold`}>{query}</Text>
              <View style={tw`mt-6 mb-8`}>
                <SearchInput
                  placeholder="Search for a video topic"
                  initialQuery={query}
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyList
              title="No Videos Found"
              subtitle="No videos found for this search query"
            />
          )}
        />
      </MotionContainer>
    </SafeAreaView>
  )
}