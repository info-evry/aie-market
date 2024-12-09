import logo from "@/app/assets/logo.png";
import { Button, Heading, Link, Text, TextField } from "@radix-ui/themes";
import { Metadata } from "next";
import Image from "next/image";
import { FaGithub, FaGoogle } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function Layout() {
    return (
        <>
            <div className="w-full h-screen bg-blue-100 flex justify-center items-center">
                <div className="flex flex-col gap-5 p-8 bg-white w-full sm:max-w-md rounded-md">
                    <Image src={logo} width={200} alt="Logo" />
                    <Heading as="h1" size="8">
                        Connexion
                    </Heading>
                    <div className="flex flex-col gap-5">
                        <TextField.Root size="3" placeholder="Adresse mail" type="email" disabled />
                        <TextField.Root
                            size="3"
                            placeholder="Mot de passe"
                            type="password"
                            disabled
                        />

                        <Text color="ruby" className="italic" size="1">
                            La connexion avec un compte manuel est désactivée. Connectez-vous avez
                            Google, Microsoft ou Github.
                        </Text>

                        <Button size="2" disabled>
                            Se connecter
                        </Button>
                        <Link href="/auth/register">Vous n'avez encore de compte ?</Link>
                        <Text align="center" size="1" color="gray">
                            Ou
                        </Text>
                        <Button size="2" variant="outline">
                            <FaGoogle />
                            Continuer avec Google
                        </Button>
                        {/* <Button size="2" variant="outline">
                            <FaMicrosoft />
                            Continuer avec Microsoft
                        </Button> */}
                        <Button size="2" variant="outline">
                            <FaGithub />
                            Continuer avec Github
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
