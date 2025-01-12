"use client";

import logo from "@/app/assets/logo.png";
import { useAuth } from "@/app/hooks/use-auth";
import { ExitIcon } from "@radix-ui/react-icons";
import { IconButton, TabNav, Tooltip } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const path = usePathname();
    const { logout } = useAuth();

    if (path.startsWith("/auth")) return null;

    return (
        <div className="bg-white">
            <div className="absolute right-6 top-6">
                <Tooltip content="Déconnexion">
                    <IconButton variant="ghost" aria-label="Déconnexion" onClick={logout}>
                        <ExitIcon width="18" height="18" />
                    </IconButton>
                </Tooltip>
            </div>

            <div className="flex items-center justify-center">
                <Image src={logo} width={200} alt="Logo" />
            </div>
            <div className="flex items-center justify-center">
                <TabNav.Root>
                    <TabNav.Link asChild active={path === "/"}>
                        <Link href="/">Boutique</Link>
                    </TabNav.Link>
                    <TabNav.Link asChild active={path === "/panier"}>
                        <Link href="/panier">Votre panier</Link>
                    </TabNav.Link>
                    <TabNav.Link asChild active={path === "/commandes"}>
                        <Link href="/commandes">Vos commandes</Link>
                    </TabNav.Link>
                </TabNav.Root>
            </div>
        </div>
    );
}
