import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const SellerRoute = () => {
    const { token, role } = useSelector(state => state.auth);

    if (!token) {
        return <Navigate to="/admin-login" />;
    }

    if (role !== "admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default SellerRoute;