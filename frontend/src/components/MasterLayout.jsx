import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import NavBar from "./NavBar"

export default function MasterLayout() {
    return (
        <div>
            <NavBar/>
            <div className="page-layout">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}