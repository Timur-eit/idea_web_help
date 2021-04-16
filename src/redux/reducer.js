import {combineReducers} from 'redux'
import pagesReducer, {moduleName as pageModule} from "../modules/pages"
import {connectRouter} from "connected-react-router"
import history from '../history'

export default combineReducers({
  router: connectRouter(history),
  [pageModule]: pagesReducer
})