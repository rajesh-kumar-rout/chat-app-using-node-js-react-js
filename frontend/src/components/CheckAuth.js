import { Navigate, Outlet } from "react-router-dom"

export default function CheckAuth({ required }) {
    if (required) {
        return localStorage.getItem("jwtToken") ? <Outlet /> : <Navigate to="/login" replace />
    } else {
        return localStorage.getItem("jwtToken") ? <Navigate to="/" replace /> : <Outlet/>
    }
}