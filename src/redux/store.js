import {createStore, applyMiddleware} from "redux"
import thunk from 'redux-thunk'
import reducer from './reducer'

const enhancer = applyMiddleware(thunk)
const store = createStore(reducer, enhancer)

window.store = store.getState()

export default store