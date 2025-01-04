"use client";

import logo from "@/app/assets/logo.png";
import { TabNav } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const path = usePathname();

    return (
        <div className="bg-white">
            <div className="flex items-center justify-center">
                <Image src={logo} width={200} alt="Logo" />
            </div>
            <div className="flex items-center justify-center">
                <TabNav.Root>
                    <TabNav.Link asChild active={path === "/home"}>
                        <Link href="/home">Boutique</Link>
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
