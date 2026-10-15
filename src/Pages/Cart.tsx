import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
} from "lucide-react";
import type { RootState, AppDispatch } from "../Redux/store";
import {
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
} from "../Redux/Slices/slice";

const Cart: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart.cart);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
    const tax = subtotal * 0.05; // 5% estimated tax
    const total = subtotal + shipping + tax;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5">
                            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <img src="/logo.png" alt="NexCart Logo" className="h-5 w-5 object-contain" />
                            </div>
                        </div>
                        <span className="text-xl font-extrabold text-white tracking-tight">NexCart</span>
                    </Link>

                    <Link
                        to="/"
                        className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </header>

            {/* Main Cart Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Shopping Cart
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            {totalItems > 0
                                ? `You have ${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`
                                : "Your cart is currently empty"}
                        </p>
                    </div>

                    {cart.length > 0 && (
                        <button
                            type="button"
                            onClick={() => dispatch(clearCart())}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition cursor-pointer"
                        >
                            Clear all items
                        </button>
                    )}
                </div>

                {cart.length === 0 ? (
                    /* Empty Cart State */
                    <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
                        <div className="h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <ShoppingBag className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
                        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                            Looks like you haven't added anything to your cart yet. Explore our catalog to find items you love!
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition"
                        >
                            <span>Start Shopping</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    /* Cart Items & Order Summary Layout */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Items List (Left Column) */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-xl">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-20 w-20 bg-slate-950 rounded-xl overflow-hidden p-2 shrink-0 flex items-center justify-center border border-slate-800">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            <div className="min-w-0 space-y-1">
                                                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
                                                    {item.category || "General"}
                                                </span>
                                                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-slate-400 font-medium">
                                                    ${item.price.toFixed(2)} each
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0 pt-2 sm:pt-0">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-xl p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => dispatch(decrementQuantity(item.id))}
                                                    className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition cursor-pointer"
                                                    title="Decrease quantity"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="text-xs font-bold text-white min-w-6 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => dispatch(incrementQuantity(item.id))}
                                                    className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition cursor-pointer"
                                                    title="Increase quantity"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Item Subtotal */}
                                            <span className="text-sm sm:text-base font-bold text-white min-w-16 text-right">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => dispatch(removeFromCart(item.id))}
                                                className="p-2 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <Link
                                    to="/"
                                    className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 transition"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Continue Shopping</span>
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary (Right Column) */}
                        <div className="lg:col-span-4">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-24">
                                <h2 className="text-lg font-bold text-white">Order Summary</h2>

                                <div className="space-y-3 text-xs sm:text-sm">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span className="text-slate-200 font-semibold">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-slate-400">
                                        <span>Shipping</span>
                                        <span className="text-emerald-400 font-semibold">
                                            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-slate-400">
                                        <span>Estimated Tax (5%)</span>
                                        <span className="text-slate-200 font-semibold">
                                            ${tax.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-black text-white">
                                        <span>Total</span>
                                        <span className="text-indigo-400">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span>256-bit SSL encrypted checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
