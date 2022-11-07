import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCookies } from "react-cookie"

const MatchesList = ({ matches, setMatchClicked }) => {

  const [dogMatched, setDogMatched] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-user'])
  const matchedUserIds = matches.map(({ user_id }) => user_id)
  const userId = cookies.UserId

  const getMatches = async () => {
    try {
      const response = await axios.get("http://localhost:8000/dogsMatches", {
        params: { dogsIds: JSON.stringify(matchedUserIds) }
      })
      setDogMatched(response.data)
    }
    catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }
  }

  useEffect(() => {
    getMatches()
  }, [])

  const bothMatched = dogMatched?.filter(
    (dog) => dog.matches.filter((profile) => profile.user_id == userId).length > 0)

  return (
    <div className='matchesList'>
      {bothMatched?.map((el, index) => (
        <div key={index} style={{marginLeft:"10px"}} onClick={ () => setMatchClicked(el)}>
          <div className="imgContainer">
            <img src={el.url} alt="profile-pics" />
          </div>
          <h3>{el.name}</h3>
        </div>
      ))}
    </div>
  )
}

export default MatchesList