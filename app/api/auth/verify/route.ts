import { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest) => {
    const token = cookies().get("auth-token")?.value;
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${authUrl}/auth/verify-token/${token}`);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching verify token response:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
};
