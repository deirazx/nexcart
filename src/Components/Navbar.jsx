import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {
    const cart = useSelector((state) => state.cart.cart);
    const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5">
                        <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <img src="/logo.png" alt="NexCart Logo" className="h-5 w-5 object-contain" />
                        </div>
                    </div>
                    <span className="text-xl font-extrabold text-white tracking-tight">NexCart</span>
                </Link>

                {/* Right Navigation & Cart */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 px-3 py-2 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 rounded-xl text-sm font-semibold transition"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Cart</span>
                        {cartTotalCount > 0 && (
                            <span className="bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center">
                                {cartTotalCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/login"
                        className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;