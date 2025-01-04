"use server";

import { ProductCard } from "@/app/components/product-card";
import prisma from "@/lib/prisma";

export default async function Home() {
    const products = await prisma.product.findMany();

    return (
        <div className="min-h-screen bg-blue-100">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <ProductCard product={product} key={product.id} />
                ))}
            </div>
        </div>
    );
}
