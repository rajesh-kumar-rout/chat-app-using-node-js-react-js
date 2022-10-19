import styles from "./Loader.module.css"

export default function Loader({ full }) {
    return (
        <div data-full={full} className={styles.container}>
            <div className={styles.loader}></div>
        </div>
    )
}