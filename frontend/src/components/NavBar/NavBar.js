import { useContext, useState } from "react"
import { MdArrowDropDown } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../../utils/constants"
import { AccountContext } from "../Account"
import styles from "./NavBar.module.css"

export default function NavBar() {
    const { account } = useContext(AccountContext)
    const navigate = useNavigate()
    const [showDropDown, setShowDropDown] = useState(false)

    window.onclick = () => {
        showDropDown && setShowDropDown(false)
    }

    const handleAccountClick = (e) => {
        e.stopPropagation()
        setShowDropDown(true)
    }

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.clear()
        navigate("/login", { replace: true })
    }

    return (
        <div className={styles.container}>
            <Link to="/" className={styles.title}>CHAT.IO</Link>

            <div className={styles.dropDownWrapper}>
                <div className={styles.dropDownBtn} onClick={handleAccountClick}>
                    <p>{account.name}</p>
                    <img src={account.profileImgUrl ?? DEFAULT_PROFILE_IMG} />
                    <MdArrowDropDown size={24} />
                </div>

                {showDropDown && (
                    <div className={styles.dropDown}>
                        <Link to="/edit-account">Edit Account</Link>
                        <Link to="/change-password">Change Password</Link>
                        <Link onClick={handleLogout}>Logout</Link>
                    </div>
                )}
            </div>
        </div>
    )
}