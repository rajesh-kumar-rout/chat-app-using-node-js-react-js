import { createContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import axios from "../utils/axios"
import Loader from "./Loader"

export const AccountContext = createContext()

export default function Account() {
    const [isFetching, setIsFetching] = useState(true)
    const [account, setAccount] = useState({})

    const fetchAccount = async () => {
        const { data } = await axios.get("/auth/account")
        setAccount(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchAccount()
    }, [])

    if (isFetching) {
        return <Loader full/>
    }

    return (
        <AccountContext.Provider
            value={{
                account,
                setAccount
            }}
        >
            <Outlet />
        </AccountContext.Provider>
    )
}