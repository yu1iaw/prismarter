import { EmptyList, InfoBox, MotionContainer, VideoCard } from "@/components";
import { icons } from "@/constants";
import { useUserContext } from "@/contexts/user-provider";
import { clearStorageData } from "@/lib/storage-helper";
import tw from "@/lib/tailwind";
import { useGetUserPosts } from "@/lib/tanstack-query/queries";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Profile() {
    const [refreshing, setRefreshing] = useState(false);
    const { user, setUser, setIsLoggedIn } = useUserContext(); 
    const { data: posts, isLoading, refetch } = useGetUserPosts(user?.id ?? 0);


    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        clearStorageData('userId');
    }


    return (
        <SafeAreaView style={tw`bg-primary flex-1 items-center`}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FF9C01" style={tw`my-auto`} />
            ) : (
                <MotionContainer>
                    <FlatList
                        data={posts}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <VideoCard post={item} />
                        )}
                        ListHeaderComponent={() => (
                            <View style={tw`flex-center mt-6 mb-12 px-4`}>
                                <TouchableOpacity
                                    onPress={logout}
                                    style={tw`items-end mb-10 w-full`}
                                >
                                    <Image
                                        source={icons.logout}
                                        resizeMode="contain"
                                        style={tw`w-6 h-6`}
                                    />
                                </TouchableOpacity>
                                <View style={tw`w-16 h-16 border border-secondary bg-slate-300 flex-center rounded-lg`}>
                                    <Image
                                        source={{ uri: user?.avatar ?? 'https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/question-1024.png' }}
                                        style={tw`w-[90%] h-[90%] rounded-md`}
                                    />
                                </View>
                                <InfoBox
                                    title={user?.username}
                                    containerStyles='mt-5'
                                    titleStyles='text-lg'
                                />
                                <View style={tw`flex-row mt-2`}>
                                    <InfoBox
                                        title={posts?.length || 0}
                                        subtitle="Posts"
                                        containerStyles='mr-10'
                                        titleStyles='text-xl'
                                    />
                                    <InfoBox
                                        title='1.2k'
                                        subtitle='Followers'
                                        titleStyles='text-xl'
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