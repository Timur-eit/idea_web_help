import {createSelector} from 'reselect'
import data from '../data/HelpTOC.json'

/**
 * Constants
 * */

export const moduleName = 'pages'
const prefix = moduleName

export const INIT_PAGE_LIST = `${prefix}/INIT_PAGE_LIST`
export const SET_ACTIVE_PAGE = `${prefix}/SET_ACTIVE_PAGE`

/**
 * Reducer
 * */

export const ReducerRecord = {
  pageList: data,
  activePage: null
}

export default function reducer(state = ReducerRecord, action) {
  const {type, payload} = action

  switch (type) {
    case INIT_PAGE_LIST:
      return Object.assign({}, state, {
        pageList: payload
      })
    case SET_ACTIVE_PAGE:
      return Object.assign({}, state, {
        activePage: payload
      })
    default:
      return state
  }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName]
export const pageListSelector = createSelector(stateSelector, state => state.pageList)
export const activePageSelector = createSelector(stateSelector, state => state.activePage)


/**
 * Action Creator
 * */

export const setActivePage = pageId => ({
  type: SET_ACTIVE_PAGE,
  payload: pageId
})
