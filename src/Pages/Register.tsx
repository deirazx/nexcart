import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { user, registerUser } from "../Constant/user";

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [form, setFormData] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError("All fields are required");
            return;
        }

        const existingUser = user.find((e) => e.email === form.email);
        if (existingUser) {
            setError("User already exists with this email");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        // Register new user
        registerUser({
            id: user.length + 1,
            name: form.name,
            email: form.email,
            password: form.password,
        });

        localStorage.setItem("IsLoggedIn", "true");
        setError("");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        navigate("/");
        console.log("Registered successfully:", form);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden text-slate-100">
            {/* Subtle background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />

            {/* Centered Register Card */}
            <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
                {/* Header / Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Join NexCart today! Please enter your details.
                    </p>
                </div>

                {/* Error notification */}
                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="flex-1 font-medium">{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="text-rose-400 hover:text-rose-200 text-xs font-bold cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-200">
                            Full Name
                        </label>
                        <div className="relative rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <User className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => {
                                    setFormData({ ...form, name: e.target.value });
                                    if (error) setError("");
                                }}
                                placeholder="Enter your full name"
                                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-200">
                            Email Id
                        </label>
                        <div className="relative rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => {
                                    setFormData({ ...form, email: e.target.value });
                                    if (error) setError("");
                                }}
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-200">
                            Password
                        </label>
                        <div className="relative rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => {
                                    setFormData({ ...form, password: e.target.value });
                                    if (error) setError("");
                                }}
                                placeholder="Create a password"
                                className="w-full pl-10 pr-10 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none transition-colors cursor-pointer"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-200">
                            Confirm Password
                        </label>
                        <div className="relative rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={(e) => {
                                    setFormData({ ...form, confirmPassword: e.target.value });
                                    if (error) setError("");
                                }}
                                placeholder="Confirm your password"
                                className="w-full pl-10 pr-10 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none transition-colors cursor-pointer"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Redirect to /login */}
                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p className="text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;