import { Navigate, Outlet } from "react-router-dom"

export default function Authenticae() {
    return localStorage.getItem("jwtToken") ? <Outlet /> : <Navigate to="/login" replace />
}