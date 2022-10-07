import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import RequireAuth from "./components/RequireAuth"
import RequireNotAuth from "./components/RequireNotAuth"
import SignUpPage from "./pages/SignUpPage/SignUpPae"
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage"
import ChatPage from "./pages/ChatPage/ChatPage"
import EditAccountPage from "./pages/EditAccountPage/EditAccountPage"
import HomePage from "./pages/HomePage/HomePage"
import LoginPage from "./pages/LoginPage/LoginPage"
import RoomMembersPage from "./pages/RoomMembersPage/RoomMembersPage"
import SearchRoomPage from "./pages/SearchRoomPage/SearchRoomPage"

export default function App() {
    return (
        <Routes>
            <Route element={<RequireAuth />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/rooms/:roomId/chat" element={<ChatPage />} />
                    <Route path="/rooms/:roomId/members" element={<RoomMembersPage />} />
                    <Route path="/rooms" element={<SearchRoomPage />} />
                    <Route path="/change-password" element={<ChangePasswordPage />} />
                    <Route path="/edit-account" element={<EditAccountPage />} />
                </Route>
            </Route>
            <Route element={<RequireNotAuth/>}>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/sign-up" element={<SignUpPage/>}/>
            </Route>
        </Routes>
    )
}