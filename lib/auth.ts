import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Extends NextApiRequest to include a user object
declare module "next" {
    interface NextApiRequest {
        auth?: {
            user: User;
        };
    }
}

export function auth(handler: (req: NextApiRequest, res: NextApiResponse) => void) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // TODO: Add custom implementation to authenticate the user via the auth-ms
        req.auth = {
            user: {
                azureAdId: "123",
                emailVerifiedAt: new Date(),
                githubId: "123",
                googleId: "123",
                id: "123",
                role: "ADMIN",
                stripeCustomerId: "123",
                studentId: "123",
                name: "John Doe",
                email: "",
            },
        };

        return handler(req, res);
    };
}
