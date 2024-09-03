import { ErrorBoundary, FormField, MotionContainer, PrimaryBtn } from "@/components";
import { useUserContext } from "@/contexts/user-provider";
import tw from "@/lib/tailwind";
import { useCreatePost } from "@/lib/tanstack-query/mutations";
import { formSchema, promptSchema, titleSchema, urlSchema } from "@/lib/validation";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



type TInputName = "title" | "thumbnail" | "prompt" | "video";

const schema = {
    title: titleSchema,
    prompt: promptSchema,
    thumbnail: urlSchema,
    video: urlSchema
} as const;

const initialValues = {
    title: "",
    thumbnail: "",
    prompt: "",
    video: ""
} as const;

export default function Create() {
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState(initialValues);
    const [error, setError] = useState(initialValues);
    const { user } = useUserContext();
    const { mutateAsync: createPost } = useCreatePost();


    const onChangeText = (text: string, inputName: TInputName) => {
        setError({ ...error, [inputName]: "" });
        setForm({ ...form, [inputName]: text });
    }


    const onBlur = (inputName: TInputName) => {
        let errorMessage = '';
        const validatedInput = schema[inputName].safeParse(form[inputName]);
        if (!validatedInput.success) {
            errorMessage = validatedInput.error.errors[0].message;
        }

        setError({ ...error, [inputName]: errorMessage });
    }

    const onSubmit = async () => {
        if (Object.values(form).some(v => !v)) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        const validatedForm = formSchema.safeParse(form);
        if (!validatedForm.success) {
            const errorKey = String(validatedForm.error.errors[0].path);
            const errorValue = validatedForm.error.errors[0].message;
            setError({ ...error, [errorKey]: errorValue });
            return;
        }

        setUploading(true);
        try {
            await createPost({post: validatedForm.data, userId: user!.id});
            router.push('/home');

        } catch (error) {
            Alert.alert("Error", "Failed to upload this file")
        } finally {
            setForm(initialValues);
            setUploading(false);
        }
    }
    

    return (
        <SafeAreaView style={tw`flex-1 bg-primary`}>
            <MotionContainer>
                <ScrollView contentContainerStyle={tw`px-4 py-6`}>
                    <Text style={tw`text-white text-2xl font-psemibold`}>Upload Video</Text>
                    <ErrorBoundary error={error.title}>
                        <FormField
                            value={form.title}
                            handleChangeText={(text) => onChangeText(text, "title")}
                            onBlur={() => onBlur("title")}
                            title="Video Title"
                            placeholder="Give your video a catch title..."
                            otherStyles="mt-10"
                            maxLength={30}
                        />
                    </ErrorBoundary>
                    <ErrorBoundary error={error.prompt}>
                        <FormField
                            value={form.prompt}
                            handleChangeText={(text) => onChangeText(text, "prompt")}
                            onBlur={() => onBlur("prompt")}
                            title="AI Prompt"
                            placeholder="AI Prompt"
                            otherStyles="mt-7"
                            maxLength={200}
                        />
                    </ErrorBoundary>
                    <ErrorBoundary error={error.thumbnail}>
                        <FormField
                            value={form.thumbnail}
                            handleChangeText={(text) => onChangeText(text, "thumbnail")}
                            onBlur={() => onBlur("thumbnail")}
                            title="Thumbnail Url"
                            placeholder="Paste the URL of video poster"
                            autoCapitalize="none"
                            otherStyles="mt-7"
                        />
                    </ErrorBoundary>
                    <ErrorBoundary error={error.video}>
                        <FormField
                            value={form.video}
                            handleChangeText={(text) => onChangeText(text, "video")}
                            onBlur={() => onBlur("video")}
                            title="Video Url"
                            placeholder="Paste the URL of your video"
                            autoCapitalize="none"
                            otherStyles="mt-7"
                        />
                    </ErrorBoundary>
                    <PrimaryBtn
                        title="Create & Publish"
                        handlePress={onSubmit}
                        containerStyles="mt-7"
                        isLoading={uploading || Object.values(error).some(Boolean)}
                    />
                </ScrollView>
            </MotionContainer>
        </SafeAreaView>
    )
}
