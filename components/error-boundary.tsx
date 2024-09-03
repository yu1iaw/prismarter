import tw from '@/lib/tailwind';
import { Text, View } from 'react-native';


type ErrorBoundaryProps = {
    error: string;
    children: React.ReactNode;
}

export const ErrorBoundary = ({error, children}: ErrorBoundaryProps) => {
    return (
        <View style={tw`relative`}>
            {children}
            <Text style={tw.style(`hidden text-rose-400 text-sm absolute left-2 -bottom-6`, error && `flex`)}>{error}</Text>
        </View>
    )
}