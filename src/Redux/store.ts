import { configureStore } from '@reduxjs/toolkit';
import cartReducer from "./slice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        counter: cartReducer, // alias so existing references still work
    },
});

// Infer RootState and AppDispatch from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;