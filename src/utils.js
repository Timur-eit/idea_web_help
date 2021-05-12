import { batch } from 'react-redux'
import history from './history'

export const getIds = (pageList) => {
    const pages = pageList.entities.pages
    const result = []
    for (const page in pages) {
        result.push(pages[page].id)
    }
    return result
}

export const getObjects = (obj, key, val) => {
    let objects = []
    for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getObjects(obj[i], key, val))
        } else if (i === key && obj[key] === val) {
            objects.push(obj)
        }
    }
    return objects
}

// TODO Осторожно мутации!
export const setObject = (obj, key, val, set) => {
    let objects = obj
    for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue
        if (typeof obj[i] === 'object') {
            objects = setObject(obj[i], key, val, set)
        } else if (i === key && obj[key] === val) {
            if (objects.child) objects.child.push(set)
        }
    }
    return obj
}

// TODO Осторожно мутации!
export const delObject = (obj, key, val) => {
    let objects = obj,
        y = 0
    for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue
        if (typeof obj[i] === 'object') {
            let tempObj = obj
            if (obj[i] && obj[i].id === val) {
                tempObj = tempObj.splice(y, 1)
            }
            objects = delObject(tempObj[i], key, val)
        }
        y++
    }
    return objects
}

export function getCoords(elem) {
    const box = elem.getBoundingClientRect()
    return {
        top: box.top + window.pageYOffset + elem.clientHeight,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset,
        width: box.width,
        height: box.height,
    }
}

/**
 * @param {Object} [pageList=store.pages.pageList]
 * @param {Array} [pages=pageList.entities.pages]
 * @param {String} currentId
 * @param {Array} activePages - state from Redux store
 * @param {Function} setCurrentId - actionCreator from Redux reducer
 */
export class Cursor {
    #parentId
    #currentPageList
    #parentIdPageList
    #currentIdIndex
    #parentIdIndex
    #prevId

