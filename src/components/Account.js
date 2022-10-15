import { createContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { CLIENT_ERROR, SERVER_ERROR } from "../utils/constants"
import useRequest from "../hooks/useRequest"
import Loader from "./Loader/Loader"

export const AccountContext = createContext()

export default function Account() {
    const request = useRequest()
    const [isLoading, setIsLoading] = useState(true)
    const [account, setAccount] = useState({})
    const [error, setError] = useState("")

    const fetchAccount = async () => {
        setIsLoading(true)
        try {
            const response = await request("/auth/account")
            if (response.status === 200) {
                setAccount(await response.json())
            } else {
                alert(SERVER_ERROR)
            }
        } catch {
            alert(CLIENT_ERROR)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAccount()
    }, [])

    if (isLoading) {
        return <Loader />
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