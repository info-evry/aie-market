import logo from "@/app/assets/logo.png";
import { SsoButtons } from "@/app/auth/sso-buttons";
import { server_getUser } from "@/lib/auth";
import { Button, Heading, Link, Text, TextField } from "@radix-ui/themes";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Créer un compte",
};

export default async function Layout() {
    const user = await server_getUser();
    if (user) {
        redirect("/");
    }

    return (
        <>
            <div className="flex h-screen w-full items-center justify-center bg-blue-100">
                <div className="flex w-full flex-col gap-5 rounded-md bg-white p-8 sm:max-w-md">
                    <Image src={logo} width={200} alt="Picture of the author" />
                    <Heading as="h1" size="8">
                        Créer un compte
                    </Heading>
                    <div className="flex flex-col gap-5">
                        <TextField.Root size="3" placeholder="Nom" type="text" disabled />
                        <TextField.Root size="3" placeholder="Prénom" type="text" disabled />
                        <TextField.Root size="3" placeholder="Adresse mail" type="email" disabled />
                        <TextField.Root
                            size="3"
                            placeholder="Mot de passe"
                            type="password"
                            disabled
                        />
                        <TextField.Root
                            size="3"
                            placeholder="Confirmer votre mot de passe"
                            type="password"
                            disabled
                        />

                        <Text color="ruby" className="italic" size="1">
                            La création de compte est actuellement désactivée. Inscrivez-vous avez
                            Google, Microsoft ou Github.
                        </Text>

                        <Button size="2" disabled>
                            Créer mon compte
                        </Button>
                        <Link href="/auth/login">Vous avez déjà un compte?</Link>
                        <Text align="center" size="1" color="gray">
                            Ou
                        </Text>
                        <SsoButtons />
                    </div>
                </div>
            </div>
        </>
    );
}
