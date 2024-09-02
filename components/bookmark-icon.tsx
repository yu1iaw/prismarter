import { icons } from '@/constants';
import { useUserContext } from '@/contexts/user-provider';
import tw from '@/lib/tailwind';
import { useDislikePost, useLikePost } from '@/lib/tanstack-query/mutations';
import { Likes } from '@/lib/types';
import { Motion } from '@legendapp/motion';
import { Like, Video } from '@prisma/client';
import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';


type BookmarkProps = {
    video: Video & Likes;
}

export const BookmarkIcon = ({ video }: BookmarkProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUserContext();
    const { mutateAsync: likePost } = useLikePost();
    const { mutateAsync: dislikePost } = useDislikePost();
    const isLikedFound = video.likes.find((obj: Like) => obj.userId === user?.id);


    const handleLike = async () => {
        setIsLoading(true);
        try {
            if (isLikedFound) {
                await dislikePost(isLikedFound.id);
            } else {
                await likePost({videoId: video.id, userId: user!.id});
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Opps... Try again';
            Alert.alert("Error", message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <TouchableOpacity onPress={handleLike} disabled={isLoading} style={tw`flex-row items-center gap-x-[3px]`}>
            {video.likes && !!video.likes.length && (
                <Motion.Text
                    animate={{
                        scale: isLoading ? 0 : 1,
                        opacity: isLoading ? 0 : 1,
                    }}
                    transition={{ duration: 550 }}
                    style={tw`text-white font-pmedium text-sm`}
                >
                    {video.likes.length}
                </Motion.Text>
            )}
            <Motion.Image
                animate={{
                    scale: isLoading ? 0.6 : 1,
                    opacity: isLoading ? 0.2 : 1,
                }}
                transition={{ duration: 500 }}
                source={icons.heart}
                style={tw.style(`w-7 h-7`, { tintColor: isLikedFound ? '#FF9C01' : 'white' })}
                resizeMode="contain"
            />
        </TouchableOpacity>
    )
}