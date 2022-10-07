import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
    if (localStorage.getItem("jwtToken")) {
        return <Outlet />
    } else {
        return <Navigate to="/login" replace={true} />
    }
}