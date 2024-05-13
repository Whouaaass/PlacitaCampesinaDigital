import { FC, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

const PrivateRoute: FC = () => {
    const user = useAuth();
    useEffect(() => {
        user.verify();
    }, [user]);

    if (!user.token) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;