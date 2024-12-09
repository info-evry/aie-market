import { z } from "zod";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const CreateSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Le nom du produit doit comporter au moins 1 caractère." })
        .max(100, { message: "Le nom du produit doit comporter au maximum 100 caractères." })
        .trim(),
    description: z
        .string()
        .max(500, {
            message: "La description du produit doit comporter au maximum 500 caractères.",
        })
        .trim()
        .optional()
        .nullable(),
    priceMember: z.number().int(),
    priceExternal: z.number().int(),
    customFields: z.any().optional().nullable(),
    quantity: z
        .string()
        .transform((val) => {
            return parseInt(val);
        })
        .refine((val) => Number.isInteger(val) && val > 0, {
            message: "La quantité doit être un nombre entier supérieur à zéro.",
        })
        .optional(),
    category: z
        .string()
        .max(100, { message: "La catégorie doit comporter au maximum 100 caractères." })
        .trim()
        .optional()
        .nullable(),
    isExclusiveToStudents: z.boolean().optional(),
    isExternal: z.boolean().optional(),
    isActive: z.boolean().default(true),
    image: z
        .object({
            image: z
                .any()
                .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
                .refine(
                    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
                    "Only .jpg, .jpeg, .png and .webp formats are supported.",
                ),
        })
        .optional(),
    createdAt: z.date().default(new Date()),
    deletedAt: z.date().optional().nullable(),
    packageId: z.string().cuid().optional().nullable(),
});

export type CreateSchemaValues = z.infer<typeof CreateSchema>;
