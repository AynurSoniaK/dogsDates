import React, { useState } from 'react'
import ChatSpace from './ChatSpace'
import InputChat from './InputChat'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClipLoader from "react-spinners/ClipLoader"

const ChatBox = ({ user, matchClicked }) => {

  const [userMessages, setUserMessages] = useState([])
  const [responseMessages, setResponseMessages] = useState([])
  const [loadingUserMessages, setLoadingUserMessages] = useState(true)
  const [loadingResponseMessages, setLoadingResponseMessages] = useState(true)

  let navigate = useNavigate()

  const getMyMessages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/messages`,
        {
          params: {
            fromUserId: user.user_id, toUserId: matchClicked.user_id
          }
        }
      )
      setUserMessages(response.data)
      setLoadingUserMessages(false)
    }
    catch (err) {
      navigate('/error');
    }
  }

  const getResponseMessages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/messages`,
        {
          params: {
            fromUserId: matchClicked.user_id, toUserId: user.user_id
          }
        }
      )
      setResponseMessages(response.data)
      setLoadingResponseMessages(false)
    }
    catch (err) {
      navigate('/error');
    }
  }

  useEffect(() => {
    getMyMessages()
    getResponseMessages()
  }, [])

  const messagesFullData = [];
  userMessages?.map(message => {
    const msg = {}
    msg['name'] = user?.name
    msg['url'] = user?.url
    msg['message'] = message.message
    msg['date'] = message.timestamps
    messagesFullData.push(msg)
  })

  responseMessages?.map(message => {
    const msg = {}
    msg['name'] = matchClicked?.name
    msg['url'] = matchClicked?.url
    msg['message'] = message.message
    msg['date'] = message.timestamps
    messagesFullData.push(msg)
  })

  const orderedMessages = messagesFullData?.sort((a, b) => a.timestamps - b.timestamps)

  return (
    <>
      {loadingResponseMessages && loadingUserMessages ? (
        <div className='loadingMsg'>
          <span>Loading messages</span>
          <ClipLoader
            color="grey"
            loading={user}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <ChatSpace user={user} orderedMessages={orderedMessages} />
          <InputChat user={user} matchClicked={matchClicked} getMyMessages={getMyMessages} getResponseMessages={getResponseMessages} />
        </>
      )}
    </>
  );
}

export default ChatBox