import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { sendOtp_forget } from "../../../Services/Operation/authApi";
import { useNavigate } from "react-router-dom";

function ForgotEmail() {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onSubmit(data) {
        dispatch(sendOtp_forget(data.email, navigate));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4">

            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

                {/* Heading */}
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    Forgot Password
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Enter your email to receive an OTP
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            {...register("email", { required: true })}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition duration-200 shadow-md"
                    >
                        Send OTP
                    </button>
                </form>

                {/* Footer */}
                <p className="text-xs text-gray-400 text-center mt-6">
                    We'll send a verification code to your email
                </p>
            </div>
        </div>
    );
}

export default ForgotEmail;