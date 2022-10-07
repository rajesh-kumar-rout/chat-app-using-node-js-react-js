import { useState } from "react"
import { MdSearch, MdAccountCircle } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import styles from "./NavBar.module.css"

export default function NavBar() {
    const navigate = useNavigate()
    const [showDropDown, setShowDropDown] = useState(false)

    window.onclick = () => {
        showDropDown && setShowDropDown(false)
    }

    const onAccountBtnClick = (e) => {
        e.stopPropagation()
        setShowDropDown(true)
    }

    const handleLogout = () => {
        localStorage.clear()
        navigate("/login", { replace: true })
    }

    return (
        <div className={styles.navbar}>
            <Link to="/" className={styles.title}>CHAT.IO</Link>

            <div className={styles.icons}>
                <Link to="/rooms">
                    <MdSearch size={32} className={styles.icon} />
                </Link>

                <div className={styles.dropDownWrapper}>
                    <MdAccountCircle
                        id="search"
                        className={styles.icon}
                        onClick={onAccountBtnClick}
                        size={32}
                    />

                    {showDropDown && (
                        <div className={styles.dropDown}>
                            <Link to="/create-group" className={styles.dropDownItem}>Create New Group</Link>
                            <Link to="/edit-account" className={styles.dropDownItem}>Edit Account</Link>
                            <Link to="/change-password" className={styles.dropDownItem}>Change Password</Link>
                            <div onClick={handleLogout} to="/edit-profile" className={styles.dropDownItem}>Logout</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}