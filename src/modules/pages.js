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
  activePages: []
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
        activePages: payload
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
export const topLevelIdsSelector = createSelector(stateSelector, state => (state.pageList && state.pageList.topLevelIds) || [])
export const activePagesSelector = createSelector(stateSelector, state => state.activePages)

/**
 * Action Creator
 * */

//  export const setActivePage = pageId => ({
//   type: SET_ACTIVE_PAGE,
//   payload: pageId
// })

export function setActivePage(pageId) {
  return (dispatch, getState) => {
    const activePages = activePagesSelector(getState())
    const newActivePages = [...activePages].includes(pageId) ? [...activePages].filter(f => f !== pageId) : [...activePages, pageId]

    dispatch ({
      type: SET_ACTIVE_PAGE,
      payload: newActivePages
    })
  }
}
