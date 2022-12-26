import axios from "axios"
import { BASE_URL } from "./constants"

const instance = axios.create({
    baseURL: BASE_URL
})

instance.interceptors.request.use(config => {
    if(localStorage.getItem("jwtToken")) {
        config.headers.authorization = `Bearer ${localStorage.getItem("jwtToken")}`
    }

    return config
})

export default instance