import { Product } from "@prisma/client";

const useProducts = () => {
    const fetchProducts = async (): Promise<Product[]> => {
        const response = await fetch("/api/product");
        const products = await response.json();
        return products;
    };

    return { fetchProducts };
};

export { useProducts };
