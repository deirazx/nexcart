import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../Redux/store";
import { addToCart, type CartItem } from "../Redux/Slices/slice";
import Navbar from "../Components/Navbar";

export interface ProductData {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    rating?: number;
    category?: string;
    discountPercentage?: number;
}

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart.cart);

    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<ProductData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://dummyjson.com/products");
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = (product: ProductData) => {
        const item: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            description: product.description,
            quantity: 1,
            category: product.category,
            discountPercentage: product.discountPercentage,
        };
        dispatch(addToCart(item));
    };

    const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Products
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Explore our latest collections and essentials
                        </p>
                    </div>
                    <Link
                        to="/cart"
                        className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                    >
                        <span>View Cart ({cartTotalCount})</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 animate-pulse space-y-3"
                            >
                                <div className="h-44 w-full bg-slate-800 rounded-xl" />
                                <div className="h-4 w-3/4 bg-slate-800 rounded" />
                                <div className="h-4 w-1/2 bg-slate-800 rounded" />
                                <div className="h-9 w-full bg-slate-800 rounded-xl mt-4" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-xl transition-all duration-200 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="relative h-48 w-full bg-slate-950/70 rounded-xl overflow-hidden p-3 flex items-center justify-center">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            loading="lazy"
                                            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.discountPercentage && product.discountPercentage > 0 && (
                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold">
                                                -{Math.round(product.discountPercentage)}%
                                            </span>
                                        )}
                                    </div>

                                    <div className="pt-3 space-y-1">
                                        <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                                            <span className="text-slate-500 font-medium capitalize">
                                                {product.category || "General"}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                <span>{product.rating?.toFixed(1) || "4.5"}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-bold text-white line-clamp-1" title={product.title}>
                                            {product.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-3">
                                    <span className="text-lg font-black text-white">
                                        ${product.price}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;