"use client";

import { useCartStore } from "@/app/hooks/cart";
import { useFetch } from "@/app/hooks/use-fetch";
import { displayablePrice } from "@/lib/utils";
import { Product } from "@prisma/client";
import { Button, Text } from "@radix-ui/themes";
import { useState } from "react";

export default function PanierPage() {
    const [creatingOrder, setCreatingOrder] = useState(false);
    const { data, error, loading } = useFetch<{ mappedBody: Product[] }>("/api/product");
    const { get, remove, clear } = useCartStore();
    const productsCart = get()
        .map((item) => {
            const product = data?.mappedBody.find((el) => el.id === item.id);
            if (!product) return;

            return {
                id: product.id,
                title: product.title,
                priceMember: product.priceMember,
                priceExternal: product.priceExternal,
                image: product.image,
                quantity: item.quantity,
            };
        })
        .filter((item) => !!item);

    const createOrder = async () => {
        setCreatingOrder(true);
        const response = await fetch("/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: get(),
            }),
        });

        if (!response.ok) {
            console.error("Error creating order", response);
            return;
        }

        const data = await response.json();
        clear();
        window.location.href = data.url;
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error.message}</div>;
    if (!productsCart) return <div>Aucun produit trouvé</div>;

    return (
        <div className="flex min-h-screen justify-center bg-blue-100">
            <div className="mx-6 flex w-full flex-col gap-3 pt-3 sm:w-[500px]">
                {productsCart.map((product) => {
                    return (
                        <div
                            key={product.id}
                            className="relative flex justify-between rounded-md bg-white p-4"
                        >
                            <Button
                                className="!absolute !right-0 !top-0"
                                variant="surface"
                                size="1"
                                color="crimson"
                                onClick={() => remove(product.id)}
                            >
                                X
                            </Button>
                            <div className="flex flex-col">
                                <Text size="3" truncate>
                                    {product.title}
                                </Text>
                                <Text size="2" color="gray">
                                    Quantité : {product.quantity}
                                </Text>
                            </div>
                            <div className="my-auto flex justify-end">
                                <Text size="3" weight="bold" className="mr-3">
                                    {displayablePrice(product.priceMember * product.quantity)}€
                                </Text>
                            </div>
                        </div>
                    );
                })}

                <div className="flex justify-between rounded-md bg-white p-4">
                    <Text size="3" weight="bold">
                        Total
                    </Text>
                    <Text size="3" weight="bold">
                        {displayablePrice(
                            productsCart.reduce(
                                (acc, item) => acc + item.priceMember * item.quantity,
                                0,
                            ),
                        )}
                        €
                    </Text>
                </div>

                <div className="flex justify-center">
                    <Button
                        size="3"
                        className="!w-fit"
                        onClick={createOrder}
                        loading={creatingOrder}
                    >
                        Commander
                    </Button>
                </div>
            </div>
        </div>
    );
}
