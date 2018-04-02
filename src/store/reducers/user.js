const defaultState = {
  id: null
}

const user = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        ...action.user
      }
    default:
      return state
  }
}

export default user
