import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom'

const MatchesList = ({ matches, setMatchClicked, onChildMatchListChange, closeChat }) => {

  const [dogMatched, setDogMatched] = useState([])
  const [cookies] = useCookies(['cookie-user'])
  const matchedUserIds = matches.length > 0 ? matches.map(({ user_id }) => user_id) : [];
  const [matchListReady, setMatchListReady] = useState(false)
  const [responseMessages, setResponseMessages] = useState([])

  const userId = cookies.UserId
  let navigate = useNavigate()

  const getMatches = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/dogsMatches`, {
        params: { dogsIds: JSON.stringify(matchedUserIds) }
      })
      if (response.status === 200) {
        setDogMatched(response.data)
        setMatchListReady(true)
      }
    }
    catch (error) {
      navigate('/error');
    }
  }

  const sendDataToParent = () => {
    onChildMatchListChange(bothMatched);
  };

  const getResponseMessages = async () => {
    try {
      const messagesByDog = {};

      for (const dog of dogMatched) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/messages`,
          {
            params: {
              toUserId: dog.user_id,
              fromUserId: userId,
            }
          }
        );

        messagesByDog[dog.user_id] = response.data;
      }

      const updatedDogProfiles = dogMatched.map(dog => ({
        ...dog,
        messages: messagesByDog[dog.user_id] || []
      }));

      setDogMatched(updatedDogProfiles);
    } catch (err) {
      navigate('/error');
    }
  };

  const bothMatched = dogMatched.length > 0 ? dogMatched.filter(
    (dog) => dog.matches.filter((profile) => profile.user_id === userId).length > 0) : []


  useEffect(() => {
    if (bothMatched) {
      sendDataToParent();
      getResponseMessages()
    }
  }, [bothMatched.length, matchListReady]);

  useEffect(() => {
    if (!closeChat) {
      getMatches();
    }
    if (closeChat) {
      setMatchListReady(false)
    }
  }, [matches, closeChat]);

  return (
    <>{matchListReady &&
      <div className='matchesList'>
        {bothMatched.length > 0 ? bothMatched.map((el, index) => (
          <div key={index} style={{ marginLeft: "10px" }} onClick={() => setMatchClicked(el)}>
            <div className="imgContainer">
              {el.messages && !el.messages.every(message => message.read) && (
                <span className='bubble'>
                  {el.messages.filter(message => !message.read).length}
                </span>
              )}
              <img src={el.url} alt="profile-pics" />
            </div>
            <h3>{el.name}</h3>
          </div>
        )) :
          <h4 className='noSwipeYet gradientColor'>you have no match yet</h4>
        }
      </div>
    }
    </>
  )
}

export default MatchesList