import { createSelector } from 'reselect'
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
export const SET_FOUND_ID = `${prefix}/SET_FOUND_ID`


/**
 * Reducer
 * */

export const ReducerRecord = {
    pageList: data,
    activePages: [],
    currentId: null,
    clickedId: [],
    foundId: [],
}

export default function reducer(state = ReducerRecord, action) {
    const { type, payload } = action

    switch (type) {
        case INIT_PAGE_LIST:
            return Object.assign({}, state, {
                pageList: payload,
            })
        case SET_ACTIVE_PAGE:
            return Object.assign({}, state, {
                activePages: payload,
            })
        case SET_CURRENT_LINK:
            return Object.assign({}, state, {
                currentId: payload,
            })
        case SET_CLICKED_ID:
            return Object.assign({}, state, {
                clickedId: payload,
            })
        case SET_FOUND_ID:
            return Object.assign({}, state, {
                foundId: payload,
            })
        default:
            return state
    }
}

/**
 * Selectors
 * */

export const stateSelector = (state) => state[moduleName]
export const pageListSelector = createSelector(stateSelector, (state) => state.pageList)
export const topLevelIdsSelector = createSelector(
    stateSelector,
    (state) => (state.pageList && state.pageList.topLevelIds) || []
)
export const activePagesSelector = createSelector(stateSelector, (state) => state.activePages)
export const currentIdSelector = createSelector(stateSelector, (state) => state.currentId)
export const routerPageSelector = createSelector(
    (state) => state,
    (state) => {
        const id = state[moduleName].currentId
        const page = state[moduleName].pageList.entities.pages[id]
        return (page && page['anchors']) || []
    }
)
export const clickedIdSelector = createSelector(stateSelector, (state) => state.clickedId)
export const foundIdSelector = createSelector(stateSelector, (state) => state.foundId)

/**
 * Action Creator
 * */

export function setActivePage(pageId) {
    return (dispatch, getState) => {
        const activePages = activePagesSelector(getState())
        const newActivePages = [...activePages].includes(pageId)
            ? [...activePages].filter((id) => id !== pageId)
            : [...activePages, pageId]

        dispatch({
            type: SET_ACTIVE_PAGE,
            payload: newActivePages,
        })
    }
}

export function setCurrentId(id) {
    return (dispatch) => {
        dispatch({
            type: SET_CURRENT_LINK,
            payload: id,
        })
    }
}

export function setClickedId(id) {
    return (dispatch, getState) => {
        // const clickedId = clickedIdSelector(getState())
        const { clickedId } = getState()[moduleName]
        let newClickedId = []
        if (clickedId.includes(id)) {
            newClickedId = [...clickedId].filter((x) => x !== id)
        } else {
            newClickedId = [...clickedId, id]
        }
        dispatch({
            type: SET_CLICKED_ID,
            payload: newClickedId,
        })
    }
}

export function setFoundId(listOfId) {
    return (dispatch, getState) => {
        const ids = Object.keys(listOfId)
        dispatch({
            type: SET_FOUND_ID,
            payload: ids,
        })
    }
}