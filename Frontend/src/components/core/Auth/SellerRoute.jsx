import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const SellerRoute = () => {
    const { token, role } = useSelector(state => state.auth);
    
    if (!token) {
        return <Navigate to="/seller-login" />;
    }

    if (role !== "seller") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default SellerRoute;