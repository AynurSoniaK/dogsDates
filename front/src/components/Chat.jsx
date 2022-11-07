import React, { useState, useEffect } from 'react'
import ChatBox from './ChatBox'
import ChatHeader from './ChatHeader'
import MatchesList from './MatchesList'

const Chat = ({ user }) => {
    const [matchClicked, setMatchClicked] = useState("")

    return (
        <div className="chatContainer">
            <ChatHeader user={user} />
            <div>
                <button className='choice' onClick={() => setMatchClicked(null)}>Matches</button>
                <button className='choice' disabled={!matchClicked}>Chat</button>
            </div>
            {!matchClicked && <MatchesList matches={user.matches} setMatchClicked={setMatchClicked} />} 
            {matchClicked && <ChatBox user={user} matchClicked={matchClicked} />}
        </div>
    )
}

export default Chat