import { icons } from '@/constants';
import tw from '@/lib/tailwind';
import { router, usePathname } from 'expo-router';
import { useRef } from 'react';
import { Alert, Image, TextInput, TextInputProps, View } from 'react-native';


type FormFieldProps = TextInputProps & {
    placeholder?: string;
    initialQuery?: string;
    localSearch?: string;
}

export const SearchInput = ({ placeholder, initialQuery, localSearch }: FormFieldProps) => {
    const inputRef = useRef(initialQuery ?? '');
    const pathname = usePathname();

    const onSearchPress = () => {
        if (!inputRef.current) {
            Alert.alert('Missing query', 'Please input something to search results across database');
            return;
        }

        if (pathname.startsWith('/search')) {
            router.setParams({ query: inputRef.current });
        } else {
            router.push({ pathname: `/search/[query]`, params: { query: inputRef.current, localSearch: localSearch } });
        }
    }

    return (
        <View style={tw`flex-row items-center px-4 h-16 gap-x-4 rounded-2xl border-2 border-slate-400 focus:border-secondary`}>
            <View style={tw`p-1`}>
                <Image
                    source={icons.search}
                    resizeMode='contain'
                    style={tw`w-5 h-5`}
                />
            </View>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#cdcde0"
                onChangeText={text => inputRef.current = text}
                onSubmitEditing={onSearchPress}
                autoCapitalize='none'
                style={tw`flex-1 h-full text-base text-white font-pregular mt-0.5`}
            />
        </View>
    )
}