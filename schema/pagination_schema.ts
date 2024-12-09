import { z } from "zod";
//make check schema for parama
export const ParamsSchema = z.object({
    page: z.string().transform((val) => {
        return parseInt(val);
    }),
    limit: z.string().transform((val) => {
        return parseInt(val);
    }),
});
export type ParamsSchemaValues = z.infer<typeof ParamsSchema>;
