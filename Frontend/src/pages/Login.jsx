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

    return (
        /* 
           FIX: We use min-h-[calc(100vh-64px)] to account for the 64px (h-16) Navbar spacer.
           This prevents unnecessary scrolling and keeps the card perfectly centered in the remaining space.
        */
        <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 overflow-hidden px-4">
            
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
                <div className="absolute inset-0 bg-slate-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* --- Card Container --- */}
            <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Login</h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Welcome back! Please enter your details
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="relative block">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...register("email", { required: "Email is required" })}
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none transition bg-white
                                    ${errors.email ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                            />
                        </label>
                        {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="relative block">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...register("password", { required: "Password is required" })}
                                type="password"                                 placeholder="Enter your password"
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition bg-white
                                    ${errors.password ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                            />
                        </label>
                        {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="accent-blue-600 h-4 w-4" />
                            <span className="text-gray-600 group-hover:text-gray-900 transition">Remember me</span>
                        </label>
                        <Link to={'/forget'} className="text-blue-600 hover:underline font-medium">
                            Forgot password?
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center gap-2 text-white w-full bg-blue-600 items-center rounded-lg py-2.5">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Authenticating...</span>
                        </div>
                    ) : (
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-semibold shadow-lg shadow-blue-100 active:scale-[0.98]"
                        >
                            Sign In
                        </button>
                    )}
                </form>

                {!location.pathname.includes('admin') && (
                    <p className="text-center text-sm text-gray-500 mt-8">
                        New here?{" "}
                        <Link to={'/signup'} className="text-blue-600 font-bold hover:underline">
                            Create an account
                        </Link>
                    </p>
                )}
            </div>
        </div>

    );
}

export default Login;