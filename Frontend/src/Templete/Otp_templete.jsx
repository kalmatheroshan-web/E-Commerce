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


    //  Timer
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
    //  Handle OTP input
    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // auto focus next
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    // Submit
    function onSubmit() {
        const finalOtp = otp.join("");
        if (purpose == 'verify')
            dispatch(verify_otp(email, finalOtp, navigate));
        else if (purpose == 'forget')
            dispatch(verify_forgetOtp(email, finalOtp, navigate));

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* Title */}
                <h2 className="text-3xl font-semibold text-center mb-2">
                    Verify User
                </h2>

                {/* Email */}
                <p className="text-center text-gray-500 text-sm mb-4">
                    Enter the code sent to <br />
                    <span className="font-medium text-gray-700">
                        {email?.slice(0, 3) + "*******@gmail.com"}
                    </span>
                </p>

                {/* Timer */}
                <p className="text-center text-sm mb-6">
                    Expires in{" "}
                    <span className="font-semibold text-blue-600">
                        {formatTime(timeLeft)}
                    </span>
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={timeLeft === 0}
                    className={`w-full py-2 rounded-lg text-white font-medium transition
                            ${timeLeft === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        }`}
                >
                    Verify OTP
                </button>

                {/* Resend */}
                <div className="text-center mt-4">
                    <button
                        disabled={timeLeft > 0}
                        onClick={() => { setTimeLeft(300), (sendOtp(email)) }}

                        className={`text-sm transition
                                ${timeLeft > 0
                                ? "text-gray-400"
                                : "text-blue-600 hover:underline cursor-pointer"
                            }`}
                    >
                        Resend OTP
                    </button>
                </div>

            </div>
        </div >
    )
}
