import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "react-toastify/dist/ReactToastify.css"
import "./index.scss"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </>
)