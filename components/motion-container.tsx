import tw from '@/lib/tailwind';
import { Motion } from '@legendapp/motion';
import { Dimensions } from 'react-native';



const { width } = Dimensions.get("screen");

export const MotionContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <Motion.View
            initial={{ x: width - 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
                default: {
                    type: "spring", damping: 20, stiffness: 60
                },
                opacity: {
                    type: "tween", duration: 100
                }
            }}
            style={tw`w-full`}
        >
            {children}
        </Motion.View>
    )
}