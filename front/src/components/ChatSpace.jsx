import React from 'react'

const ChatSpace = ({ orderedMessages, user }) => {

  return (
    <div className='chatSpace'>
      {orderedMessages?.map((msg, index) => {
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
      })}
    </div>
  )
}

export default ChatSpace