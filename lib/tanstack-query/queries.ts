import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { findAllPosts, findLatestPosts, findPostByQuery, findUserPosts, findUserSavedPosts } from "../prisma";



export const useGetAllPosts = () => {
    return useQuery({
        queryKey: ["videos"],
        queryFn: findAllPosts
    })
}

export const useGetLatestPosts = () => {
    return useQuery({
        queryKey: ["latest_videos"],
        queryFn: findLatestPosts
    })
}

export const useGetUserPosts = (creatorId: User["id"]) => {
    return useQuery({
        queryKey: ["user_videos", creatorId],
        queryFn: () => findUserPosts(creatorId),
        enabled: !!creatorId
    })
}

export const useGetUserSavedPosts = (userId: User["id"]) => {
    return useQuery({
        queryKey: ["saved_videos", userId],
        queryFn: () => findUserSavedPosts(userId),
        enabled: !!userId
    })
}

export const useGetPostByQuery = (query: string, userId?: User["id"]) => {
    return useQuery({
        queryKey: ["search_videos", query, userId],
        queryFn: () => findPostByQuery(query, userId),
        enabled: !!query
    })
}




