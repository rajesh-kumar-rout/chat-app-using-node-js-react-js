export default function Loader({ full }) {
    return (
        <div data-full={full} className="loader">
            <div className="spinner"></div>
        </div>
    )
}