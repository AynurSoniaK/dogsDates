import React, { useState } from 'react'
import ChatSpace from './ChatSpace'
import InputChat from './InputChat'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ChatBox = ({ user, matchClicked }) => {

  const [userMessages, setUserMessages] = useState([])
  const [responseMessages, setResponseMessages] = useState([])

  let navigate = useNavigate()

  const getMyMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/messages",
        {
          params: {
            fromUserId: user.user_id, toUserId: matchClicked.user_id
          }
        }
      )
      setUserMessages(response.data)
    }
    catch (err) {
      navigate('/error');
    }
  }

  const getResponseMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/messages",
        {
          params: {
            fromUserId: matchClicked.user_id, toUserId: user.user_id
          }
        }
      )
      setResponseMessages(response.data)
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
      <ChatSpace user={user} orderedMessages={orderedMessages} />
      <InputChat user={user} matchClicked={matchClicked} getMyMessages={getMyMessages} getResponseMessages={getResponseMessages} />
    </>
  )
}

export default ChatBox