/* eslint-disable no-unused-vars */
import { Eye, EyeOff, Mail, Check, User, Lock } from "lucide-react"; // Added Lock
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { signUp } from "../../../Services/Operation/authApi";

function Signup() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const [showPass, setShowPass] = useState({
        n_pass: false,
        c_pass: false,
    });

    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");

    // Only show match icon if both fields are filled and matching
    const isMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

    function onSubmit(data) {
        const { email, password, firstName, lastName } = data;
        dispatch(signUp(navigate, email, password, firstName, lastName, undefined));
    }

    // Styles
    const inputBaseStyle = "w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm";
    const inputFocusStyle = "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 border-gray-200";
    const errorBorderStyle = "border-red-400 focus:ring-red-100 focus:border-red-400";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16 relative overflow-hidden">

            {/* Background Grid */}
            <div className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            >
                <div className="absolute inset-0 bg-slate-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Form Container */}
            <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 border border-white">

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-500 mt-2">
                        Welcome to <span className="text-indigo-600 font-semibold">Fikri shop</span>!
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Names Row */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="relative block">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    {...register("firstName", { required: "Required" })}
                                    type="text"
                                    placeholder="First Name"
                                    className={`${inputBaseStyle} ${errors.firstName ? errorBorderStyle : inputFocusStyle}`}
                                />
                            </label>
                        </div>
                        <div className="flex-1">
                            <input
                                {...register("lastName", { required: "Required" })}
                                type="text"
                                placeholder="Last Name"
                                className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${errors.lastName ? errorBorderStyle : inputFocusStyle}`}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="relative block">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                })}
                                type="email"
                                placeholder="Enter your email"
                                className={`${inputBaseStyle} ${errors.email ? errorBorderStyle : inputFocusStyle}`}
                            />
                        </label>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type={showPass.n_pass ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Min length is 6" },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/,
                                        message: "Must contain letter & number",
                                    },
                                })}
                                placeholder="••••••••"
                                className={`${inputBaseStyle} ${errors.password ? errorBorderStyle : inputFocusStyle}`}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                                onClick={() => setShowPass((p) => ({ ...p, n_pass: !p.n_pass }))}
                            >
                                {showPass.n_pass ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPass.c_pass ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (val) => val === password || "Passwords do not match",
                                })}
                                placeholder="••••••••"
                                className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isMatch
                                        ? "border-green-500 ring-2 ring-green-500/10 focus:border-green-500"
                                        : errors.confirmPassword ? errorBorderStyle : inputFocusStyle
                                    }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <AnimatePresence>
                                    {isMatch && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="text-green-500"
                                        >
                                            <Check size={18} strokeWidth={3} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-indigo-500 transition-colors"
                                    onClick={() => setShowPass((p) => ({ ...p, c_pass: !p.c_pass }))}
                                >
                                    {showPass.c_pass ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 mt-4 cursor-pointer rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${loading
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;