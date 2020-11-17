import React from 'react'

const Notification = ({ message, type }) => {
  return message === null
    ? null
    : <div className={type}>
      {message}
    </div>
}

export default Notification