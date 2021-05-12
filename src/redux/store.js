import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import logger from 'redux-logger'
import { routerMiddleware } from 'connected-react-router'
import history from '../history'

const enhancer = applyMiddleware(thunk, logger, routerMiddleware(history))
const store = createStore(reducer, enhancer)

window.store = store.getState()

export default store
