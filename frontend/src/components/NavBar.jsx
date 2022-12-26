import { useContext, useState } from "react"
import { MdArrowDropDown } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { AccountContext } from "./Account"

export default function NavBar() {
    const { account } = useContext(AccountContext)
    const navigate = useNavigate()
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)

    window.onclick = () => {
        isDropDownOpen && setIsDropDownOpen(false)
    }

    const handleDropDown = (event) => {
        event.stopPropagation()
        setIsDropDownOpen(true)
    }

    const handleLogout = (event) => {
        event.preventDefault()
        localStorage.removeItem("jwtToken")
        navigate("/login", { replace: true })
    }

    return (
        <div className="navbar">
            <Link to="/" className="title">CHAT.IO</Link>

            <div className="dropdown-wrapper">
                <div className="dropdown-btn" onClick={handleDropDown}>
                    <p className="username">{account.name}</p>
                    <img className="profile-img" src={account.profileImgUrl ?? DEFAULT_PROFILE_IMG} />
                    <MdArrowDropDown size={24} />
                </div>

                {isDropDownOpen && (
                    <div className="dropdown">
                        <Link className="nav-link" to="/edit-account">Edit Account</Link>
                        <Link className="nav-link" to="/change-password">Change Password</Link>
                        <Link className="nav-link" onClick={handleLogout}>Logout</Link>
                    </div>
                )}
            </div>
        </div>
    )
}