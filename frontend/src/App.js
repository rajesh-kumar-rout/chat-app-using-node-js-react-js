import { Routes, Route } from "react-router-dom"
import { createContext } from "react"
import { io } from "socket.io-client"
import { SOCKET_URL } from "./utils/constants"
import ChangePasswordPage from "./pages/ChangePasswordPage"
import ChatPage from "./pages/ChatPage"
import EditAccountPage from "./pages/EditAccountPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Account from "./components/Account"
import SignUpPage from "./pages/SignUpPage"
import NotAuthenticate from "./components/NotAuthenticate"
import Authenticae from "./components/Authenticate"
import MasterLayout from "./components/MasterLayout"

const socket = io(SOCKET_URL)

export const AppContext = createContext()

export default function App() {
    return (
        <AppContext.Provider
            value={{
                socket
            }}
        >
            <Routes>
                <Route element={<Authenticae/>}>
                    <Route element={<Account />}>
                        <Route element={<MasterLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/rooms/chat" element={<ChatPage />} />
                            <Route path="/change-password" element={<ChangePasswordPage />} />
                            <Route path="/edit-account" element={<EditAccountPage />} />
                        </Route>
                    </Route>
                </Route>
                <Route element={<NotAuthenticate/>}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/create-account" element={<SignUpPage />} />
                </Route>
            </Routes>
        </AppContext.Provider>
    )
}