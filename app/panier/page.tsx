"use client";

import { useCartStore } from "@/app/hooks/cart";
import { useFetch } from "@/app/hooks/use-fetch";
import { displayablePrice } from "@/lib/utils";
import { Product } from "@prisma/client";
import { Button, Text } from "@radix-ui/themes";

export default function PanierPage() {
    const { data, error, loading } = useFetch<{ mappedBody: Product[] }>("/api/product");
    const { get, remove } = useCartStore();
    const productsCart = get().map((item) => {
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
    });

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error.message}</div>;
    if (!productsCart) return <div>Aucun produit trouvé</div>;

    return (
        <div className="flex min-h-screen justify-center bg-blue-100">
            <div className="mx-6 flex w-full flex-col gap-3 pt-3 sm:w-[500px]">
                {productsCart.map((product) => {
                    if (!product) return;

                    return (
                        <div
                            key={product.id}
                            className="flex justify-between rounded-md bg-white p-4"
                        >
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
                                <Button color="red" size="1" onClick={() => remove(product.id)}>
                                    X
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
