import { icons } from '@/constants';
import tw from '@/lib/tailwind';
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";


type TabIconProps = {
    icon: ImageSourcePropType | undefined;
    color: string;
    focused: boolean;
    name: string;
}

const TabIcon = ({icon, color, focused, name}: TabIconProps) => (
    <View style={tw`items-center justify-center gap-1`}>
        <Image
            source={icon}
            alt={name}
            tintColor={color}
            resizeMode="contain"
            style={tw`w-6 h-6`}
        />
        <Text style={tw.style(`text-xs`, focused ? `font-psemibold` : `font-pregular`, {color})}>{name}</Text>
    </View>
)

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#ffa001",
                tabBarInactiveTintColor: "#cdcde0",
                tabBarStyle: {
                    backgroundColor: "#004572",
                    borderTopWidth: 0.2,
                    borderTopColor: "#cdcde0",
                    height: 84
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ color, focused, size}) => (
                        <TabIcon
                            icon={icons.home}
                            name="Home"
                            color={color}
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon
                            icon={icons.plus}
                            name="Create"
                            color={color}
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon
                            icon={icons.bookmark}
                            name="Bookmark"
                            color={color}
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon
                            icon={icons.profile}
                            name="Profile"
                            color={color}
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>
    )
}