    constructor(pageList, pages, currentId, activePages) {
        this.pageList = pageList
        this.pages = pages
        this.currentId = currentId
        this.activePages = activePages

        this.#parentId = pages[currentId].parentId
        this.#currentPageList =
            pages[currentId].level === 0 ? pageList.topLevelIds : pages[this.#parentId].pages
        this.#parentIdPageList =
            pages[currentId].level <= 1
                ? pageList.topLevelIds
                : pages[pages[this.#parentId].parentId].pages
        this.#currentIdIndex = this.#currentPageList.indexOf(currentId)
        this.#parentIdIndex = this.#parentId
            ? this.#parentIdPageList.indexOf(this.#parentId)
            : this.#currentIdIndex
        this.#prevId = this.#currentPageList[this.#currentIdIndex - 1]
    }

    getDownDirection = () => {
        if (this.activePages.includes(this.currentId)) {
            return this.pages[this.currentId].pages[0]
        } else if (
            this.#currentIdIndex === this.#currentPageList.length - 1 &&
            this.#parentIdIndex === this.#parentIdPageList.length - 1 &&
            this.pages[this.currentId].level !== 0
        ) {
            const grandParentId = this.pages[this.pages[this.currentId].parentId].parentId
            const grandParentIdPageList =
                this.pages[grandParentId].level <= 1
                    ? this.pageList.topLevelIds
                    : this.pages[this.pages[grandParentId].parentId].pages
            const grandParentIdIndex = grandParentId
                ? grandParentIdPageList.indexOf(grandParentId)
                : this.#currentIdIndex
            return grandParentIdPageList[grandParentIdIndex + 1]
        } else if (this.#currentIdIndex === this.#currentPageList.length - 1 && this.#parentId) {
            return this.#parentIdPageList[this.#parentIdIndex + 1]
        } else {
            return this.#currentIdIndex === this.#currentPageList.length - 1
                ? this.#currentPageList[0]
                : this.#currentPageList[this.#currentIdIndex + 1]
        }
    }

    getUpDirection = () => {
        const prevIdLastIndex =
            this.#prevId && this.pages[this.#prevId].pages
                ? this.pages[this.#prevId].pages.length - 1
                : null
        const prevIdLastChild = prevIdLastIndex
            ? this.pages[this.pages[this.#prevId].pages[prevIdLastIndex]]
            : null

        if (this.#currentIdIndex === 0 && this.#parentId) {
            return this.#parentIdPageList[this.#parentIdIndex]
        } else if (prevIdLastChild && this.activePages.includes(prevIdLastChild.id)) {
            console.log(prevIdLastIndex)
            return this.pages[prevIdLastChild.id].pages[0]
        } else if (this.activePages.includes(this.#prevId)) {
            // const lastIndex = this.pages[this.#prevId].pages.length - 1
            return this.pages[this.#prevId].pages[prevIdLastIndex]
        } else {
            return this.#currentIdIndex === 0
                ? this.#currentPageList[this.#currentPageList.length - 1]
                : this.#prevId
        }
    }
}

/**
 * @param {Function} setCurrentId - actionCreator from Redux reducer
 * @param {Function} setActivePage - actionCreator from Redux reducer
 * @param {Function} isNested - predicate foo from Menu.js
 */
export class ArrowKeysHandler {
    constructor(
        pageList,
        pages,
        currentId,
        activePages,
        setCurrentId,
        setActivePage,
        isNested,
        myCursor = currentId && new Cursor(pageList, pages, currentId, activePages)
    ) {
        this.pageList = pageList
        this.pages = pages
        this.currentId = currentId
        this.activePages = activePages
        this.setCurrentId = setCurrentId
        this.setActivePage = setActivePage
        this.isNested = isNested
        this.myCursor = myCursor
    }

    setUrl = (id) => this.pages[id] && this.pages[id].url && history.push(this.pages[id].url)

    initiateCursor = () => {
        const currentId = this.pageList.topLevelIds[0]
        this.setCurrentId(currentId)
        this.setUrl(currentId)
    }

    getMoveCursorDown = () => {
        if (!this.currentId) {
            this.initiateCursor()
        } else {
            const nextId = this.myCursor.getDownDirection()
            this.setCurrentId(nextId)
            this.setUrl(nextId)
        }
    }

    getMoveCursorUp = () => {
        if (!this.currentId) {
            this.initiateCursor()
        } else {
            const nextId = this.myCursor.getUpDirection()
            this.setCurrentId(nextId)
            this.setUrl(nextId)
        }
    }

    getMoveCursorRight = () => {
        if (
            this.currentId &&
            this.isNested(this.currentId) &&
            !this.activePages.includes(this.currentId)
        ) {
            const nextId = this.pages[this.currentId].pages[0]
            this.setActivePage(this.currentId)
            this.setCurrentId(nextId)
            this.setUrl(nextId)
        }
    }

    getMoveCursorLeft = () => {
        if (this.currentId && this.pages[this.currentId].level !== 0) {
            const prevId = this.pages[this.currentId].parentId
            batch(() => {
                this.setActivePage(prevId)
                this.setCurrentId(prevId)
            })
            this.setUrl(prevId)
        } else if (this.currentId && this.activePages.includes(this.currentId)) {
            batch(() => {
                this.setActivePage(this.currentId)
                this.setCurrentId(this.currentId)
            })
            this.setUrl(this.currentId)
        }
    }
}

export function setMenuScrollHandler(setScrollState) {
    const activeTopPosition = document.querySelector('.selected-link').getBoundingClientRect().top
    const menuHeight = document.querySelector('.menu-list__container').offsetHeight
    const currentMenuScrollPosition = document.querySelector('.menu-list__container').scrollTop

    console.log('activeTopPosition ' + activeTopPosition)
    console.log('menuHeight ' + menuHeight)
    console.log('currentMenuScrollPosition ' + currentMenuScrollPosition)
    console.log('menuHeight - activeTopPosition ' + (menuHeight - activeTopPosition))

    if (menuHeight - activeTopPosition < 40 && menuHeight - activeTopPosition > 0) {
        setScrollState(currentMenuScrollPosition + 60)
    } else if (menuHeight - activeTopPosition < 0) {
        setScrollState(activeTopPosition + (menuHeight - activeTopPosition))
    } else if (menuHeight - (menuHeight - activeTopPosition) < 40) {
        setScrollState(currentMenuScrollPosition - 60)
    }
}