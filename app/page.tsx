"use server";

import prisma from "@/lib/prisma";
import { Kbd } from "@radix-ui/themes";

export default async function Home() {
    const user = await prisma.user.findMany();

    return (
        <>
            <p>Testing</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <Kbd>Shift + Tab</Kbd>
        </>
    );
}
