import { Link, useParams } from "react-router-dom"
import styles from "./ErrorPage.module.css"
import button from "../../styles/Button.module.css"

export default function ErrorPage() {
    const { error } = useParams()

    return (
        <div className={styles.container}>
            <p>{error}</p>
            <Link
                to="/"
                className={button.btn}
                data-primary
            >
                Back to application
            </Link>
        </div>
    )
}