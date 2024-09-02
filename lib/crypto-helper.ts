import * as Crypto from 'expo-crypto';


export const hashPassword = async (password: string) => {
    try {
        const hashedPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
        return hashedPassword;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
    try {
        const hashedPasswordClone = await hashPassword(password);

        return hashedPassword === hashedPasswordClone;
    } catch (error) {
        console.log(error);
        throw error;
    }
}