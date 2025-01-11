import { VerifyTokenReponse } from "@/app/@types/ms-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=TOKEN_MISSING`);
    }

    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    try {
        const res = await fetch(`${authUrl}/auth/verify-token/${token}`);
        const data: VerifyTokenReponse = await res.json();

        if (!res.ok || !data.success) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_URL}/auth/login?error=TOKEN_INVALID`,
            );
        }

        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/`);
        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(data.user.exp * 1000),
        });

        return response;
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/auth/login`);
    }
}
