import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ZodError } from "zod";
import { restockSchema } from "@/schema/restock/restock_schema";
import { NextRequest } from "next/server";

export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();
        //get data
        const values = restockSchema.parse(body);
        let dataToUpdate = {};
        const id = req.url.split("/").pop();
        dataToUpdate = {
            ...values,
        };
        //update DB
        const product = await prisma.product.update({
            where: {
                id,
            },
            data: {
                ...dataToUpdate,
            },
        });
        return Response.json(
            {
                message: "Le produit été modifié avec succès.",
                status: "success",
            },
            { status: 200 },
        );
    } catch (error: any) {
        if (error instanceof ZodError) {
            if (error instanceof ZodError) {
                return Response.json(
                    {
                        message: "Zod Error",
                        detail: error.issues.reduce((acc, curr) => acc + curr.message + "\n", ""),
                        more: error.issues.reduce(
                            (acc, curr) => acc + curr.path.join("->") + " ",
                            "",
                        ),
                    },
                    {
                        status: 400,
                    },
                );
            }
        } else {
            return Response.json(
                {
                    message: "Aucune donnée envoyé à mettre à jour.",
                },
                {
                    status: 418,
                },
            );
        }
    }
}; // Add closing parenthesis here
export const DELETE = async (req: NextRequest) => {
    // const user = req.user;
    try {
        const url = req.url;
        const id = url?.split("/").pop();
        if (id) {
            const product = await prisma.product.update({
                where: {
                    id,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
            return Response.json(
                {
                    message: "Le produit a été supprimé avec succès.",
                    status: "success",
                },
                { status: 200 },
            );
        }
        return Response.json(
            {
                message: "Method Not Allowed",
            },
            { status: 405 },
        );
    } catch (error: any) {
        return Response.json(
            {
                message: "ID invalide",
            },
            { status: 400 },
        );
    }
};
