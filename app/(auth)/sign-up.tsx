import { ErrorBoundary, FormField, PrimaryBtn } from '@/components';
import { images } from '@/constants';
import { useUserContext } from '@/contexts/user-provider';
import { hashPassword } from '@/lib/crypto-helper';
import { createUser } from '@/lib/prisma';
import { storeData } from '@/lib/storage-helper';
import tw from '@/lib/tailwind';
import { authSchema, emailSchema, passwordSchema, usernameSchema } from '@/lib/validation';
import { Motion } from '@legendapp/motion';
import { Href, Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



type TInputName = "username" | "email" | "password";

const schema = {
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema
} as const;

const initialValues = {
    username: "",
    email: "",
    password: ""
} as const;

const { width } = Dimensions.get("screen");

export default function SignUp() {
    const [form, setForm] = useState(initialValues);
    const [error, setError] = useState(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser, setIsLoggedIn } = useUserContext();


    const onChangeText = (text: string, inputName: TInputName) => {
        setError({ ...error, [inputName]: '' });
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
        if (Object.values(form).some(value => !value)) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        const validatedForm = authSchema.safeParse(form);
        if (!validatedForm.success) {
            const errorKey = String(validatedForm.error.errors[0].path);
            const errorValue = validatedForm.error.errors[0].message;
            setError({ ...error, [errorKey]: errorValue });
            return;
        }

        setIsSubmitting(true);
        try {
            const { password, ...rest } = validatedForm.data;
            const hashedPassword = await hashPassword(password);

            const user = await createUser({
                ...rest,
                hashedPassword
            });
            if (user) {
                setUser(user);
                setIsLoggedIn(true);
                storeData('userId', user.id);
            }

        } catch (error) {           
            const errorMessage = typeof error === "string" 
                ? 'Email or username already exists'
                : 'Failed to create new user';
            
            Alert.alert("Error", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <SafeAreaView style={tw`flex-1 bg-primary pt-11`}>
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
                contentContainerStyle={tw`py-10`}
            >
                <View style={tw`px-4`}>
                    <View style={tw`items-center`}>
                        <Image
                            source={images.logo}
                            resizeMode='contain'
                            style={tw`w-[115px] h-[35px]`}
                        />
                        <Text style={tw`text-2xl text-white font-psemibold mt-10`}>Sign up to Aora</Text>
                    </View>
                    <ErrorBoundary error={error.username}>
                        <FormField
                            title="Username"
                            value={form.username}
                            handleChangeText={(text) => onChangeText(text, "username")}
                            otherStyles="mt-10"
                            autoCapitalize='none'
                            maxLength={20}
                            onBlur={() => onBlur("username")}
                        />
                    </ErrorBoundary>
                    <ErrorBoundary error={error.email}>
                        <FormField
                            title="Email"
                            value={form.email}
                            handleChangeText={(text) => onChangeText(text, "email")}
                            otherStyles="mt-7"
                            keyboardType="email-address"
                            autoCapitalize='none'
                            onBlur={() => onBlur("email")}
                        />
                    </ErrorBoundary>
                    <ErrorBoundary error={error.password}>
                        <FormField
                            title="Password"
                            value={form.password}
                            handleChangeText={(text) => onChangeText(text, "password")}
                            otherStyles="mt-7"
                            autoCapitalize='none' 
                            onBlur={() => onBlur("password")}
                        />
                    </ErrorBoundary>
                    <PrimaryBtn
                        title='Sign up'
                        handlePress={onSubmit}
                        containerStyles='mt-11'
                        isLoading={isSubmitting || Object.values(error).some(Boolean)}
                    />
                    <View style={tw`flex-row pt-5 flex-center gap-2`}>
                        <Text style={tw`text-lg text-gray-100 font-pregular`}>Already have an account?</Text>
                        <Link href={"/sign-in" as Href} style={tw`text-secondary font-psemibold text-lg`}>Sign In</Link>
                    </View>
                </View>
            </Motion.ScrollView>
        </SafeAreaView>
    )
}