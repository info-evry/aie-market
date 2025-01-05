import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const POST = auth(async (req, res) => {
    const id = req.url.split("/").pop();

    if (!id) {
        return Response.json({ message: "ID de la consommation non fourni." }, { status: 400 });
    }

    try {
        const consumption = await prisma.consumption.findUnique({
            where: {
                id,
            },
        });

        if (!consumption) {
            return Response.json({ message: "Consommation non trouvée." }, { status: 404 });
        }

        if (consumption.quantity <= 0) {
            return Response.json({ message: "Consommation déjà épuisée." }, { status: 400 });
        }

        await prisma.consumption.update({
            where: {
                id,
            },
            data: {
                quantity: consumption.quantity - 1,
            },
        });

        return Response.json({ message: "La consommation a été mis à jour." }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Une erreur serveur est survenue." }, { status: 500 });
    }
});
