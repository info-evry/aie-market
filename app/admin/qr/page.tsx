"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, Callout, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { Fragment, useState } from "react";
import { Drawer } from "vaul";

type ConsumptionArray = Array<{
    consumptionId: string;
    title: string;
    productId: string;
    left: number;
    total: number;
}>;

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [commande, setCommande] = useState<any>(null);
    const [consumptions, setConsumptions] = useState<ConsumptionArray | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onScan = async (codes: IDetectedBarcode[]) => {
        if (codes.length === 0) return;
        const id = codes[0].rawValue;
        const data = await fetch("/api/order/" + id).then((res) => res.json());

        const _consumptions = data.consumptions.map((consumption: any) => ({
            consumptionId: consumption.id,
            title: consumption.product.title,
            productId: consumption.productId,
            left: consumption.quantity,
            total: data.products.find((product: any) => product.productId === consumption.productId)
                .quantity,
        }));

        console.log(_consumptions);

        setCommande(data);
        setConsumptions(_consumptions);
        setIsOpen(true);
    };

    const onConsume = async (consumptionId: string) => {
        if (!consumptions) return; // Should never happen

        const res = await fetch("/api/consume/" + consumptionId, {
            method: "POST",
        });

        if (res.status === 400 || res.status === 404 || res.status === 500) {
            res.json().then((data) => setError(data.message));
            return;
        }

        const _consumptions: ConsumptionArray = consumptions.map((consumption) => {
            if (consumption.consumptionId === consumptionId) {
                return {
                    ...consumption,
                    left: consumption.left - 1,
                };
            }
            return consumption;
        });

        setConsumptions(_consumptions);
    };

    return (
        <div className="flex min-h-screen justify-center bg-blue-100">
            <div className="h-fit">
                <Scanner onScan={onScan} paused={isOpen} />
            </div>

            <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[80%] flex-col rounded-t-[10px] bg-gray-100 outline-none">
                    <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4">
                        <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
                        <div className="mx-auto max-w-md overflow-y-auto">
                            <Drawer.Title asChild className="text-gray-900">
                                <Text size="5">Commande #{commande?.id}</Text>
                            </Drawer.Title>

                            {error && (
                                <Callout.Root color="red" role="alert" className="mt-4">
                                    <Callout.Icon>
                                        <ExclamationTriangleIcon />
                                    </Callout.Icon>
                                    <Callout.Text>{error}</Callout.Text>
                                </Callout.Root>
                            )}

                            <div className="mt-4 grid grid-cols-[4fr_2fr_1fr] gap-4">
                                <Text className="text-gray-900" weight="bold">
                                    Article
                                </Text>
                                <Text className="text-gray-900" align="center" weight="bold">
                                    Restant/Total
                                </Text>
                                <Text className="text-gray-900" weight="bold">
                                    Consommer
                                </Text>
                                {consumptions?.map((consumption) => (
                                    <Fragment key={consumption.consumptionId}>
                                        <Text className="text-gray-900">{consumption.title}</Text>
                                        <Text className="text-gray-700" align="center">
                                            {consumption.left}/{consumption.total}
                                        </Text>
                                        <Button
                                            size="1"
                                            variant="outline"
                                            className="!w-fit !justify-self-center"
                                            onClick={() => onConsume(consumption.consumptionId)}
                                        >
                                            ✓
                                        </Button>
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Root>
        </div>
    );
}
