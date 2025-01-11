"use client";

import { useAuth } from "@/app/hooks/use-auth";
import { Button } from "@radix-ui/themes";
import { FaGithub, FaGoogle } from "react-icons/fa6";

export function SsoButtons() {
    const { loginWithGithub, loginWithGoogle } = useAuth();
    return (
        <>
            <Button size="2" variant="outline" onClick={loginWithGoogle}>
                <FaGoogle />
                Continuer avec Google
            </Button>
            <Button size="2" variant="outline" onClick={loginWithGithub}>
                <FaGithub />
                Continuer avec Github
            </Button>
        </>
    );
}
