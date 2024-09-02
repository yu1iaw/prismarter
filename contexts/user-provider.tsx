import { findUserById } from "@/lib/prisma";
import { sleep } from "@/lib/utils";
import { User } from "@prisma/client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";



type TUserContext = {
    isLoading: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<TUserContext | null>(null);

export const UserContextProvider = <T,>({ children, storageValue }: { children: React.ReactNode, storageValue: T | null }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        if (storageValue) {
            findUserById(+storageValue)
                .then(res => {
                    if (res) {                        
                        setUser(res);
                        setIsLoggedIn(true);
                    }
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    sleep(500).then(() => setIsLoading(false));
                })
        } else if (typeof storageValue !== "undefined") {
            sleep(500).then(() => setIsLoading(false));
        }
       
    }, [storageValue])


    const value = useMemo(() => ({
        isLoading,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser
    }), [isLoading, isLoggedIn, setIsLoggedIn, user, setUser])

    return (
        <UserContext.Provider
            value={value}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => {
    const value = useContext(UserContext);

    if (!value) {
        throw new Error(`useUserContext must be wrapped inside UserContextProvider`);
    }

    return value;
}