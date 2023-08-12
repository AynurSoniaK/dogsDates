import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom'

const MatchesList = ({ matches, setMatchClicked, onChildMatchListChange, matchlistData, setMatchlistData  }) => {

  const [dogMatched, setDogMatched] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-user'])
  const matchedUserIds = matches.length > 0 ? matches.map(({ user_id }) => user_id) : [];
  const userId = cookies.UserId
  let navigate = useNavigate()

  const getMatches = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/dogsMatches`, {
        params: { dogsIds: JSON.stringify(matchedUserIds) }
      })
      setDogMatched(response.data)
    }
    catch (error) {
      navigate('/error');
    }
  }

  const sendDataToParent = () => {
    onChildMatchListChange(bothMatched);
  };

  const bothMatched = dogMatched.length > 0 ? dogMatched.filter(
    (dog) => dog.matches.filter((profile) => profile.user_id == userId).length > 0) : []

    useEffect(() => {
      getMatches();
    }, [matches]);
    
    useEffect(() => {
      sendDataToParent(); 
    }, [bothMatched.length]);
    

  return (
    <div className='matchesList'>
      {bothMatched.length > 0 ? bothMatched.map((el, index) => (
        <div key={index} style={{ marginLeft: "10px" }} onClick={() => setMatchClicked(el)}>
          <div className="imgContainer">
            <img src={el.url} alt="profile-pics" />
          </div>
          <h3>{el.name}</h3>
        </div>
      )) :
        <h4 className='noSwipeYet gradientColor'>you have no match yet</h4>
      }
    </div>
  )
}

export default MatchesList