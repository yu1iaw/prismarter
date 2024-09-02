import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


export const storeData = async (key: string, value: unknown) => {
    try {
        await AsyncStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    } catch (error) {
        Alert.alert("Error", "Failed to store data")
    }
}

export const getStorageData = async <T,>(key: string): Promise<T | null> => {
    try {
        const data = await AsyncStorage.getItem(key);
 
        return data ? (typeof data !== "string" ? JSON.parse(data) as T : data as T) : null; 
    } catch (error) {
        Alert.alert("Error", "Failed to get data");
        return null;
    }
}

export const clearStorageData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        Alert.alert("Error", "Failed to clear data");
    }
}