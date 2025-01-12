import { VerifyTokenReponse } from "@/app/@types/ms-auth";
import { User } from "@prisma/client";
import { create } from "zustand";

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    loginWithGithub: () => void;
    loginWithGoogle: () => void;
    logout: () => void;
    init: () => void;
}

export const useAuth = create<AuthState>((set) => {
    const checkAuthStatus = async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/verify`, {
                method: "GET",
                credentials: "include",
            });

            const data: VerifyTokenReponse = await response.json();

            if (!response.ok || !data.success) {
                console.error("Error checking auth status:", data);
                set({ isLoggedIn: false, user: null });
                return;
            }

            set({
                user: data.user,
                isLoggedIn: response.ok,
            });
        } catch (error) {
            console.error("Error checking auth status:", error);
            set({ isLoggedIn: false, user: null });
        } finally {
            set({ loading: false });
        }
    };

    return {
        isLoggedIn: false,
        user: null,
        loading: true,
        logout: () => {
            const url = process.env.NEXT_PUBLIC_URL;
            if (!url) throw new Error("NEXT_PUBLIC_URL is not set");
            window.location.href = `${url}/api/auth/logout`;
        },
        loginWithGithub: () => {
            const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
            if (!authUrl) throw new Error("NEXT_PUBLIC_AUTH_URL is not set");
            window.location.href = `${authUrl}/auth/github`;
        },
        loginWithGoogle: () => {
            const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
            if (!authUrl) throw new Error("NEXT_PUBLIC_AUTH_URL is not set");
            window.location.href = `${authUrl}/auth/google`;
        },
        init: () => {
            checkAuthStatus();
        },
    };
});

// Automatically run init when the store is accessed for the first time
useAuth.getState().init();
