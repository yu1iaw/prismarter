import { PrimaryBtn } from '@/components';
import { images } from '@/constants';
import tw from '@/lib/tailwind';
import { Motion } from '@legendapp/motion';
import { Href, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const { width } = Dimensions.get("screen");

export default function Welcome() {
    return (
        <SafeAreaView style={tw`flex-1 bg-primary`}>
            <ScrollView>
                <View
                    style={tw`px-4 pb-10`}
                >
                    <Motion.View
                        initial={{ x: -150, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 600, delay: 60 }}
                        style={tw`items-center w-full`}
                    >
                        <Image
                            source={images.logo}
                            style={tw`w-[130px] h-[84px]`}
                            resizeMode="contain"
                        />
                        <Image
                            source={images.cards}
                            style={tw`max-w-[380px] w-full h-[300px]`}
                            resizeMode="contain"
                        />
                    </Motion.View>
                    <Motion.View
                        initial={{ x: width, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 750, stiffness: 120, damping: 20 }}
                    >
                        <View style={tw`relative mt-5`}>
                            <Text style={tw`text-3xl text-white font-bold text-center`}>
                                Discover Endless Possibilities with{" "}
                                <Text style={tw`text-secondary-200`}>Aora</Text>
                            </Text>
                            <Image
                                source={images.path}
                                style={tw`w-[136px] h-[15px] absolute -bottom-2 -right-8`}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={tw`font-pregular text-sm text-gray-100 text-center mt-7`}>
                            Where creativity meets innivation: embark on the journey of limitless exploration with Aora
                        </Text>
                        <PrimaryBtn
                            title="Continue with Email"
                            handlePress={() => router.push('/sign-in' as Href)}
                            containerStyles="w-full mt-7"
                        />
                    </Motion.View>
                </View>
            </ScrollView>
            <StatusBar style="light" />
        </SafeAreaView>
    )
}