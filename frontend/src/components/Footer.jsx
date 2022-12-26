import { MY_IMG_URL } from "../utils/constants"

export default function Footer() {
    return (
        <footer className="page-footer">
            <img src={MY_IMG_URL} className="my-img"/>
            <p>Designed and Devloped by Rajesh Rout</p>
        </footer>
    )
}