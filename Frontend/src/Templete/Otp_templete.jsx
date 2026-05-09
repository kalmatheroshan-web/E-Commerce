import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verify_forgetOtp, verify_otp } from '../Services/Operation/authApi';
import { useForm } from 'react-hook-form';

export default function Otp_templete({ email, purpose }) {
    const [timeLeft, setTimeLeft] = useState(300);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const { handleSubmit } = useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }

    // Handle OTP input
    const handleChange = (value, index) => {
        // Only allow numbers
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    function onSubmit() {
        const finalOtp = otp.join("");
        if (purpose === 'verify')
            dispatch(verify_otp(email, finalOtp, navigate));
        else if (purpose === 'forget')
            dispatch(verify_forgetOtp(email, finalOtp, navigate));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 px-4">
            <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl p-6 sm:p-10">

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
                    Verify User
                </h2>

                {/* Email Display */}
                <p className="text-center text-gray-500 text-sm mb-6 leading-relaxed">
                    Enter the code sent to <br />
                    <span className="font-medium text-indigo-600 break-all">
                        {email ? `${email.slice(0, 3)}*******@gmail.com` : "your email"}
                    </span>
                </p>

                {/* Timer Section */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <span className="text-gray-400 text-sm">Expires in</span>
                    <span className={`text-sm font-mono font-bold ${timeLeft < 60 ? "text-red-500" : "text-indigo-600"}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {/* OTP Inputs - Responsive Grid/Flex */}
                <div className="flex justify-between gap-2 sm:gap-3 mb-8">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric" // Forces numeric keypad on mobile
                            autoComplete="one-time-code"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-full h-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl
                                     focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none 
                                     transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={timeLeft === 0 || otp.includes("")}
                        className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all
                            ${timeLeft === 0 || otp.includes("")
                                ? "bg-gray-300 cursor-not-allowed shadow-none"
                                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200"
                            }`}
                    >
                        Verify OTP
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            disabled={timeLeft > 0}
                            onClick={() => {
                                setTimeLeft(300);
                                dispatch(sendOtp(email));
                            }}
                            className={`text-sm font-medium transition-colors
                                ${timeLeft > 0
                                    ? "text-gray-400"
                                    : "text-indigo-600 hover:text-indigo-800 cursor-pointer underline-offset-4 hover:underline"
                                }`}
                        >
                            Resend Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}