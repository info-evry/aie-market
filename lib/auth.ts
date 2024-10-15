import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// Extends NextApiRequest to include a user object
declare module "next" {
    interface NextApiRequest {
        auth?: {
            user: {
                name: string;
                email: string;
            };
        };
    }
}

export function auth(handler: (req: NextApiRequest, res: NextApiResponse) => void) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // TODO: Add custom implementation to authenticate the user via the auth-ms
        req.auth = {
            user: {
                name: "John Doe",
                email: "",
            },
        };

        return handler(req, res);
    };
}
