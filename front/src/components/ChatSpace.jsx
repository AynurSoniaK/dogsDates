import React from 'react'

const ChatSpace = ({ orderedMessages, user }) => {

  return (
    <div className='chatSpace'>
      {orderedMessages.length > 0 ? orderedMessages.map((msg, index) => {
        return (
          <div className={user.name !== msg.name ? 'chatItemPositionReverse' : 'chatItemPosition'} key={index}>
            <div className='chatHeader'>
              <div className='imgContainer'>
                <img src={msg.url} alt={`${msg.name} profile`} />
              </div>
            </div>
            <p>{msg.message}</p>
          </div>
        )
      }) :
        <h4 className='noSwipeYet gradientColor'>Start a conversation ...</h4>
      }
    </div>
  )
}

export default ChatSpace