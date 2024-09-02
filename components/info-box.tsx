import tw from '@/lib/tailwind';
import { Text, View } from 'react-native';



type InfoBoxProps = {
    title: string | number | undefined;
    subtitle?: string;
    containerStyles?: string;
    titleStyles: string;
}

export const InfoBox = ({ title, subtitle, containerStyles, titleStyles }: InfoBoxProps) => {
    return (
        <View style={tw.style(containerStyles)}>
            <Text style={tw.style(`text-white text-center font-psemibold`, titleStyles)}>{title}</Text>
            <Text style={tw`text-sm text-gray-100 text-center font-pregular`}>{subtitle}</Text>
        </View>
    )
}