import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


export default function StackLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="light" />
        </>
    )
}