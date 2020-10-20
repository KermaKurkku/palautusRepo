import React from 'react'

const Notification = ({message, type}) => {
    if ( message === null)
    {
        return null
    }
    console.log(message)
    return (
        <div className={type}>
            {message}
        </div>
    )
}

export default Notification