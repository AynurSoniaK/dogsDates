import React, { useState, useEffect } from 'react'
import ChatBox from './ChatBox'
import MatchesList from './MatchesList'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Chat = ({ user, setUser, setMatchClickedChat, closeChat, setCloseChat }) => {
    const [matchClicked, setMatchClicked] = useState("")
    const [childMatchList, setChildMatchList] = useState([]);
    const [animNewMatch, setAnimNewMatch] = useState(false);

    const navigate = useNavigate();

    const handleChildMatchList = (matchList) => {
        setChildMatchList(matchList);
        setCloseChat(false)
    };

    const updateUser = async () => {
        const user_id = user.user_id
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, { params: { user_id } })
            setUser(response.data)
            setMatchClicked("")
        }
        catch (err) {
            navigate('/error');
        }
    }

    const CHAT_ANIMATION_DURATION = 2000;

    //close the chat to see the list of matches
    useEffect(() => {
        if (closeChat) {
            updateUser()
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
            }, CHAT_ANIMATION_DURATION);
            return () => clearTimeout(timer);
        }
    }, [childMatchList.length]);

    return (
        <div className="chatContainer">
            <div>
                <button
                    className={animNewMatch ? 'choice highlight' : 'choice'}
                    disabled={childMatchList.length === 0 || matchClicked}
                >
                    {childMatchList.length > 0 ? childMatchList.length : ""} Matches
                </button>
                <button className='choice' disabled={!matchClicked}>  {matchClicked ? `Chat with ${matchClicked.name}` : 'Chat'}
                </button>
            </div>
            {!matchClicked && <MatchesList setCloseChat={setCloseChat} closeChat={closeChat} matches={user.matches} setMatchClicked={setMatchClicked} onChildMatchListChange={handleChildMatchList} />}
            {matchClicked && <ChatBox user={user} matchClicked={matchClicked} />}
        </div>
    )
}

export default Chat