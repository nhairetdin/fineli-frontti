import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from '../rdc/reducer'

// this file creates and exports a redux store-object and applies a thunk middleware
// for async behaviour, it is needed if we want to async dispatches
const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store
