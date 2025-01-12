import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest) => {
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/`);
    response.cookies.set("auth-token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: -9999999,
    });
    return response;
};
