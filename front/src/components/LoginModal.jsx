import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const LoginModal = ({ setShowModal, signUp }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-user']);

    let navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (signUp && (password !== confirmPassword)) {
                setError("Passwords doesn't match !")
            }
            const response = await axios.post(`${process.env.REACT_APP_API_URL}${signUp ? "signup" : "signin"}`, { email, password });

            const success = response.status === 201 || response.status === 204
            setCookie("UserId", response.data.user_id)
            setCookie("Token", response.data.userToken)
            if (success && !signUp) {
                navigate("/dashboard")
            }
            if (success && signUp) {
                navigate("/profile")
            }
            window.location.reload()
        }
        catch (error) {
            if (error.response.status === 400) {
                setError("Identifiants incorrects !")
            }
            else {
                navigate('/error'); 
            }
        }
    }

    return (
        <>
            <div className='loginModalContainer'>
                <div className='loginModalElement'>
                    <div className="crossIcon" onClick={handleClick}>&#10005;</div>
                    <h2>{signUp ? "CREATE ACCOUNT" : "SIGN IN"}</h2>
                    <p>By clicking Log In, you agree to our terms.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder='email'
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder='password'
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {signUp && <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder='confirmPassword'
                            required={true}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />}
                        <input
                            type="submit"
                            className='secondaryButton'
                            value="Connect"
                        />
                        <p style={{ textDecoration: "underline" }}>Need help to connect ?</p>
                        {error.length > 1 &&
                            <p style={{ color: "red" }}>{error}</p>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginModal