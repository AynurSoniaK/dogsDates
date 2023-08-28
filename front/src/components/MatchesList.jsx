import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom'

const MatchesList = ({ matches, setMatchClicked, onChildMatchListChange }) => {

  const [dogMatched, setDogMatched] = useState([])
  const [cookies] = useCookies(['cookie-user'])
  const matchedUserIds = matches.length > 0 ? matches.map(({ user_id }) => user_id) : [];
  const [matchListReady, setMatchListReady] = useState(false)
  const [bothLiked, setBothLiked] = useState([])
  const [messagesSeenReady, setMessagesSeenReady] = useState(false)

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
      console.log(error)
      navigate('/error');
    }
  }

  const updateMsgSeen = async (el) => {
    setMatchClicked(el)
    const messageIds = el.messages?.map(message => message._id);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/updateMessages`,
        { messageIds }
      );
    } catch (error) {
      console.error('Error marking messages as read');
    }
  };

  const sendDataToParent = () => {
    onChildMatchListChange(bothLiked);
  };

  const getResponseMessages = async () => {
    try {
      const messagesByDog = {};

      for (const dog of dogMatched) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/messages`,
          {
            params: {
              toUserId: userId,
              fromUserId: dog.user_id
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
      setMessagesSeenReady(true)
    } catch (err) {
      navigate('/error');
    }
  };

  const deleteUserMatch = async (matchUserId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/deleteMatch`, {
        user_id: userId,
        matchUserId,
      });
      const newBothMatched = bothLiked.filter((dog) => dog.user_id !== matchUserId);
      setBothLiked(newBothMatched);
    } catch (error) {
      console.error("Error while deleting match", error);
    }
  };

  useEffect(() => {
    if (matchListReady) {
      getResponseMessages()
    }
  }, [matchListReady]);

  useEffect(() => {
    if (bothLiked) {
      sendDataToParent();
    }
  }, [bothLiked]);

  useEffect(() => {
    getMatches();
  }, [matches]);

  useEffect(() => {
    if (dogMatched.length > 0) {
      const matchedDogs = dogMatched.filter(dog =>
        dog.matches.some(profile => profile.user_id === userId)
      );
      setBothLiked(matchedDogs);
    }
  }, [dogMatched, userId]);

  return (
    <>{matchListReady &&
      <div className='matchesList'>
        {bothLiked.length > 0 ? bothLiked.map((el, index) => (
          <div className="dogProfilContainer" key={index} style={{ marginLeft: "10px" }}>
            {el.messages && !el.messages.every(message => message.read) && (
              <span className='bubble'>
                {el.messages.filter(message => !message.read).length}
              </span>
            )}
            <div className="imgContainer">
              { messagesSeenReady ? <img src={el.url} alt="profile-pics" onClick={() => updateMsgSeen(el)}/> : <img src={el.url} className="opacityImg" alt="profile-pics"/>}
            </div>
            <h3>{el.name}
              <svg className='trash' onClick={() => deleteUserMatch(el.user_id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" /></svg>
            </h3>
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