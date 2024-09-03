import { z } from "zod";

export const usernameSchema = z
    .string()
    .trim()
    .min(2, { message: "Username should be at least 2 characters long" })
    .max(20, { message: "Max characters limit reached" })

export const emailSchema = z
    .string()
    .trim()
    .email({ message: 'Invalid email format' })
    
export const passwordSchema = z
    .string()
    .min(6, { message: 'Password should be at least 6 characters long' })

export const titleSchema = z
    .string()
    .trim()
    .min(5, { message: "Too short" })
    .max(30, { message: "Max characters limit reached" })

export const promptSchema = z
    .string()
    .trim()
    .min(5, { message: "Too short" })
    .max(200, { message: "Max characters limit reached" })

export const urlSchema = z
    .string()
    .trim()
    .url({ message: "Invalid URL format" })

export const authSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema
})

export const formSchema = z.object({
    title: titleSchema,
    prompt: promptSchema,
    thumbnail: urlSchema,
    video: urlSchema
})