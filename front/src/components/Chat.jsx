import React, { useState, useEffect } from 'react'
import ChatBox from './ChatBox'
import MatchesList from './MatchesList'

const Chat = ({ user, setMatchClickedChat }) => {
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
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [childMatchList.length]);

    useEffect(() => {
        if (matchClicked !== null) {
            setMatchClickedChat(matchClicked)
        }
    }, [matchClicked]);

    return (
        <div className="chatContainer">
            <div>
                <button className={animNewMatch ? 'choice highlight' : 'choice'} onClick={() => setMatchClicked(null)}>Matches ({childMatchList.length})</button>
                <button className='choice' disabled={!matchClicked}>Chat</button>
            </div>
            {!matchClicked && <MatchesList matches={user.matches} setMatchClicked={setMatchClicked} onChildMatchListChange={handleChildMatchList}/>}
            {matchClicked && <ChatBox user={user} matchClicked={matchClicked} />}
        </div>
    )
}

export default Chat