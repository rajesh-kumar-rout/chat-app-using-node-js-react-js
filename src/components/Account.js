import { createContext, useContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { CLIENT_ERROR, SERVER_ERROR } from "../utils/constants"
import useRequest from "../hooks/useRequest"

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
                setError(SERVER_ERROR)
            }
        } catch {
            setError(CLIENT_ERROR)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAccount()
    }, [])

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>{error}</p>
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