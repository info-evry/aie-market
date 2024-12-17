import { z } from "zod";
const MAX_FILE_SIZE = 5000000;
const base64ImageSchema = z
    .string()
    .refine((image) => {
        // Vérifier que l'image est une chaîne Base64 valide qui commence par un préfixe MIME valide
        const regex = /^data:image\/(jpeg|png|webp);base64,/;
        return regex.test(image);
    }, "Invalid image format. Must be a valid base64 encoded image with one of the following formats: .jpeg, .png, .webp.")
    .refine((image) => {
        const base64String = image.split(",")[1];
        const decoded = Buffer.from(base64String, "base64");
        return decoded.length <= MAX_FILE_SIZE;
    }, `Max image size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);

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
    image: base64ImageSchema.optional(),
    createdAt: z.date().default(new Date()),
    deletedAt: z.date().optional().nullable(),
    packageId: z.string().cuid().optional().nullable(),
});

export type CreateSchemaValues = z.infer<typeof CreateSchema>;
