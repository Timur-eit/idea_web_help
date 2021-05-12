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
export const SET_CLICKED_ID = `${prefix}/SET_CLICKED_ID`
export const GET_SEARCH_RESULTS = `${prefix}/GET_SEARCH_RESULTS`
export const LOADER_ON = `${prefix}/LOADER_ON`
export const LOADER_OFF = `${prefix}/LOADER_OFF`

/**
 * Reducer
 * */

export const ReducerRecord = {
  pageList: data,
  isLoader: data,
  searchData: null,
  activePages: [],
  currentId: null,
  clickedId: []
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
        currentId: payload
      })
    case SET_CLICKED_ID:
      return Object.assign({}, state, {
        clickedId: payload
      })
    case GET_SEARCH_RESULTS:
      return Object.assign({}, state, {
        searchData: payload
      })
    case LOADER_ON:
    case LOADER_OFF:
      return Object.assign({}, state, {
        isLoader: payload
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
 export const currentIdSelector = createSelector(stateSelector, state => state.currentId)
 export const routerPageSelector = createSelector(state => state, state => {
   const id = state[moduleName].currentId
   const page = state[moduleName].pageList.entities.pages[id]
   return (page && page['anchors']) || []
 })
 export const clickedIdSelector = createSelector(stateSelector, state => state.clickedId)

 /**
 * Action Creator
 * */

//  export const setActivePage = pageId => ({
//   type: SET_ACTIVE_PAGE,
//   payload: pageId
// })

export function filterData(queryString) {
  return (dispatch, getState) => {
    dispatch ({
      type: LOADER_ON,
      payload: data
    })

    fetch(`http://localhost:3000/?search=${queryString}`)
      .then(res => res.json())
      .then(data => {
        dispatch ({
            type: GET_SEARCH_RESULTS,
          payload: data
        })
      }).finally(() => {
      dispatch ({
        type: LOADER_OFF,
        payload: data
      })
    })
  }
}


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

export function setCurrentId(id) {
  return (dispatch) => {
    // const url = event.target.href
    
    dispatch({
      type: SET_CURRENT_LINK,
      payload: id
    })
  }
}

export function setClickedId(id) {
  return (dispatch, getState) => {
    // const clickedId = clickedIdSelector(getState())
    const { clickedId } = getState()[moduleName]
    let newClickedId = []
    if (clickedId.includes(id)) {
      newClickedId = [...clickedId].filter(x => x !== id)
    } else {
      newClickedId = [...clickedId, id]
    }
    dispatch({
      type: SET_CLICKED_ID,
      payload: newClickedId
    })
  }
}

export function getSearchedData() {
  return (dispatch, getState) => {
    const { searchField } = getState()['form']
    const searchValue = searchField.values
    console.log(searchValue)

  }
}