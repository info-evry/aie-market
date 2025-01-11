import { VerifyTokenReponse } from "@/app/@types/ms-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Protect routes from unauthorized access (frontend & backend)
export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
    const appUrl = process.env.NEXT_PUBLIC_URL;

    if (!token) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    try {
        const response = await fetch(`${authUrl}/auth/verify-token/${token}`);
        const data: VerifyTokenReponse = await response.json();

        if (!response.ok || !data.success) {
            return NextResponse.redirect(`${appUrl}/auth/login?error=TOKEN_INVALID`);
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.redirect(`${appUrl}/auth/login?error=SERVER_ERROR`);
    }
}

export const config = {
    matcher: ["/", "/admin/qr", "/panier", "/commandes"],
};
