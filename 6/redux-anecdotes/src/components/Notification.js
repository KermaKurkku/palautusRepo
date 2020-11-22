import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  console.log('notification', notification)
  return (
    <div>
      {
        notification === null ? null
          : <div style={style}>
              {notification}
            </div>
      }
    </div>
  )
}

export default Notification