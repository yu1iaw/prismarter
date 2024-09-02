import { Like, User, Video } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, dislikePost, likePost } from "../prisma";
import { VideoEssentials } from "../types";


export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ post, userId }: { post: VideoEssentials, userId: User["id"] }) => createPost(post, userId),
        onSuccess: (_, variables) => {
            // queryClient.invalidateQueries({ queryKey: ["user_videos", variables.userId] }); 
        }
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ videoId, userId }: { videoId: Video["id"], userId: User["id"] }) => likePost(videoId, userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["saved_videos", data.userId] });
            queryClient.invalidateQueries({ queryKey: ["search_videos"] });
            // queryClient.invalidateQueries({ queryKey: ["latest_videos"] }); 
        },
    })
}

export const useDislikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (likeId: Like["id"]) => dislikePost(likeId),
        onSuccess(data) {
            queryClient.invalidateQueries({ queryKey: ["saved_videos", data.userId] });
            queryClient.invalidateQueries({ queryKey: ["search_videos"] });
            // queryClient.invalidateQueries({ queryKey: ["latest_videos"] }); 
        },
    })
}