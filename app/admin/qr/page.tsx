"use client";

import { Text } from "@radix-ui/themes";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { Drawer } from "vaul";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [commande, setCommande] = useState<any>(null);
    const [consumptions, setConsumptions] = useState<Record<
        string,
        { left: number; total: number }
    > | null>(null);

    const onScan = async (codes: IDetectedBarcode[]) => {
        if (codes.length === 0) return;
        const id = codes[0].rawValue;
        const data = await fetch("/api/order/" + id).then((res) => res.json());

        const comsuptions: Record<string, { left: number; total: number }> = {};
        for (const consumption of data.consumptions) {
            comsuptions[consumption.product.id] = {
                left: consumption.quantity,
                total: data.products.find(
                    (product: any) => product.productId === consumption.productId,
                ).quantity,
            };
        }

        setCommande(data);
        setConsumptions(comsuptions);
        setIsOpen(true);
    };

    return (
        <div className="flex min-h-screen justify-center bg-blue-100">
            <div className="h-fit">
                <Scanner onScan={onScan} paused={isOpen} />
            </div>

            <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[80%] flex-col rounded-t-[10px] bg-gray-100 outline-none">
                        <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4">
                            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
                            <div className="mx-auto max-w-md overflow-y-auto">
                                <Drawer.Title asChild className="mb-4 text-gray-900">
                                    <Text className="text-lg font-semibold">
                                        Commande #{commande?.id}
                                    </Text>
                                </Drawer.Title>
                                {commande?.consumptions?.map((consumption: any) => (
                                    <div
                                        key={consumption.id}
                                        className="mb-2 flex items-center justify-between"
                                    >
                                        <Text className="text-gray-900">
                                            {consumption.product.title}
                                        </Text>
                                        <Text className="text-gray-700">
                                            {consumption.quantity}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </div>
    );
}
