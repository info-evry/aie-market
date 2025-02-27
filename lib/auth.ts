// Extends NextRequest to include a user object
declare module "next/server" {
    interface NextRequest {
        auth?: {
            user: User;
        };
    }
}

import { VerifyTokenReponse } from "@/app/@types/ms-auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * API middleware to protect routes from unauthorized access
 */
export function auth(handler: (req: NextRequest, res: NextApiResponse) => void) {
    return async (req: NextRequest, res: NextApiResponse) => {
        const token = req.cookies.get("auth-token")?.value;
        const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            const response = await fetch(`${authUrl}/auth/verify-token/${token}`);
            const data: VerifyTokenReponse = await response.json();

            if (!response.ok || !data.success) {
                return NextResponse.redirect("/login?error=INVALID_TOKEN");
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: data.user.id,
                },
            });

            if (!user) {
                return NextResponse.redirect("/login?error=USER_NOT_FOUND");
            }

            req.auth = {
                user,
            };

            return handler(req, res);
        } catch (error) {
            console.error("Error verifying token:", error);
            return NextResponse.redirect("/login?error=SERVER_ERROR");
        }
    };
}

export async function server_getUser(): Promise<User | null> {
    const cookieStore = cookies(); // Access the cookies in the current request context
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
        console.error("No token provided.");
        return null;
    }

    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    try {
        const response = await fetch(`${authUrl}/auth/verify-token/${token}`);
        const data: VerifyTokenReponse = await response.json();

        if (!response.ok || !data.success) {
            console.error("Invalid or expired token.");
            return null;
        }

        return data.user;
    } catch (error) {
        console.error("Error fetching user from token:", error);
        return null;
    }
}
