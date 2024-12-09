import { z } from "zod";

const deleteSchema = z.object({
    id: z.string(),
});

export default deleteSchema;
