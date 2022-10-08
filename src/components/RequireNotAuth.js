import { Navigate, Outlet } from "react-router-dom";

export default function RequireNotAuth() {
    if (localStorage.getItem("jwtToken")) {
        return <Navigate to="/" replace={true} />
    } else {
        return <Outlet />
    }
}