import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    ShoppingBag,
    ShoppingCart,
    Heart,
    Star,
    Sparkles,
    ArrowRight,
    X,
    Plus,
    Minus,
    Trash2,
    ShieldCheck,
    Truck,
    RotateCcw,
    Check,
    LogOut,
    User as UserIcon,
    Eye,
    SlidersHorizontal,
    TrendingUp,
} from "lucide-react";

export interface ProductData {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    brand?: string;
    category?: string;
    thumbnail: string;
    images?: string[];
    // Fallbacks matching user's initial definition
    name?: string;
    discription?: string;
}

interface CartItem extends ProductData {
    quantity: number;
}

const Home: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("featured");

    // Interaction states
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem("nexcart_cart");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [wishlist, setWishlist] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem("nexcart_wishlist");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        localStorage.getItem("IsLoggedIn") === "true"
    );

    // Sync cart to local storage
    useEffect(() => {
        try {
            localStorage.setItem("nexcart_cart", JSON.stringify(cart));
        } catch (e) {
            console.error("Failed to save cart", e);
        }
    }, [cart]);

    // Sync wishlist to local storage
    useEffect(() => {
        try {
            localStorage.setItem("nexcart_wishlist", JSON.stringify(wishlist));
        } catch (e) {
            console.error("Failed to save wishlist", e);
        }
    }, [wishlist]);

    // Fetch products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch up to 100 products for a rich catalog experience
                const response = await fetch("https://dummyjson.com/products?limit=100");
                const data = await response.json();

                const mapped: ProductData[] = (data.products || []).map((p: any) => ({
                    ...p,
                    name: p.title || p.name,
                    discription: p.description || p.discription,
                }));

                setProducts(mapped);

                // Extract unique categories
                const uniqueCategories = Array.from(
                    new Set(mapped.map((p) => p.category).filter(Boolean))
                ) as string[];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        return products
            .filter((p) => {
                const matchesCategory =
                    selectedCategory === "all" || p.category === selectedCategory;
                const query = searchQuery.toLowerCase().trim();
                const matchesSearch =
                    !query ||
                    (p.title && p.title.toLowerCase().includes(query)) ||
                    (p.description && p.description.toLowerCase().includes(query)) ||
                    (p.brand && p.brand.toLowerCase().includes(query)) ||
                    (p.category && p.category.toLowerCase().includes(query));

                return matchesCategory && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === "price-low") return a.price - b.price;
                if (sortBy === "price-high") return b.price - a.price;
                if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
                return 0; // featured
            });
    }, [products, searchQuery, selectedCategory, sortBy]);

    // Cart Handlers
    const handleAddToCart = (product: ProductData) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        showToast(`Added "${product.title || product.name}" to cart!`);
    };

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
        );
    };

    const handleRemoveFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const handleToggleWishlist = (id: number) => {
        setWishlist((prev) => {
            const exists = prev.includes(id);
            if (exists) {
                showToast("Removed from wishlist");
                return prev.filter((item) => item !== id);
            } else {
                showToast("Saved to wishlist!");
                return [...prev, id];
            }
        });
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 2400);
    };

    const handleLogout = () => {
        localStorage.removeItem("IsLoggedIn");
        setIsLoggedIn(false);
        showToast("Signed out successfully");
    };

    // Calculations
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const freeShippingThreshold = 100;
    const progressToFreeShipping = Math.min(
        100,
        Math.round((cartTotal / freeShippingThreshold) * 100)
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
            {/* Background ambient glow effect */}
            <div className="fixed top-0 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

            {/* TOP NOTIFICATION BAR */}
            <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900/60 border-b border-indigo-500/20 py-2 px-4 text-center text-xs font-medium text-slate-300">
                <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Spring Shopping Festival: Enjoy <strong>Free Express Delivery</strong> on orders over $100!</span>
                </span>
            </div>

            {/* NAVBAR */}
            <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition duration-200">
                            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <img src="/logo.png" alt="NexCart Logo" className="h-6 w-6 object-contain" />
                            </div>
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                                NexCart
                            </span>
                            <span className="hidden sm:block text-[10px] font-semibold tracking-widest text-indigo-400 uppercase -mt-0.5">
                                Premium Store
                            </span>
                        </div>
                    </Link>

                    {/* Search bar */}
                    <div className="flex-1 max-w-lg mx-2 sm:mx-6">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products by name, brand, or category..."
                                className="w-full pl-10 pr-9 py-2 bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User & Actions */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {/* Wishlist Indicator */}
                        <div
                            className="relative p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition cursor-pointer"
                            title="Saved Wishlist"
                            onClick={() => {
                                if (wishlist.length > 0) {
                                    showToast(`You have ${wishlist.length} item(s) in wishlist`);
                                } else {
                                    showToast("Your wishlist is empty");
                                }
                            }}
                        >
                            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </div>

                        {/* Cart Button */}
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-2 px-3 py-2 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 rounded-xl font-medium text-sm transition cursor-pointer"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden sm:inline font-semibold">Cart</span>
                            {cartItemCount > 0 && (
                                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        {/* Auth Buttons */}
                        {isLoggedIn ? (
                            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                                    <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Member</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition cursor-pointer"
                                    title="Log out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                                <Link
                                    to="/login"
                                    className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-900 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="hidden sm:inline-flex text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl transition shadow-md shadow-indigo-600/20"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden border-b border-slate-800/80 py-12 lg:py-16 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left Hero copy */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
                                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                                Verified Premium Catalog 2026
                            </div>

                            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12]">
                                Curated Luxury & Essentials For{" "}
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Every Moment.
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
                                Explore handpicked beauty, perfumes, modern home furniture, and gourmet essentials. Fast shipping, guaranteed authentic products, and effortless checkout.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a
                                    href="#catalog"
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center gap-2"
                                >
                                    <span>Explore Catalog</span>
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory("beauty")}
                                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm transition"
                                >
                                    Featured: Beauty
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Free Express Delivery</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <span>100% Genuine</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span>30-Day Returns</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Visual Banner */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse" />
                                <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                                            Featured Pick
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                                            4.95 Rating
                                        </div>
                                    </div>

                                    {products.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="h-48 sm:h-56 w-full rounded-2xl bg-slate-950/60 overflow-hidden flex items-center justify-center p-4">
                                                <img
                                                    src={products[0]?.thumbnail}
                                                    alt={products[0]?.title}
                                                    className="h-full w-full object-contain hover:scale-105 transition duration-300"
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-white line-clamp-1">
                                                    {products[0]?.title || products[0]?.name}
                                                </h2>
                                                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                                                    {products[0]?.description || products[0]?.discription}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <div>
                                                    <span className="text-xs text-slate-500 block">Member Price</span>
                                                    <span className="text-2xl font-black text-white">
                                                        ${products[0]?.price}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddToCart(products[0])}
                                                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                                                >
                                                    <ShoppingBag className="w-4 h-4" />
                                                    <span>Add to Cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-slate-500">
                                            Loading featured product...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATALOG FILTER & TOOLBAR */}
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Product Catalog
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Showing {filteredProducts.length} results {selectedCategory !== "all" && `in "${selectedCategory}"`}
                        </p>
                    </div>

                    {/* Sort selector */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 shrink-0">
                            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                            <span>Sort by:</span>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="featured">Featured / Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rating</option>
                        </select>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${selectedCategory === "all"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                            }`}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition cursor-pointer ${selectedCategory === cat
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* PRODUCT GRID */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-1">
                {loading ? (
                    /* SKELETON LOADING STATE */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 animate-pulse space-y-4"
                            >
                                <div className="h-48 w-full bg-slate-800 rounded-xl" />
                                <div className="h-4 w-1/3 bg-slate-800 rounded" />
                                <div className="h-5 w-3/4 bg-slate-800 rounded" />
                                <div className="h-4 w-full bg-slate-800 rounded" />
                                <div className="flex items-center justify-between pt-2">
                                    <div className="h-6 w-16 bg-slate-800 rounded" />
                                    <div className="h-9 w-24 bg-slate-800 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="text-center py-24 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 max-w-md mx-auto my-8">
                        <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">No products found</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            We couldn't find any products matching your current search or category filter.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                            }}
                            className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    /* PRODUCT CARDS */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const isWishlisted = wishlist.includes(product.id);
                            const originalPrice = product.discountPercentage
                                ? (
                                    product.price /
                                    (1 - product.discountPercentage / 100)
                                ).toFixed(2)
                                : null;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-4 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden backdrop-blur-sm"
                                >
                                    {/* Top Badges & Actions */}
                                    <div>
                                        <div className="relative h-52 w-full bg-slate-950/70 rounded-xl overflow-hidden p-3 flex items-center justify-center">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title || product.name}
                                                loading="lazy"
                                                className="h-full w-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
                                            />

                                            {/* Category Tag */}
                                            {product.category && (
                                                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700/60 text-[10px] font-bold text-slate-300 uppercase tracking-wider backdrop-blur-md">
                                                    {product.category}
                                                </span>
                                            )}

                                            {/* Discount Tag */}
                                            {product.discountPercentage && product.discountPercentage > 0 && (
                                                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-500/90 text-white text-[10px] font-extrabold tracking-tight">
                                                    -{Math.round(product.discountPercentage)}%
                                                </span>
                                            )}

                                            {/* Wishlist Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleWishlist(product.id)}
                                                className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${isWishlisted
                                                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                                                    : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800"
                                                    }`}
                                                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                            >
                                                <Heart
                                                    className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`}
                                                />
                                            </button>

                                            {/* Quick View Button overlay */}
                                            <button
                                                type="button"
                                                onClick={() => setQuickViewProduct(product)}
                                                className="absolute inset-x-4 bottom-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-md border border-slate-700/60 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                                                <span>Quick View</span>
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="pt-4 space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-indigo-400 font-semibold truncate max-w-[150px]">
                                                    {product.brand || "NexCart Exclusive"}
                                                </span>
                                                <div className="flex items-center gap-1 text-amber-400 font-bold">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                    <span>{product.rating?.toFixed(1) || "4.5"}</span>
                                                </div>
                                            </div>

                                            <h3
                                                onClick={() => setQuickViewProduct(product)}
                                                className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 cursor-pointer"
                                                title={product.title || product.name}
                                            >
                                                {product.title || product.name}
                                            </h3>

                                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                {product.description || product.discription}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pricing and Add to cart */}
                                    <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-2">
                                        <div>
                                            {originalPrice && (
                                                <span className="text-[11px] text-slate-500 line-through block">
                                                    ${originalPrice}
                                                </span>
                                            )}
                                            <span className="text-lg font-black text-white">
                                                ${product.price}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(product)}
                                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* QUICK VIEW MODAL */}
            {quickViewProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div
                        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setQuickViewProduct(null)}
                            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                            {/* Product preview */}
                            <div className="h-64 sm:h-72 w-full bg-slate-950 rounded-2xl flex items-center justify-center p-4">
                                <img
                                    src={quickViewProduct.thumbnail}
                                    alt={quickViewProduct.title || quickViewProduct.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                    {quickViewProduct.category}
                                </span>

                                <h3 className="text-xl sm:text-2xl font-bold text-white">
                                    {quickViewProduct.title || quickViewProduct.name}
                                </h3>

                                <div className="flex items-center gap-2 text-xs">
                                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                                        <Star className="w-4 h-4 fill-amber-400" />
                                        <span>{quickViewProduct.rating?.toFixed(1) || "4.8"}</span>
                                    </div>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-emerald-400 font-medium">
                                        {quickViewProduct.stock ? `${quickViewProduct.stock} in stock` : "In stock"}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {quickViewProduct.description || quickViewProduct.discription}
                                </p>

                                <div className="pt-2">
                                    <span className="text-2xl font-black text-white">
                                        ${quickViewProduct.price}
                                    </span>
                                </div>

                                <div className="pt-3 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleAddToCart(quickViewProduct);
                                            setQuickViewProduct(null);
                                        }}
                                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleToggleWishlist(quickViewProduct.id)}
                                        className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                                        title="Wishlist"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${wishlist.includes(quickViewProduct.id)
                                                ? "fill-rose-500 text-rose-500"
                                                : ""
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SLIDE-OVER SHOPPING CART DRAWER */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsCartOpen(false)}
                    />

                    <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
                            {/* Header */}
                            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-indigo-400" />
                                    <h3 className="text-lg font-bold text-white">Your Cart</h3>
                                    <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                                        {cartItemCount}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Free shipping progress bar */}
                            <div className="p-4 bg-slate-950/60 border-b border-slate-800 text-xs">
                                {cartTotal >= freeShippingThreshold ? (
                                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                                        <Check className="w-4 h-4" />
                                        <span>Unlocked <strong>Free Express Shipping!</strong></span>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <p className="text-slate-300">
                                            Add <strong className="text-indigo-400">${(freeShippingThreshold - cartTotal).toFixed(2)}</strong> more for free express shipping.
                                        </p>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                                                style={{ width: `${progressToFreeShipping}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cart Items List */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="text-center py-16 space-y-3">
                                        <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                        <h4 className="text-base font-bold text-white">Your cart is empty</h4>
                                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                                            Explore our catalog and find the best items tailored for your lifestyle.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setIsCartOpen(false)}
                                            className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 bg-slate-950/40 border border-slate-800/80 p-3 rounded-2xl items-center"
                                        >
                                            <div className="h-16 w-16 bg-slate-950 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title || item.name}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <h4 className="text-sm font-bold text-white truncate">
                                                    {item.title || item.name}
                                                </h4>
                                                <span className="text-xs font-black text-indigo-400 block">
                                                    ${item.price}
                                                </span>

                                                {/* Quantity controls */}
                                                <div className="flex items-center gap-2 pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item.id, -1)}
                                                        className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold text-white min-w-4 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item.id, 1)}
                                                        className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFromCart(item.id)}
                                                className="p-2 text-slate-500 hover:text-rose-400 transition"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Cart Footer / Checkout */}
                            {cart.length > 0 && (
                                <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4">
                                    <div className="space-y-1.5 text-xs text-slate-400">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="text-white font-bold">${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className="text-emerald-400 font-semibold">
                                                {cartTotal >= freeShippingThreshold ? "Free" : "$9.99"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black text-white">
                                            <span>Total</span>
                                            <span>
                                                $
                                                {(
                                                    cartTotal +
                                                    (cartTotal >= freeShippingThreshold ? 0 : 9.99)
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            showToast("Checkout initiated! Thank you for ordering.");
                                            setCart([]);
                                            setIsCartOpen(false);
                                        }}
                                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                    >
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING TOAST NOTIFICATION */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/40 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold">{toastMessage}</span>
                </div>
            )}

            {/* FOOTER */}
            <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5">
                                <div className="h-full w-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                                    <img src="/logo.png" alt="Logo" className="h-5 w-5 object-contain" />
                                </div>
                            </div>
                            <span className="text-lg font-black text-white">NexCart</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Your premier destination for verified lifestyle, beauty, technology, and home goods with rapid worldwide courier delivery.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Shop Categories</h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <button type="button" onClick={() => setSelectedCategory("beauty")} className="hover:text-white transition">
                                    Beauty & Cosmetics
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={() => setSelectedCategory("fragrances")} className="hover:text-white transition">
                                    Luxury Fragrances
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={() => setSelectedCategory("furniture")} className="hover:text-white transition">
                                    Modern Furniture
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={() => setSelectedCategory("groceries")} className="hover:text-white transition">
                                    Gourmet Groceries
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Customer Care</h4>
                        <ul className="space-y-2 text-xs">
                            <li className="hover:text-white transition cursor-pointer">Order Tracking</li>
                            <li className="hover:text-white transition cursor-pointer">Shipping & Returns</li>
                            <li className="hover:text-white transition cursor-pointer">Warranty Policy</li>
                            <li className="hover:text-white transition cursor-pointer">24/7 Support Desk</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">Stay In The Loop</h4>
                        <p className="text-xs text-slate-400">
                            Subscribe to unlock flash coupon codes and new drop notifications.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter email..."
                                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 w-full"
                            />
                            <button
                                type="button"
                                onClick={() => showToast("Subscribed to NexCart newsletter!")}
                                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0 transition"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
                    <p>© 2026 NexCart Commerce Inc. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span>Privacy Policy</span>
                        <span>•</span>
                        <span>Terms of Service</span>
                        <span>•</span>
                        <span>Cookie Settings</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;