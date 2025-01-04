import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
    id: string;
    quantity: number;
};

type CartState = {
    cart: CartItem[];
    add: (id: string, quantity: number) => void;
    remove: (id: string) => void;
    get: () => CartItem[];
    clear: () => void;
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            add: (id: string, quantity: number) => {
                const { cart } = get();
                const existingItem = cart.find((item) => item.id === id);

                const updatedCart = existingItem
                    ? cart.map((item) =>
                          item.id === id ? { ...item, quantity: item.quantity + quantity } : item,
                      )
                    : [...cart, { id, quantity }];

                set({ cart: updatedCart });
            },

            remove: (id: string) => {
                const { cart } = get();
                set({ cart: cart.filter((item) => item.id !== id) });
            },

            get: () => {
                return get().cart;
            },

            clear: () => {
                set({ cart: [] });
            },
        }),
        {
            name: "cart-storage",
        },
    ),
);
