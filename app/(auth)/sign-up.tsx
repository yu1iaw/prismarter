import { FormField, PrimaryBtn } from '@/components';
import { images } from '@/constants';
import { useUserContext } from '@/contexts/user-provider';
import { hashPassword } from '@/lib/crypto-helper';
import { createUser } from '@/lib/prisma';
import { storeData } from '@/lib/storage-helper';
import tw from '@/lib/tailwind';
import { Motion } from '@legendapp/motion';
import { Href, Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const { width } = Dimensions.get("screen");

export default function SignUp() {
    const { setUser, setIsLoggedIn } = useUserContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const onSubmit = async () => {
        if (!form.email || !form.password || !form.username) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const hashedPassword = await hashPassword(form.password);

            const { password, ...rest } = form;
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
                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(text: string) => setForm({ ...form, username: text })}
                        otherStyles="mt-10"
                        autoCapitalize='none'
                    />
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(text: string) => setForm({ ...form, email: text })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                        autoCapitalize='none'
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(text: string) => setForm({ ...form, password: text })}
                        otherStyles="mt-7"
                        autoCapitalize='none'
                    />
                    <PrimaryBtn
                        title='Sign up'
                        handlePress={onSubmit}
                        containerStyles='mt-11'
                        isLoading={isSubmitting}
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