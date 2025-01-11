import { server_getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { displayablePrice } from "@/lib/utils";
import { TransactionStatus } from "@prisma/client";
import { Button, Dialog, Text } from "@radix-ui/themes";
import QRCode from "qrcode";
import { Fragment } from "react";

export default async function CommandesPage() {
    const user = await server_getUser();

    console.log(user);

    if (!user) {
        return null;
    }

    const commandes = await prisma.order.findMany({
        where: {
            userId: user.id,
        },
        include: {
            Transaction: true,
            products: {
                include: {
                    product: true,
                },
            },
        },
    });

    const QRs: Record<string, string> = {};

    for (const commande of commandes) {
        if (commande.Transaction?.status === TransactionStatus.SUCCEEDED) {
            const qr = await QRCode.toDataURL(commande.id, {
                errorCorrectionLevel: "H",
                width: 300,
                margin: 1,
            });
            QRs[commande.id] = qr;
        }
    }

    return (
        <div className="flex min-h-screen justify-center bg-blue-100">
            <div className="mx-6 flex w-full flex-col gap-3 pt-3 sm:w-[500px]">
                {commandes.map((commande) => {
                    return (
                        <div
                            key={commande.id}
                            className="flex flex-col gap-3 rounded-md bg-white p-3"
                        >
                            <Text size="3" weight="bold">
                                Commande #<span className="!italic underline">{commande.id}</span>
                            </Text>
                            <div className="flex flex-col gap-3">
                                {commande.products.map((product) => {
                                    return (
                                        <Fragment key={product.id}>
                                            <Text size="2">
                                                {product.product.title} -{" "}
                                                <Text size="2">x{product.quantity}</Text>
                                            </Text>
                                        </Fragment>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-lg font-semibold">
                                    {displayablePrice(commande.Transaction?.amount)}€
                                </p>
                                {commande.Transaction?.status === TransactionStatus.PENDING && (
                                    <Text color="orange" size="2">
                                        En attente de paiement
                                    </Text>
                                )}
                                {(commande.Transaction?.status === TransactionStatus.FAILED ||
                                    commande.Transaction?.status === TransactionStatus.EXPIRED) && (
                                    <Text color="red" size="2">
                                        Paiement refusé
                                    </Text>
                                )}
                                {commande.Transaction?.status === TransactionStatus.SUCCEEDED && (
                                    <Text color="green" size="2">
                                        Payé
                                    </Text>
                                )}
                            </div>
                            {commande.Transaction?.status === TransactionStatus.SUCCEEDED && (
                                <Dialog.Root>
                                    <Dialog.Trigger>
                                        <Button>QR Code</Button>
                                    </Dialog.Trigger>
                                    <Dialog.Content className="flex flex-col items-center gap-3">
                                        <img height="300" width="300" src={QRs[commande.id]} />
                                        <Dialog.Close>
                                            <Button variant="soft" color="gray">
                                                Fermer
                                            </Button>
                                        </Dialog.Close>
                                    </Dialog.Content>
                                </Dialog.Root>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
