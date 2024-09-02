import { icons } from '@/constants';
import tw from '@/lib/tailwind';
import { useState } from 'react';
import { Image, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';


type FormFieldProps = TextInputProps & {
    title: string;
    value: string;
    handleChangeText: (text: string) => void;
    otherStyles?: string;
    placeholder?: string;
}

export const FormField = ({ title, placeholder, value, handleChangeText, otherStyles, ...props }: FormFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={tw.style(`gap-y-2`, otherStyles)}>
            <Text style={tw`text-base text-gray-100 font-pmedium`}>{title}</Text>
            <View style={tw`flex-row items-center px-4 h-16 rounded-2xl border-2 border-slate-400 bg-white/5 focus:border-secondary`}>
                <TextInput
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7b7b8b"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === "Password" && !showPassword}
                    {...props}
                    style={tw`flex-1 h-full text-base text-white font-psemibold`}
                />
                {title === "Password" && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={tw`p-2`}
                    >
                        <Image
                            source={showPassword ? icons.eye : icons.eyeHide}
                            resizeMode='contain'
                            style={tw`w-6 h-6`}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}