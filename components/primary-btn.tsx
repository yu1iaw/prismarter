import tw from '@/lib/tailwind';
import { Pressable, Text } from 'react-native';


type PrimaryBtnProps = {
    title: string;
    handlePress?: () => void;
    containerStyles?: string;
    textStyles?: string;
    isLoading?: boolean;
}

export const PrimaryBtn = ({ title, handlePress, containerStyles, textStyles, isLoading }: PrimaryBtnProps) => {
    return (
        <Pressable
            disabled={isLoading}
            onPress={handlePress}
            style={({ pressed }) => tw.style(`bg-secondary rounded-xl min-h-[62px] flex-center`, pressed && `bg-secondary-100`, isLoading && `opacity-50`, containerStyles)}
        >
            <Text style={tw.style(`text-primary font-psemibold text-lg`, textStyles)}>
                {title}
            </Text>
        </Pressable>
    )
}

