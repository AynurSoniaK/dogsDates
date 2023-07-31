import React from 'react'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { Link } from "react-router-dom"

const ChatHeader = ({ user }) => {

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-user'])
  const [modalMenu, setModalMenu] = useState(false)

  const logout = () => {
    removeCookie('UserId')
    removeCookie('Token')
  }


  return (
    <div className="chatHeaderContainer">
      <svg className="logoHeader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 208C288 216.8 280.8 224 272 224C263.2 224 255.1 216.8 255.1 208C255.1 199.2 263.2 192 272 192C280.8 192 288 199.2 288 208zM256.3-.0068C261.9-.0507 267.3 1.386 272.1 4.066L476.5 90.53C487.7 95.27 495.2 105.1 495.9 118.1C501.6 213.6 466.7 421.9 272.5 507.7C267.6 510.5 261.1 512.1 256.3 512C250.5 512.1 244.9 510.5 239.1 507.7C45.8 421.9 10.95 213.6 16.57 118.1C17.28 105.1 24.83 95.27 36.04 90.53L240.4 4.066C245.2 1.386 250.7-.0507 256.3-.0068H256.3zM160.9 286.2L143.1 320L272 384V320H320C364.2 320 400 284.2 400 240V208C400 199.2 392.8 192 384 192H320L312.8 177.7C307.4 166.8 296.3 160 284.2 160H239.1V224C239.1 259.3 211.3 288 175.1 288C170.8 288 165.7 287.4 160.9 286.2H160.9zM143.1 176V224C143.1 241.7 158.3 256 175.1 256C193.7 256 207.1 241.7 207.1 224V160H159.1C151.2 160 143.1 167.2 143.1 176z" /></svg>
      <h3>DogsDates</h3>
      <div className="profile">
        <div className="imgContainer">
          <img src={user.url ? user.url : "https://images.pexels.com/photos/825947/pexels-photo-825947.jpeg?auto=compress&cs=tinysrgb&w=1600"} alt="profile" />
        </div>
        {!modalMenu && <h3>{user.name}</h3>}
        <div className='iconPlusMenu'>
          <div className='logoutIcon'>
            {
              modalMenu ?
                <>
                  <svg onClick={() => setModalMenu(!modalMenu)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM184 232H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                  </svg>
                  <div className='fade-in'>
                    <Link to={"/profile"} >Profile</Link>
                    <Link onClick={logout} to={"/"} >Logout</Link>
                  </div>
                </>
                :
                <svg onClick={() => setModalMenu(!modalMenu)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                </svg>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader