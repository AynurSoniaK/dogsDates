import React, { useState, useEffect } from 'react'
import ChatBox from './ChatBox'
import ChatHeader from './ChatHeader'
import MatchesList from './MatchesList'

const Chat = ({ user }) => {
    const [matchClicked, setMatchClicked] = useState("")
    const [childMatchList, setChildMatchList] = useState([]);
    const [animNewMatch, setAnimNewMatch] = useState(false);

    const handleChildMatchList = (matchList) => {
        setChildMatchList(matchList);
    };

    useEffect(() => {
        if (childMatchList.length > 0) {
            setAnimNewMatch(true)
            const timer = setTimeout(() => {
                setAnimNewMatch(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [childMatchList.length]);

    console.log(animNewMatch)

    return (
        <div className="chatContainer">
            {/* <ChatHeader user={user} /> */}
            <div>
                <button className={animNewMatch ? 'choice highlight' : 'choice'} onClick={() => setMatchClicked(null)}>Matches ({childMatchList.length})</button>
                <button className='choice' disabled={!matchClicked}>Chat</button>
            </div>
            {!matchClicked && <MatchesList matches={user.matches} setMatchClicked={setMatchClicked} onChildDataChange={handleChildMatchList} />}
            {matchClicked && <ChatBox user={user} matchClicked={matchClicked} />}
        </div>
    )
}

export default Chat