"use client";

import { useTimer } from "@/app/hooks/timer";
import { Text } from "@radix-ui/themes";
import { redirect } from "next/navigation";

export function AutoRedirectWithTimer({ timer }: { timer?: number }) {
    const time = useTimer(timer, () => redirect("/"));

    return <Text>Vous allez être redirigé dans {time} secondes.</Text>;
}
