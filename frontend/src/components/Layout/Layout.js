import { Outlet } from "react-router-dom"
import Footer from "../Footer/Footer"
import NavBar from "../NavBar/NavBar"
import styles from "./Layout.module.css"

export default function Layout() {
    return (
        <div>
            <NavBar/>
            <div className={styles.container}>
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}