import { auth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = auth(
    async (req: NextApiRequest, res: NextApiResponse): Promise<NextResponse> => {
        console.log(req.auth);

        return NextResponse.json({ message: "Hello, World!" });
    },
);
