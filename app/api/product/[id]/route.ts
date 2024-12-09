import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateSchema } from "@/schema/product/create_schema";
import { ParamsSchema, ParamsSchemaValues } from "@/schema/pagination_schema";
import { ZodError } from "zod";
import { restockSchema } from "@/schema/restock/restock_schema";
import deleteSchema from "@/schema/delete/delete_schema";

export const PUT = auth(async (req: any, res: any) => {
    try {
        const body = await req.json();
        const values = restockSchema.parse(body);
        let dataToUpdate = {};
        const id = req.url.split("/").pop();
        if (values !== undefined && Object.keys(values).length > 0) {
            dataToUpdate = {
                ...values,
            };
        }
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
                message: "Le produit a été modifié avec succès.",
                status: "success",
            },
            { status: 200 },
        );
    } catch (error: any) {
        if (error instanceof ZodError) {
            if (error instanceof ZodError) {
                return Response.json({
                    code: "400",
                    message: "Invalid input",
                    detail: error.issues.reduce((acc, curr) => acc + curr.message + "\n", ""),
                    more: error.issues.reduce((acc, curr) => acc + curr.path.join("->") + " ", ""),
                });
            }
        } else {
            return Response.json(
                {
                    message: "Les données envoyées sont invalides.",
                    status: error,
                },
                { status: 400 },
            );
        }
    }
});
export const DELETE = auth(async (req, res) => {
    const user = req.auth?.user;
    try {
        const url = req.url;
        const id = url?.split("/").pop();
        const values = deleteSchema.parse({ id });
        const product = await prisma.product.update({
            where: {
                id: values.id,
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
    } catch (error: any) {
        if (error instanceof ZodError) {
            return Response.json({
                code: "400",
                message: "Invalid input",
                detail: error.issues.reduce((acc, curr) => acc + curr.message + "\n", ""),
                more: error.issues.reduce((acc, curr) => acc + curr.path.join("->") + " ", ""),
            });
        } else {
            return Response.json(
                {
                    message: "Les données envoyées sont invalides.",
                    status: "error",
                },
                { status: 400 },
            );
        }
    }
});
