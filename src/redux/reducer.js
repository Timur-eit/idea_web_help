import {combineReducers} from 'redux'
import pagesReducer, {moduleName as pageModule} from "../modules/pages"

export default combineReducers({
  [pageModule]: pagesReducer
})