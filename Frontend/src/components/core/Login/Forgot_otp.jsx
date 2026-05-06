import { useLocation } from "react-router-dom";
import Otp_templete from "../../../Templete/Otp_templete";

function Forgot_otp() {
    const location = useLocation();
    const email = location.state?.email;
    return (
        <Otp_templete email={email} purpose={"forget"} />
    )
}
export default Forgot_otp; 