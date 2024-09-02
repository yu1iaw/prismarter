import { images } from '@/constants';
import tw from '@/lib/tailwind';
import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { PrimaryBtn } from './primary-btn';


type EmptyListProps = {
    title: string;
    subtitle: string;
}

export const EmptyList = ({ title, subtitle }: EmptyListProps) => {
    return (
        <View style={tw`flex-center px-4`}>
            <Image
                source={images.empty}
                resizeMode='contain'
                style={tw`w-[270px] h-[215px]`}
            />
            <Text style={tw`font-psemibold text-white text-center text-xl mt-2`}>{title}</Text>
            <Text style={tw`font-pmedium text-gray-100 text-sm`}>{subtitle}</Text>
            <PrimaryBtn
                title="Create Video"
                handlePress={() => router.push('/create')}
                containerStyles='my-5 px-4'
            />
        </View>
    )
}