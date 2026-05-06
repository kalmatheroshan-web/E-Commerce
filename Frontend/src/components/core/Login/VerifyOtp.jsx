import { useLocation } from "react-router-dom";
import Otp_templete from "../../../Templete/Otp_templete";

function VerifyOtp() {
    const location = useLocation(); 
    const email = location.state?.email;
    return (
        <Otp_templete
            email={email} purpose='verify'
        />

    )
}
export default VerifyOtp; 