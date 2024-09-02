import { UserEssentials, VideoEssentials } from "@/lib/types";
import { Like, User, Video } from "@prisma/client";
import { verifyPassword } from "./crypto-helper";
import { prisma } from "./db";


export const createUser = async (userData: UserEssentials) => {
    try {
        const user = await prisma.user.create({
            data: userData
        })
        return user;
    } catch (error) {
        console.log(error);
        throw 'error';
    }
}

export const deleteUser = async (id: User["id"]) => {
    try {
        await prisma.user.delete({
            where: {
                id
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const findUserById = async (id: User["id"]) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const findUserByEmail = async (email: User["email"], password: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) throw Error('No such user found');

        const passwordsMatch = await verifyPassword(password, user.hashedPassword);
        if (!passwordsMatch) throw Error('Passwords do not match');
        
        return user;
    } catch (error) {
        console.log(error); 
        throw error;
    }
}

export const createPost = async (post: VideoEssentials, userId: User["id"]) => {
    try {
        const newPost = await prisma.video.create({
            data: {
                ...post,
                creator: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        return newPost;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const likePost = async (videoId: Video["id"], userId: User["id"]) => {
    try {
        const like = await prisma.like.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                video: {
                    connect: {
                        id: videoId
                    }
                }
            }
        })
        return like;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const dislikePost = async (likeId: Like["id"]) => {
    try {
        const like = await prisma.like.delete({
            where: {
                id: likeId
            }
        })
        return like;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// search
export const findPostByQuery = async (query: string, userId?: User["id"]) => {
    try {
        const posts = await prisma.video.findMany({
            where: {
                title: {
                    contains: query
                },
                likes: {
                    some: userId
                        ? { userId }
                        : undefined
                }
            },
            include: {
                creator: true,
                likes: true
            },
        })
        return posts;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const findAllPosts = async () => {
    try {
        const posts = await prisma.video.findMany({
            include: {
                creator: true,
                likes: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return posts;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

// trending
export const findLatestPosts = async () => {
    try {
        const posts = await prisma.video.findMany({
            take: 7,
            orderBy: {
                likes: {
                    _count: "desc"
                },
            },
        })
        return posts;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

// profile
export const findUserPosts = async (creatorId: User["id"]) => {
    try {
        const posts = await prisma.video.findMany({
            where: {
                creatorId
            },
            include: {
                creator: true,
                likes: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return posts;
    } catch (error) {
        console.log(error); 
        throw error;
    }
}

// saved
export const findUserSavedPosts = async (userId: User["id"]) => {
    try {
        const posts = await prisma.like.findMany({
            where: {
                userId
            },
            select: {
                video: {
                    include: {
                        creator: true,
                        likes: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return posts.flatMap(post => Object.values(post));
    } catch (error) {
        console.log(error);
        throw error;
    }
}
