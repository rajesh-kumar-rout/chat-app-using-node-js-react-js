import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"

export default function useRequest() {
    const navigate = useNavigate()

    return async (url, options) => {
        if (!options) {
            options = {}
        }

        if (!options.headers) {
            options.headers = {}
        }

        if (options.body && !(options.body instanceof FormData)) {
            options.headers = {
                ...options.headers,
                "Content-Type": "application/json"
            }
            options = {
                ...options,
                body: JSON.stringify(options.body)
            }
        }

        if (localStorage.getItem("jwtToken")) {
            options.headers = {
                ...options.headers,
                authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }

        try {
            const response = await fetch(BASE_URL.concat(url), options)
            if (response.status === 401) {
                localStorage.clear()
                navigate("/login", { replace: true })
            } else if (response.status === 500) {
                navigate("/error/Sorry, an unknown error occur", { replace: true })
            } else {
                return response
            }
        } catch {
            let error = window.navigator.onLine ?
                "Sorry, can not connect to server" :
                "Please check your network condition"

            navigate(`/error/${error}`, { replace: true })
        }
    }
}