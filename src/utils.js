import {batch} from 'react-redux'
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
  let objects = obj, y = 0
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
    height: box.height
  }
}


/**
* @param {Object} [pageList=store.pages.pageList]
* @param {Array} [pages=pageList.entities.pages]
* @param {String} currentId
* @param {Array} activePages - state from Redux store
* @param {Function} setCurrentId - actionCreator from Redux reducer
*/
class Cursor {
  #parentId
  #currentPageList
  #parentIdPageList
  #currentIdIndex
  #parentIdIndex
  #prevId

  constructor(pageList, pages, currentId, activePages){
    this.pageList = pageList
    this.pages = pages
    this.currentId = currentId
    this.activePages = activePages

    this.#parentId = pages[currentId].parentId
    this.#currentPageList = pages[currentId].level === 0 ? pageList.topLevelIds : pages[this.#parentId].pages
    this.#parentIdPageList = pages[currentId].level <= 1 ? pageList.topLevelIds : pages[pages[this.#parentId].parentId].pages
    this.#currentIdIndex = this.#currentPageList.indexOf(currentId)
    this.#parentIdIndex = this.#parentId ? this.#parentIdPageList.indexOf(this.#parentId) : this.#currentIdIndex
    this.#prevId = this.#currentPageList[this.#currentIdIndex - 1]     
  }

  getDownDirection = () => {
    if (this.#currentIdIndex === this.#currentPageList.length - 1 && this.#parentId) {
      return this.#parentIdPageList[this.#parentIdIndex + 1]
    } else if (this.activePages.includes(this.currentId)) {
      return this.pages[this.currentId].pages[0]
    } else {
      return (this.#currentIdIndex === this.#currentPageList.length - 1 ? this.#currentPageList[0] : this.#currentPageList[this.#currentIdIndex + 1])
    }
  }

  getUpDirection = () => {
    if (this.#currentIdIndex === 0 && this.#parentId) {
      return this.#parentIdPageList[this.#parentIdIndex]
    } else if (this.activePages.includes(this.#prevId)) {
      const lastIndex = this.pages[this.#prevId].pages.length - 1
      return this.pages[this.#prevId].pages[lastIndex]
    } else {
      return (this.#currentIdIndex === 0 ? this.#currentPageList[this.#currentPageList.length - 1] : this.#prevId)
    }
  }
}

/**
* @param {Function} setCurrentId - actionCreator from Redux reducer
* @param {Function} setActivePage - actionCreator from Redux reducer
* @param {Function} isNested - predicate foo from Menu.js
*/
export class arrowKeysHandler {
  constructor(
    pageList,
    pages = pageList.entities.pages,
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
  
  setUrl = (id) => this.pages[id].url && history.push(this.pages[id].url)  

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
    if (this.currentId && this.isNested(this.currentId) && !this.activePages.includes(this.currentId)) {
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



// const getNextId = (pages, pageList, activePages, currentId, direction) => {
//   // @param info is shown in target function 'upDownKeysHandler' (see below)
//     const parentId = pages[currentId].parentId
//     const currentPageList = pages[currentId].level === 0 ? pageList.topLevelIds : pages[parentId].pages
//     const parentIdPageList = pages[currentId].level <= 1 ? pageList.topLevelIds : pages[pages[parentId].parentId].pages
//     const currentIdIndex = currentPageList.indexOf(currentId)
//     const parentIdIndex = parentId ? parentIdPageList.indexOf(parentId) : currentIdIndex      
//     const prevId = currentPageList[currentIdIndex - 1]
    
//     if (direction === 'down') {        
//       if (currentIdIndex === currentPageList.length - 1 && parentId) {
//         return parentIdPageList[parentIdIndex + 1]
//       } else if (activePages.includes(currentId)) {
//         return pages[currentId].pages[0]
//       } else {
//         return (currentIdIndex === currentPageList.length - 1 ? currentPageList[0] : currentPageList[currentIdIndex + 1])
//       }
//     } else if (direction === 'up') {        
//       if (currentIdIndex === 0 && parentId) {
//         return parentIdPageList[parentIdIndex]
//       } else if (activePages.includes(prevId)) {
//         const lastIndex = pages[prevId].pages.length - 1
//         return pages[prevId].pages[lastIndex]
//       } else {
//         return (currentIdIndex === 0 ? currentPageList[currentPageList.length - 1] : prevId)
//       }
//     } else {
//       console.error('wrong direction in Mousetrap: input "up" or "down"')
//       return currentId
//     }
//   }

// /**
// * @param {String} currentId
// * @param {Object} [pageList=store.pages.pageList]
// * @param {Array} [pages=pageList.entities.pages]
// * @param {Array} activePages - state from Redux store
// * @param {Function} setCurrentId - actionCreator from Redux reducer
// * @param {String} direction ['up', 'down']
// */
// export function upDownKeysHandler(
//   currentId,
//   pageList,
//   pages = pageList.entities.pages,
//   activePages,
//   setCurrentId,
//   direction
// ) {
//   if (!currentId) {
//     const currentId = pageList.topLevelIds[0]
//     setCurrentId(currentId)
//     pages[currentId] && history.push(pages[currentId].url)
//   } else {
//     const myCursor = new Cursor(pageList, pages, currentId,  activePages)
//     let nextId = null
//     if(direction === 'up'){
//       nextId = myCursor.getUpDirection()
//     } else if(direction === 'down') {
//       nextId = myCursor.getDownDirection()
//     }
//     //const nextId = getNextId(pages, pageList, activePages, currentId, direction)
//     setCurrentId(nextId)
//     pages[nextId] && history.push(pages[nextId].url)
//   }
// }