import { AddToCart } from "@/app/components/button-add-to-cart";
import { server_getUser } from "@/lib/auth";
import { Stripe } from "@/lib/stripe";
import { displayablePrice } from "@/lib/utils";
import { Product } from "@prisma/client";
import { Strong, Text } from "@radix-ui/themes";

interface ProductCardProps {
    product: Product;
}

export async function ProductCard({ product }: ProductCardProps) {
    const user = await server_getUser();
    if (!user) {
        return null;
    }

    return (
        <>
            <div className="m-3 flex max-w-[600px] gap-3 rounded-md bg-white p-5">
                <img
                    src="https://placehold.co/400"
                    alt="placeholder tmp"
                    width="100"
                    height="100"
                />
                <div className="flex flex-col gap-2">
                    <Text>
                        {product.title} -{" "}
                        <Strong>
                            {displayablePrice(Stripe.getCustomizedPrice(user, product))}€
                        </Strong>
                    </Text>
                    {product.description && <Text size="1">{product.description}</Text>}
                    <AddToCart id={product.id} />
                </div>
            </div>
        </>
    );
}
