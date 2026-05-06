import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check } from 'lucide-react'; 
import { AnimatePresence } from "framer-motion"; 
import { changePassword } from "../../../Services/Operation/authApi";

function Forgot_pass() {
    // Added 'watch' to track input values in real-time
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const email = location.state?.email;

    // Watch fields for comparison
    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");

    // Logic to show the tick: fields match and aren't empty
    const isMatch = password && confirmPassword && password === confirmPassword;

    const [showPass, setShowPass] = useState({
        n_pass: false,
        c_pass: false
    });

    function onSubmit(data) {
        console.log("Form Data:", data, email);
        dispatch(changePassword(email, data.password, navigate));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Password</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* New Password Field */}
                    <div>
                        <label className="block relative text-sm font-medium text-gray-700 mb-1">
                            New Password
                            <input
                                type={showPass.n_pass ? 'text' : "password"}
                                placeholder="••••••••"
                                {...register('password', {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Min length is 6 characters" },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,20}$/,
                                        message: "Must include uppercase, lowercase, number & special character"
                                    }
                                })}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <div className="text-gray-400 absolute right-3 top-9 cursor-pointer">
                                {showPass.n_pass ?
                                    <Eye size={20} onClick={() => setShowPass(prev => ({ ...prev, n_pass: false }))} /> :
                                    <EyeOff size={20} onClick={() => setShowPass(prev => ({ ...prev, n_pass: true }))} />
                                }
                            </div>
                        </label>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block relative text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                            <input
                                type={showPass.c_pass ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (val) => val === password || "Passwords do not match"
                                })}
                                className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition-colors duration-300 ${isMatch ? "border-green-500 focus:ring-green-500" : "border-gray-300 focus:ring-indigo-500"
                                    }`}
                            />

                            {/* Container for Icons (Eye + Green Tick) */}
                            <div className="absolute right-3 top-9 flex items-center gap-2">
                                <AnimatePresence>
                                    {isMatch && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="text-green-500"
                                        >
                                            <Check size={20} strokeWidth={3} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="text-gray-400 cursor-pointer">
                                    {showPass.c_pass ? (
                                        <Eye size={20} onClick={() => setShowPass((prev) => ({ ...prev, c_pass: false }))} />
                                    ) : (
                                        <EyeOff size={20} onClick={() => setShowPass((prev) => ({ ...prev, c_pass: true }))} />
                                    )}
                                </div>
                            </div>
                        </label>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:bg-indigo-700 cursor-pointer"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Forgot_pass;