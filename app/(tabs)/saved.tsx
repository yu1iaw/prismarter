import { EmptyList, MotionContainer, SearchInput, VideoCard } from "@/components";
import { useUserContext } from "@/contexts/user-provider";
import tw from "@/lib/tailwind";
import { useGetUserSavedPosts } from "@/lib/tanstack-query/queries";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Saved() {
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useUserContext();
    const { data: savedPosts, refetch, isLoading } = useGetUserSavedPosts(user?.id ?? 0);

    
    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }


    return (
        <SafeAreaView style={tw`bg-primary flex-1 items-center`}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FF9C01" style={tw`my-auto`} />
            ) : (
                <MotionContainer>
                    <FlatList
                        data={savedPosts}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <VideoCard post={item} renderBookmark />
                        )}
                        ListHeaderComponent={() => (
                            <View style={tw`my-6 px-4`}>
                                <Text style={tw`text-white text-2xl font-psemibold`}>Saved Videos</Text>
                                <View style={tw`mt-6 mb-8`}>
                                    <SearchInput
                                        placeholder="Search your saved videos"
                                        localSearch="true"
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
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                </MotionContainer>
            )}
        </SafeAreaView>
    )
}

// prisma.user.useFindUnique({
//     where: { email: user?.email },
//     select: {
//         liked: {
//             where: {
//                 userId: user?.id,
//             },
//             select: {
//                 video: {
//                     include: {
//                         creator: true,
//                         likes: true
//                     }
//                 },
//             }
//         }
//     }
// })
