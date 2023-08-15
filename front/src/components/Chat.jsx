import React, { useState, useEffect } from 'react'
import ChatBox from './ChatBox'
import MatchesList from './MatchesList'

const Chat = ({ user, setMatchClickedChat, closeChat, setCloseChat }) => {
    const [matchClicked, setMatchClicked] = useState("")
    const [childMatchList, setChildMatchList] = useState([]);
    const [animNewMatch, setAnimNewMatch] = useState(false);

    const handleChildMatchList = (matchList) => {
        setChildMatchList(matchList);
        setCloseChat(false)
    };

    //close the chat to see the list of matches
    useEffect(() => {
        if (closeChat) {
            setMatchClicked("")
        }
    }, [closeChat]);

    //get the number of matches
    useEffect(() => {
        if (matchClicked !== null) {
            setMatchClickedChat(matchClicked)
        }
    }, [matchClicked]);

    //anim color Matches
    useEffect(() => {
        if (childMatchList.length > 0) {
            setAnimNewMatch(true)
            const timer = setTimeout(() => {
                setAnimNewMatch(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [childMatchList.length]);

    return (
        <div className="chatContainer">
            <div>
                <button className={animNewMatch ? 'choice highlight' : 'choice'} onClick={() => setMatchClicked("")}>Matches ({childMatchList.length})</button>
                <button className='choice' disabled={!matchClicked}>  {matchClicked ? `Chat with ${matchClicked.name}` : 'Chat'}
                </button>
            </div>
            {!matchClicked && <MatchesList setCloseChat={setCloseChat} closeChat={closeChat} matches={user.matches} setMatchClicked={setMatchClicked} onChildMatchListChange={handleChildMatchList} />}
            {matchClicked && <ChatBox user={user} matchClicked={matchClicked} />}
        </div>
    )
}

export default Chat