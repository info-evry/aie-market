import { NextRequest } from "next/server";
import { ZodError } from "zod";
import prisma from "../../../lib/prisma";
import { ParamsSchema, ParamsSchemaValues } from "../../../schema/pagination_schema";
import { CreateSchema } from "../../../schema/product/create_schema";

export const POST = async (req: NextRequest) => {
    // const user = req.auth.user;
    try {
        const body = await req.json();
        const values = CreateSchema.parse(body);
        const product = await prisma.product.create({
            data: {
                title: values.title.toLowerCase(),
                description: values.description,
                priceMember: values.priceMember,
                priceExternal: values.priceExternal,
                customFields: values.customFields,
                quantity: values.quantity,
                category: values.category,
                isExclusiveToStudents: values.isExclusiveToStudents,
                isExternal: values.isExternal,
                isActive: values.isActive,
                image: Buffer.from(String(values.image)),
                createdAt: values.createdAt,
                deletedAt: values.deletedAt,
                packageId: values.packageId,
            },
        });
        return Response.json(
            {
                message: "Le produit a été créé avec succès.",
                status: "success",
                product,
            },
            { status: 201 },
        );
    } catch (error: any) {
        if (error instanceof ZodError) {
            return Response.json(
                {
                    message: "Zod Error",
                    detail: error.issues.reduce((acc, curr) => acc + curr.message + "\n", ""),
                    more: error.issues.reduce((acc, curr) => acc + curr.path.join("->") + " ", ""),
                },
                { status: 400 },
            );
        }
    }
};
export const GET = async (req: NextRequest) => {
    let values: ParamsSchemaValues;
    const page = req.nextUrl.searchParams.get("page");
    const limit = req.nextUrl.searchParams.get("limit");
    try {
        if (page && page !== "0" && limit && limit !== "0") {
            values = ParamsSchema.parse({ page, limit });
            const body = await prisma.product.findMany({
                skip: values.page * values.limit,
                take: values.limit,
                where: {
                    deletedAt: null,
                },
            });
            const mappedBody = body.map((product) => {
                return {
                    ...product,
                    image: "data:image/*;base64," + product.image.toString("base64"),
                };
            });
            return Response.json({
                message:
                    "Les produits entre la page " +
                    values.page +
                    " et " +
                    values.limit +
                    " ont été récupérés avec succès.",
                status: "success",
                mappedBody,
            });
        } else {
            const product = await prisma.product.findMany({
                where: {
                    deletedAt: null,
                },
            });
            const mappedBody = product.map((product) => {
                return {
                    ...product,
                    image: "data:image/*;base64," + product.image.toString("base64"),
                };
            });
            return Response.json(
                {
                    message: "Tout les produits ont été récupérés avec succès.",
                    status: "success",
                    mappedBody,
                },
                { status: 200 },
            );
        }
    } catch (error: any) {}
};
