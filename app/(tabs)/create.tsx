import { FormField, MotionContainer, PrimaryBtn } from "@/components";
import { useUserContext } from "@/contexts/user-provider";
import tw from "@/lib/tailwind";
import { useCreatePost } from "@/lib/tanstack-query/mutations";
import { VideoEssentials } from "@/lib/types";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const INITIAL_FORM: VideoEssentials = {
    title: "",
    thumbnail: "",
    prompt: "",
    video: ""
};

export default function Create() {
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const { user } = useUserContext();
    const { mutateAsync: createPost } = useCreatePost();


    const onSubmit = async () => {
        if (Object.values(form).some(v => !v)) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        setUploading(true);
        try {
            await createPost({post: form, userId: user!.id});
            router.push('/home');

        } catch (error) {
            Alert.alert("Error", "Failed to upload this file")
        } finally {
            setForm(INITIAL_FORM);
            setUploading(false);
        }
    }
    

    return (
        <SafeAreaView style={tw`flex-1 bg-primary`}>
            <MotionContainer>
                <ScrollView contentContainerStyle={tw`px-4 py-6`}>
                    <Text style={tw`text-white text-2xl font-psemibold`}>Upload Video</Text>
                    <FormField
                        value={form.title}
                        handleChangeText={(text) => setForm({ ...form, title: text })}
                        title="Video Title"
                        placeholder="Give your video a catch title..."
                        otherStyles="mt-10"
                    />
                    <FormField
                        value={form.prompt}
                        handleChangeText={(text) => setForm({ ...form, prompt: text })}
                        title="AI Prompt"
                        placeholder="AI Prompt"
                        otherStyles="mt-7"
                    />
                    <FormField
                        value={form.thumbnail}
                        handleChangeText={(text) => setForm({ ...form, thumbnail: text })}
                        title="Thumbnail Url"
                        placeholder="Paste the URL of video poster"
                        autoCapitalize="none"
                        otherStyles="mt-7"
                    />
                    <FormField
                        value={form.video}
                        handleChangeText={(text) => setForm({ ...form, video: text })}
                        title="Video Url"
                        placeholder="Paste the URL of your video"
                        autoCapitalize="none"
                        otherStyles="mt-7"
                    />
                    <PrimaryBtn
                        title="Create & Publish"
                        handlePress={onSubmit}
                        containerStyles="mt-7"
                        isLoading={uploading}
                    />
                </ScrollView>
            </MotionContainer>
        </SafeAreaView>
    )
}
