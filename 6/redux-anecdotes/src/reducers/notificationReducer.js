let timeoutID

const notificationReducer = (state = null, action) => {
  switch(action.type) {
    case 'INFO':
      return action.content
    case 'EMPTY':
      return null
    default:
      return state
  }
}

export const removeNotification = () => {
  return {
    type: 'EMPTY'
  }
}

export const setNotification = (content, time) => {
  return async dispatch => {
    const sleepTime = time*1000
	console.log(sleepTime)
	clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      dispatch(removeNotification())
    }, sleepTime)
    dispatch({
      type: 'INFO',
      content
    })
  }
}

export default notificationReducer