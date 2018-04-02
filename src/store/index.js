import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import user from './reducers/user'

const appReducers = combineReducers({
  user
})

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const store = createStore(
  appReducers,
  /* preloadedState, */
  composeEnhancers(applyMiddleware())
)

export default store
