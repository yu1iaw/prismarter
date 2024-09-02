import { icons } from '@/constants';
import tw from '@/lib/tailwind';
import { Motion } from '@legendapp/motion';
import { Video as TVideo } from '@prisma/client';
import { ResizeMode, Video } from 'expo-av';
import { useState } from 'react';
import { FlatList, Image, ImageBackground, TouchableOpacity } from 'react-native';


type TrendingProps = {
    posts: TVideo[];
}

export const Trending = ({ posts }: TrendingProps) => {
    const [activeItemId, setActiveItemId] = useState(posts[0]?.id);

    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {        
        if (viewableItems.length > 0) {
            setActiveItemId(+viewableItems[0].key)
        }
    }

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`gap-x-2 p-4`}
            data={posts}
            keyExtractor={item => item.id?.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <TrendingItem
                    item={item}
                    activeItemId={activeItemId}
                />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 85
            }}
            contentOffset={{ x: 140, y: 0 }}
        />
    )
}

type TrendingItemProps = {
    activeItemId: number;
    item: TVideo;
}

const TrendingItem = ({ activeItemId, item }: TrendingItemProps) => {
    const [play, setPlay] = useState(false);

    return (
        <Motion.View
            animate={{ scale: activeItemId === item.id ? 1 : 0.9 }}
            transition={{ type: "spring", stiffness: 135, damping: 12 }}
        >
            {play ? (
                <Video
                    source={{ uri: item.video }}
                    style={tw`w-52 h-72 rounded-[35px] mt-3 bg-white/10`}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        // @ts-ignore
                        if (status.didJustFinish) setPlay(false);
                    }}
                />
            ) : (
                <TouchableOpacity
                    onPress={() => setPlay(true)}
                    activeOpacity={0.6}
                    style={tw`relative flex-center`}
                >
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        resizeMode='cover'
                        style={tw`w-52 h-72 rounded-[35px] overflow-hidden shadow-lg shadow-black/40`}
                    />
                    <Image
                        source={icons.play}
                        resizeMode='contain'
                        style={tw`w-12 h-12 absolute`}
                    />

                </TouchableOpacity>
            )}
        </Motion.View>
    )

}
