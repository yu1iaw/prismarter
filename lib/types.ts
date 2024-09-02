import { Like, User, Video } from '@prisma/client';

export type UserEssentials = Omit<User, 'id' | 'avatar' | 'createdAt' | 'updatedAt'>;
export type VideoEssentials = Omit<Video, 'id' | 'creatorId' | 'createdAt' | 'updatedAt'>


export type Creator = {
    creator: User;
}

export type Likes = {
    likes: Like[];
}