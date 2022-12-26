import { Navigate, Outlet } from "react-router-dom"

export default function NotAuthenticate() {
    return localStorage.getItem("jwtToken") ? <Navigate to="/" replace /> : <Outlet />
}