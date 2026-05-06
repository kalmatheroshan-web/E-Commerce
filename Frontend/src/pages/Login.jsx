import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Services/Operation/authApi";

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const location = useLocation();

    function onSubmit(data) {
        const { email, password } = data;
        dispatch(login(email, password, navigate));
    }

    // return (
    //     /* 1. Added 'relative' and 'overflow-hidden' to contain the grid */
    //     <div className="relative min-h-screen flex items-center justify-center bg-white px-4 overflow-hidden">

    //         {/* 2. The Grid Background Layer */}
    //         <div className="absolute inset-0 z-0 opacity-20" 
    //              style={{ 
    //                 backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px), radial-gradient(#4f46e5 0.5px, #ffffff 0.5px)`,
    //                 backgroundSize: '20px 20px',
    //                 backgroundPosition: '0 0, 10px 10px'
    //              }}>
    //         </div>

    //         {/* 3. Added 'z-10' to ensure card stays above the grid */}
    //         <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">

    //             {/* Logo / Title */}
    //             <div className="text-center mb-6">
    //                 <h2 className="text-3xl font-semibold text-gray-800">Login</h2>
    //                 <p className="text-gray-500 text-sm mt-1">
    //                     Welcome back! Please enter your details
    //                 </p>
    //             </div>

    //             {/* Form */}
    //             <div className="flex flex-col gap-4">
    //                 <form onSubmit={handleSubmit(onSubmit)}>

    //                     {/* Email */}
    //                     <label className="relative block mb-4">
    //                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    //                         <input
    //                             {...register("email", { required: "Email is required" })}
    //                             type="email"
    //                             placeholder="Enter your email"
    //                             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none
    //                         focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    //                         />
    //                         {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
    //                     </label>

    //                     {/* Password */}
    //                     <div className="flex flex-col gap-1 mt-2">
    //                         <label className="relative block">
    //                             <Lock
    //                                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    //                                 size={18}
    //                             />
    //                             <input
    //                                 {...register("password", {
    //                                     required: "Password is required",
    //                                 })}
    //                                 type="password"
    //                                 placeholder="Enter your password"
    //                                 className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all
    //                                     ${errors.password
    //                                         ? "border-red-500 focus:ring-2 focus:ring-red-200"
    //                                         : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //                                     }`}
    //                             />
    //                         </label>
    //                         {errors.password && (
    //                             <span className="text-xs text-red-500 ml-1">
    //                                 {errors.password.message}
    //                             </span>
    //                         )}
    //                     </div>

    //                     {/* Options */}
    //                     <div className="flex justify-between select-none items-center text-sm mt-4">
    //                         <label className="flex items-center gap-2 cursor-pointer">
    //                             <input type="checkbox" className="accent-blue-600 h-4 w-4" />
    //                             <span className="text-gray-600">Remember me</span>
    //                         </label>
    //                         <Link to={'/forget'}>
    //                             <span className="text-blue-600 hover:underline cursor-pointer">
    //                                 Forgot password?
    //                             </span>
    //                         </Link>
    //                     </div>

    //                     {/* Button */}
    //                     {loading ? (
    //                         <div className="flex justify-center gap-2 text-white mt-6 w-full bg-blue-600 items-center rounded-lg px-4 py-2">
    //                             <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                 <circle className="opacity-25" cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5"></circle>
    //                                 <path className="opacity-75" fill="currentColor" d="M32 4a28 28 0 0 1 28 28h-8a20 20 0 0 0-20-20V4z"></path>
    //                             </svg>
    //                             <span>Wait...</span>
    //                         </div>
    //                     ) : (
    //                         <button type="submit"
    //                             className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg
    //                             transition font-medium cursor-pointer shadow-lg shadow-blue-200"
    //                         >
    //                             Login
    //                         </button>
    //                     )}
    //                 </form>

    //                 {/* Footer */}
    //                 {!location.pathname.includes('admin') && (
    //                     <p className="text-center text-sm text-gray-500 mt-4">
    //                         Don’t have an account?{" "}
    //                         <Link to={'/signup'} className="text-blue-600 font-semibold hover:underline">
    //                             Sign up
    //                         </Link>
    //                     </p>
    //                 )}
    //             </div>
    //         </div>
    //     </div>
    // );
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-50 px-4 overflow-hidden">

            {/* --- The Grid Background Layer --- */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                    linear-gradient(to right, #e2e8f0 .5px, transparent 1px),
                    linear-gradient(to bottom, #e2e8f0 .5px, transparent 1px)
                `,
                    backgroundSize: '40px 40px',
                }}
            >
                {/* Optional: Radial mask to make the grid fade out towards the edges */}
                <div className="absolute inset-0 bg-slate-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>
            <div className="relative ">
                {/* --- Card (Z-index 10 to stay on top) --- */}
                <div className="relative z-10 md:w-[100vw] w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">

                    {/* Logo / Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Login</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Welcome back! Please enter your details
                        </p>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-4">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="relative block">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        {...register("email", { required: "Email is required" })}
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg outline-none
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                    />
                                </label>
                                {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1">
                                <label className="relative block">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        {...register("password", { required: "Password is required" })}
                                        type="password"
                                        placeholder="Enter your password"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-all bg-white
                                    ${errors.password ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                                    />
                                </label>
                                {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
                            </div>

                            {/* Options */}
                            <div className="flex justify-between items-center text-sm mt-4">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="accent-blue-600 h-4 w-4" />
                                    <span className="text-gray-600 group-hover:text-gray-900 transition">Remember me</span>
                                </label>
                                <Link to={'/forget'} className="text-blue-600 hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Button */}
                            {loading ? (
                                <div className="mt-6 flex justify-center gap-2 text-white w-full bg-blue-600 items-center rounded-lg py-2.5">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authenticating...</span>
                                </div>
                            ) : (
                                <button type="submit" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-semibold shadow-lg shadow-blue-200 active:scale-[0.98]">
                                    Sign In
                                </button>
                            )}
                        </form>

                        {!location.pathname.includes('admin') && (
                            <p className="text-center text-sm text-gray-500 mt-4">
                                New here?{" "}
                                <Link to={'/signup'} className="text-blue-600 font-bold hover:underline">
                                    Create an account
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;