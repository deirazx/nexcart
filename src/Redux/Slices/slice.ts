import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    description?: string;
    thumbnail?: string;
    quantity: number;
    category?: string;
    discountPercentage?: number;
}

export interface CartState {
    cart: CartItem[];
}

const initialState: CartState = {
    cart: [],
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const isExistItem = state.cart.find((e) => e.id === action.payload.id);

            if (isExistItem) {
                isExistItem.quantity += 1;
            } else {
                state.cart.unshift({ ...action.payload, quantity: 1 });
            }

        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload);
        },
        incrementQuantity: (state, action: PayloadAction<number>) => {
            const item = state.cart.find((i) => i.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decrementQuantity: (state, action: PayloadAction<number>) => {
            const item = state.cart.find((i) => i.id === action.payload);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.cart = state.cart.filter((i) => i.id !== action.payload);
                }
            }
        },
        clearCart: (state) => {
            state.cart = [];
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;