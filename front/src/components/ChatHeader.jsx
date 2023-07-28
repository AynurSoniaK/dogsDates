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