import { ErrorBoundary, FormField, PrimaryBtn } from '@/components';
import { images } from '@/constants';
import { useUserContext } from '@/contexts/user-provider';
import { findUserByEmail } from '@/lib/prisma';
import { storeData } from '@/lib/storage-helper';
import tw from '@/lib/tailwind';
import { emailSchema, passwordSchema } from '@/lib/validation';
import { Motion } from '@legendapp/motion';
import { Href, Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const schema = {
    email: emailSchema,
    password: passwordSchema
} as const; 

const initialValues = {
    email: "",
    password: ""
} as const;

const { width } = Dimensions.get("screen");

export default function SignIn() {
    const [form, setForm] = useState(initialValues);
    const [error, setError] = useState(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser, setIsLoggedIn } = useUserContext();


    const onChangeText = (text: string, inputName: "email" | "password") => {
        setError({ ...error, [inputName]: '' });
        setForm({ ...form, [inputName]: text });
    }

    const onBlur = (inputName: "email" | "password") => {
        let errorMessage = '';
        const validatedInput = schema[inputName].safeParse(form[inputName]);
        if (!validatedInput.success) {
            errorMessage = validatedInput.error.errors[0].message;
        }

        setError({ ...error, [inputName]: errorMessage });
    }

    const onSubmit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const user = await findUserByEmail(form.email, form.password);
            if (user) {
                setUser(user);
                setIsLoggedIn(true);
                storeData('userId', user.id);
            }
        } catch (error) {
            let message: string;
            if (error instanceof Error) {
                message = error.message;
            } else {
                message = 'Failed to sign in';
            }
            Alert.alert("Error", message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-primary pt-15`}>
            <Motion.ScrollView
                initial={{ x: width, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    default: {
                        type: "spring", damping: 20, stiffness: 60
                    },
                    opacity: {
                        type: "tween", duration: 700
                    }
                }}
            >
                <View style={tw`px-4 my-6`}>
                    <View style={tw`items-center`}>
                        <Image
                            source={images.logo}
                            resizeMode='contain'
                            style={tw`w-[115px] h-[35px]`}
                        />
                        <Text style={tw`text-2xl text-white font-psemibold mt-10`}>Log in to Aora</Text>
                    </View>
                    <ErrorBoundary error={error.email}>
                        <FormField
                            title="Email"
                            value={form.email}
                            handleChangeText={(text) => onChangeText(text, "email")}
                            onBlur={() => onBlur("email")}
                            otherStyles="mt-7"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </ErrorBoundary>
                    <ErrorBoundary error={error.password}>
                        <FormField
                            title="Password"
                            value={form.password}
                            handleChangeText={(text) => onChangeText(text, "password")}
                            onBlur={() => onBlur("password")}
                            otherStyles="mt-7"
                            autoCapitalize='none'
                        />
                    </ErrorBoundary>
                    <PrimaryBtn
                        title='Sign in'
                        handlePress={onSubmit}
                        containerStyles='mt-11'
                        isLoading={isSubmitting || Object.values(error).some(Boolean)}
                    />
                    <View style={tw`flex-row pt-5 flex-center gap-2`}>
                        <Text style={tw`text-lg text-gray-100 font-pregular`}>Don't have an account?</Text>
                        <Link href={"/sign-up" as Href} style={tw`text-secondary font-psemibold text-lg`}>Sign Up</Link>
                    </View>
                </View>
            </Motion.ScrollView>
        </SafeAreaView>
    )
}