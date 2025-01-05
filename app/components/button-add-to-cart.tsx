"use client";

import { useCartStore } from "@/app/hooks/cart";
import { Button } from "@radix-ui/themes";
import { useState } from "react";

export function AddToCart({ id }: { id: string }) {
    const { add } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);
    const onAdd = () => {
        if (isAdding) return;
        setIsAdding(true);
        add(id, 1);
        setTimeout(() => setIsAdding(false), 3000);
    };

    return (
        <Button
            size="1"
            variant="outline"
            color={isAdding ? "green" : "blue"}
            className="!mt-auto !w-auto !self-start"
            onClick={onAdd}
        >
            {isAdding ? "Ajouté" : "Ajouter au panier"}
        </Button>
    );
}
