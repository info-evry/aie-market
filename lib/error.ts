import { ZodError } from "zod";

export function handleValidationError(error: unknown) {
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
