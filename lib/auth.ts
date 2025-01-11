// Extends NextRequest to include a user object
declare module "next/server" {
    interface NextRequest {
        auth?: {
            user: User;
        };
    }
}

import { VerifyTokenReponse } from "@/app/@types/ms-auth";
import { User } from "@prisma/client";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

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
                res.status(401).json({ error: "Invalid token" });
                return;
            }

            req.auth = {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name,
                    azureAdId: data.user.azureAdId,
                    emailVerifiedAt: data.user.emailVerifiedAt,
                    githubId: data.user.githubId,
                    googleId: data.user.googleId,
                    role: data.user.role,
                    stripeCustomerId: data.user.stripeCustomerId,
                    studentId: data.user.studentId,
                },
            };

            return handler(req, res);
        } catch (error) {
            console.error("Error verifying token:", error);
            res.status(500).json({ error: "Server error" });
        }
    };
}
