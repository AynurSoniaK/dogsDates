import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const InputChat = ({ user, matchClicked, getResponseMessages, getMyMessages }) => {

    const [msgToSend, setMsgToSend] = useState("")
    let navigate = useNavigate()

    const addMessage = async () => {
        const message = {
            from: user.user_id,
            to: matchClicked.user_id,
            timestamps: new Date().toISOString(),
            message: msgToSend
        }

        try {
            const inputData = await axios.post(`${process.env.REACT_APP_API_URL}/addMessage`, { message })
            getMyMessages()
            getResponseMessages()
            setMsgToSend('')
        }
        catch (err) {
            navigate('/error'); 
        }
    }

    return (
        <div className='inputChat'>
            <textarea
                onChange={(e) => { setMsgToSend(e.target.value) }}
                value={msgToSend}>
            </textarea>
            <button className='secondaryButton .width' onClick={addMessage}>Envoyer</button>
        </div>
    )
}

export default InputChat