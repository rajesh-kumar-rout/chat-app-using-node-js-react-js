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

        options.headers = {
            Accept: "application/json"
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
            const res = await fetch(BASE_URL.concat(url), options)
            if (res.status === 401) {
                localStorage.clear()
                navigate("/login", { replace: true })
            } else if ((res.status >= 200 && res.status <= 299) || (res.status >= 400 && res.status <= 499)) {
                return {
                    status: res.status,
                    body: await res.json()
                }
            } else {
                navigate("/error/Sorry, an unknown error occur", { replace: true })
            }
        } catch {
            if (window.navigator.onLine) {
                navigate("/error/Sorry, can not connect to server", { replace: true })
            } else {
                navigate("/error/Please check your network condition", { replace: true })
            }
        }
    }
}