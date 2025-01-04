// Extends NextRequest to include a user object
declare module "next/server" {
    interface NextRequest {
        auth?: {
            user: User;
        };
    }
}

import { User } from "@prisma/client";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export function auth(handler: (req: NextRequest, res: NextApiResponse) => void) {
    return async (req: NextRequest, res: NextApiResponse) => {
        // TODO: Add custom implementation to authenticate the user via the auth-ms
        req.auth = {
            user: {
                azureAdId: "123",
                emailVerifiedAt: new Date(),
                githubId: "123",
                googleId: "123",
                id: "cm5h2v5t00000mjudobfok9v0",
                role: "ADMIN",
                stripeCustomerId: "cus_PoJpILZXmK6C1I",
                studentId: "123",
                name: "John Doe",
                email: "",
            },
        };

        return handler(req, res);
    };
}
