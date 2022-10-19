import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import RequireAuth from "./components/RequireAuth"
import RequireNotAuth from "./components/RequireNotAuth"
import SignUpPage from "./pages/SignUpPage/SignUpPage"
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage"
import ChatPage from "./pages/ChatPage/ChatPage"
import EditAccountPage from "./pages/EditAccountPage/EditAccountPage"
import HomePage from "./pages/HomePage/HomePage"
import LoginPage from "./pages/LoginPage/LoginPage"
import Account from "./components/Account"
import { createContext } from "react"
import { io } from "socket.io-client"
import ErrorPage from "./pages/ErrorPage/ErrorPage"

const socket = io("ws://localhost:3001")
export const SocketContext = createContext()

export default function App() {
    return (
        <SocketContext.Provider
            value={{
                socket
            }}
        >
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route element={<Account />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/rooms/chat" element={<ChatPage />} />
                            <Route path="/change-password" element={<ChangePasswordPage />} />
                            <Route path="/edit-account" element={<EditAccountPage />} />
                        </Route>
                    </Route>
                </Route>
                <Route element={<RequireNotAuth />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                </Route>
                <Route path="/error/:error" element={<ErrorPage/>}/>
            </Routes>
        </SocketContext.Provider>
    )
}