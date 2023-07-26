import React, { useState } from "react"
import Navbar from '../components/Navbar'
import LoginModal from "../components/LoginModal"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-user'])

    const logged = cookies.Token
    const [signUp, setSignUp] = useState(true)
    const [showModal, setShowModal] = useState(false)
    
    const navigate = useNavigate();


    const handleClick = () => {
        if (logged) {
            removeCookie('UserId')
            removeCookie('Token')
            window.location.reload()
            return
        }
        setShowModal(true)
        setSignUp(true)
    }

    const handleClickEnter = () => {
        navigate('/dashboard');
      };

    return (
        <div className={showModal ? "homeContainerOpacity" : "homeContainer"}>
            <Navbar 
                logged={logged} 
                showModal={showModal} 
                setShowModal={setShowModal} 
                setSignUp={setSignUp}
                />
            <div className='home'>
                <h1>{!showModal ? "DogsDates" : ""}</h1>
                {logged ?
                <button className='primaryButton' onClick={handleClickEnter}>
                    entrer
                </button> :
                <button className='primaryButton' onClick={handleClick}>
                    {logged ? "se connecter" : "s'inscrire"}
                </button>}
            </div>
            {showModal && !logged && <LoginModal showModal={showModal} setShowModal={setShowModal} signUp={signUp} />}
        </div>
    )
}
export default Home;
