import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    ArrowLeft,
    ShieldCheck,
    CreditCard,
    Lock,
    Truck,
    MapPin,
    Mail,
    CheckCircle2,
    ShoppingBag,
    Tag,
    AlertCircle,
} from "lucide-react";
import type { RootState, AppDispatch } from "../Redux/store";
import { clearCart } from "../Redux/Slices/slice";

interface CheckoutFormData {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    shippingMethod: "standard" | "express";
    paymentMethod: "card" | "upi" | "cod";
    cardName?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
}

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart.cart);

    const [form, setForm] = useState<CheckoutFormData>({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        shippingMethod: "standard",
        paymentMethod: "cod",
        cardName: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
    });

    const [paymentWarning, setPaymentWarning] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [promoApplied, setPromoApplied] = useState<boolean>(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string>("");

    // Financial calculations matching Cart.tsx
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const baseShipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
    const shipping = form.shippingMethod === "express" ? baseShipping + 14.99 : baseShipping;
    const tax = subtotal * 0.05;
    const total = Math.max(0, subtotal + shipping + tax - discount);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleApplyPromo = () => {
        if (!promoCode.trim()) return;
        if (promoCode.toUpperCase() === "NEXCART10" || promoCode.toUpperCase() === "DISCOUNT10") {
            setDiscount(subtotal * 0.1); // 10% discount
            setPromoApplied(true);
        } else {
            alert("Invalid promo code! Try 'NEXCART10'");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setOrderId(`NX-${Math.floor(100000 + Math.random() * 900000)}`);
        setIsOrderPlaced(true);
        dispatch(clearCart());
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Header */}
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
                        to="/cart"
                        className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Cart</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
                {/* Page Title & Breadcrumb */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                        <Link to="/cart" className="hover:text-indigo-400 transition">Cart</Link>
                        <span>/</span>
                        <span className="text-indigo-400 font-semibold">Checkout</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Checkout
                    </h1>
                </div>

                {isOrderPlaced ? (
                    /* Order Success Screen */
                    <div className="text-center py-20 bg-slate-900/70 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl">
                        <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-400">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md">
                            Order Confirmed
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                            Thank you for your order!
                        </h2>
                        <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                            Your order <strong className="text-white">#{orderId || "NX-948210"}</strong> has been placed and is now being prepared for shipping.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    /* 2-Column Checkout Layout */
                    <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Form Input Fields */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* 1. Contact Information */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                                    <Mail className="w-4 h-4" />
                                    <span>Contact Information</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Email Address *
                                        </label>
                                        <div className="relative rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={form.email}
                                                onChange={handleInputChange}
                                                placeholder="you@example.com"
                                                className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Phone Number *
                                        </label>
                                        <div className="relative rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={form.phone}
                                                onChange={handleInputChange}
                                                placeholder="+91 98765 43210"
                                                className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Shipping Address */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                                    <MapPin className="w-4 h-4" />
                                    <span>Shipping Address</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            First Name *
                                        </label>
                                        <div className="rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                value={form.firstName}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                                className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Last Name *
                                        </label>
                                        <div className="rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                value={form.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Doe"
                                                className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Street Address *
                                        </label>
                                        <div className="rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                            <input
                                                type="text"
                                                name="address"
                                                required
                                                value={form.address}
                                                onChange={handleInputChange}
                                                placeholder="123 Main Street, Sector 4"
                                                className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Apartment, suite, unit (optional)
                                        </label>
                                        <div className="rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                            <input
                                                type="text"
                                                name="apartment"
                                                value={form.apartment}
                                                onChange={handleInputChange}
                                                placeholder="Apt 4B"
                                                className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            City *
                                        </label>
                                        <div className="rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={form.city}
                                                onChange={handleInputChange}
                                                placeholder="Mumbai"
                                                className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-300">
                                                State *
                                            </label>
                                            <div className="rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                                <input
                                                    type="text"
                                                    name="state"
                                                    required
                                                    value={form.state}
                                                    onChange={handleInputChange}
                                                    placeholder="Maharashtra"
                                                    className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-300">
                                                ZIP / Postal *
                                            </label>
                                            <div className="rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    required
                                                    value={form.zipCode}
                                                    onChange={handleInputChange}
                                                    placeholder="400001"
                                                    className="w-full px-3.5 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Delivery Method */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                                    <Truck className="w-4 h-4" />
                                    <span>Delivery Method</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label
                                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition ${form.shippingMethod === "standard"
                                            ? "border-indigo-500 bg-indigo-500/10"
                                            : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-white">Standard Delivery</span>
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value="standard"
                                                checked={form.shippingMethod === "standard"}
                                                onChange={() => setForm({ ...form, shippingMethod: "standard" })}
                                                className="accent-indigo-500"
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400 mt-2 block">
                                            3-5 business days
                                        </span>
                                        <span className="text-xs font-bold text-emerald-400 mt-1">
                                            {baseShipping === 0 ? "FREE" : `$${baseShipping.toFixed(2)}`}
                                        </span>
                                    </label>

                                    <label
                                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition ${form.shippingMethod === "express"
                                            ? "border-indigo-500 bg-indigo-500/10"
                                            : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-white">Express Courier</span>
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value="express"
                                                checked={form.shippingMethod === "express"}
                                                onChange={() => setForm({ ...form, shippingMethod: "express" })}
                                                className="accent-indigo-500"
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400 mt-2 block">
                                            1-2 business days
                                        </span>
                                        <span className="text-xs font-bold text-indigo-400 mt-1">
                                            ${(baseShipping + 14.99).toFixed(2)}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* 4. Payment Information */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Payment Details</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>End-to-End Encrypted</span>
                                    </div>
                                </div>

                                {/* Payment Method Options */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        {/* Cash on Delivery (Active) */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setForm({ ...form, paymentMethod: "cod" });
                                                setPaymentWarning(null);
                                            }}
                                            className="py-3 px-3.5 rounded-xl text-xs font-semibold border transition cursor-pointer text-left bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/20 relative"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold">Cash on Delivery</span>
                                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                                                    Available
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-300 mt-1 block">Pay at doorstep</span>
                                        </button>

                                        {/* Credit / Debit Card (Disabled with notice) */}
                                        <button
                                            type="button"
                                            onClick={() => setPaymentWarning("We are working on Credit/Debit Card payments! This is currently under development. Please continue with Cash on Delivery (COD).")}
                                            className="py-3 px-3.5 rounded-xl text-xs font-semibold border transition cursor-pointer text-left bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>Credit / Debit Card</span>
                                                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                                    In Progress
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-500 mt-1 block">Under Development</span>
                                        </button>

                                        {/* UPI / NetBanking (Disabled with notice) */}
                                        <button
                                            type="button"
                                            onClick={() => setPaymentWarning("We are working on UPI & NetBanking! This is currently under development. Please continue with Cash on Delivery (COD).")}
                                            className="py-3 px-3.5 rounded-xl text-xs font-semibold border transition cursor-pointer text-left bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>UPI / NetBanking</span>
                                                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                                    In Progress
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-500 mt-1 block">Under Development</span>
                                        </button>
                                    </div>

                                    {/* Development Notice Alert Banner */}
                                    {paymentWarning && (
                                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-semibold leading-relaxed">{paymentWarning}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentWarning(null)}
                                                className="text-amber-400 hover:text-amber-200 text-xs font-bold cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    {/* Cash on Delivery Details Box */}
                                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Cash on Delivery (COD) Selected</span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            No online payment needed right now! You can conveniently pay in cash or via UPI QR code directly to the courier when your order is delivered to your address.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={cart.length === 0}
                                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                                <Lock className="w-4 h-4" />
                                <span>Place Order • ${total.toFixed(2)}</span>
                            </button>
                        </div>

                        {/* Right Column: Data like cart.jsx */}
                        <div className="lg:col-span-5 space-y-5 sticky top-24">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-indigo-400" />
                                        <h2 className="text-lg font-bold text-white">Order Summary</h2>
                                    </div>
                                    <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2.5 py-0.5 rounded-full">
                                        {totalItems} item{totalItems > 1 ? "s" : ""}
                                    </span>
                                </div>

                                {/* Items List */}
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-800/60">
                                    {cart.length === 0 ? (
                                        <p className="text-xs text-slate-400 py-4 text-center">
                                            No items in cart
                                        </p>
                                    ) : (
                                        cart.map((item) => (
                                            <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                                                <div className="relative h-14 w-14 bg-slate-950 rounded-xl p-1 shrink-0 flex items-center justify-center border border-slate-800">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="h-full w-full object-contain"
                                                    />
                                                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                                                        {item.quantity}
                                                    </span>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-xs font-bold text-white truncate" title={item.title}>
                                                        {item.title}
                                                    </h3>
                                                    <span className="text-[11px] text-slate-400 capitalize block">
                                                        {item.category || "General"}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-300">
                                                        ${item.price.toFixed(2)} × {item.quantity}
                                                    </span>
                                                </div>

                                                <span className="text-sm font-bold text-white shrink-0">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Promo Code Input */}
                                <div className="pt-3 border-t border-slate-800">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1 rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 transition">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="Promo code (e.g. NEXCART10)"
                                                className="w-full px-3 py-2 bg-transparent text-slate-100 placeholder-slate-500 text-xs focus:outline-none rounded-xl uppercase"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleApplyPromo}
                                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {promoApplied && (
                                        <p className="text-[11px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            <span>10% Discount Applied!</span>
                                        </p>
                                    )}
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-2.5 text-xs sm:text-sm pt-3 border-t border-slate-800">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="text-slate-200 font-semibold">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-slate-400">
                                        <span>Shipping</span>
                                        <span className={shipping === 0 ? "text-emerald-400 font-semibold" : "text-slate-200 font-semibold"}>
                                            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-slate-400">
                                        <span>Estimated Tax (5%)</span>
                                        <span className="text-slate-200 font-semibold">
                                            ${tax.toFixed(2)}
                                        </span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-400 font-semibold">
                                            <span>Discount</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-black text-white">
                                        <span>Total</span>
                                        <span className="text-indigo-400">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span>Guaranteed safe checkout & 256-bit encryption</span>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
};

export default Checkout;
