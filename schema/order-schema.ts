import { z } from "zod";

export const createOrder = z.object({
    items: z
        .object({
            id: z.string(),
            quantity: z.number(),
        })
        .array(),
});
