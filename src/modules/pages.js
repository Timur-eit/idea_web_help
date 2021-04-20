import {createSelector} from 'reselect'
import data from '../data/HelpTOC.json'

/**
 * Constants
 * */

export const moduleName = 'pages'
const prefix = moduleName

export const INIT_PAGE_LIST = `${prefix}/INIT_PAGE_LIST`
export const SET_ACTIVE_PAGE = `${prefix}/SET_ACTIVE_PAGE`
export const SET_CURRENT_LINK = `${prefix}/SET_CURRENT_LINK`

/**
 * Reducer
 * */

export const ReducerRecord = {
  pageList: data,
  activePages: [],
  currentLink: null,
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
    case SET_CURRENT_LINK:
      return Object.assign({}, state, {
        currentLink: payload
      })
    default:
      return state
  }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName]
export const pageListSelector = createSelector(stateSelector, state => state.pageList) // TODO: make filter here
export const topLevelIdsSelector = createSelector(stateSelector, state => (state.pageList && state.pageList.topLevelIds) || [])
export const activePagesSelector = createSelector(stateSelector, state => state.activePages)
export const currentLinkSelector = createSelector(stateSelector, state => state.currentLink)
export const routerPageSelector = createSelector(state => state, state => {
  const id = state[moduleName].currentLink && state[moduleName].currentLink.id
  const page = state[moduleName].pageList.entities.pages[id]
  return (page && page['anchors']) || []
})

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
    const newActivePages = [...activePages].includes(pageId) ? [...activePages].filter(id => id !== pageId) : [...activePages, pageId]

    dispatch ({
      type: SET_ACTIVE_PAGE,
      payload: newActivePages
    })
  }
}

export function setCurrentLink(url, id) {
  return (dispatch) => {
    // const url = event.target.href
    
    dispatch({
      type: SET_CURRENT_LINK,
      payload: {url, id}
    })
  }
}
