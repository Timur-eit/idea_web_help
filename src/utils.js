
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

const getNextId = (pages, pageList, activePages, currentId, direction) => {
// @param info is shown in target function 'upDownKeysHandler' (see below)
  const parentId = pages[currentId].parentId
  const currentPageList = pages[currentId].level === 0 ? pageList.topLevelIds : pages[parentId].pages
  const parentIdPageList = pages[currentId].level <= 1 ? pageList.topLevelIds : pages[pages[parentId].parentId].pages
  const currentIdIndex = currentPageList.indexOf(currentId)
  const parentIdIndex = parentId ? parentIdPageList.indexOf(parentId) : currentIdIndex      
  const prevId = currentPageList[currentIdIndex - 1]
  
  if (direction === 'down') {        
    if (currentIdIndex === currentPageList.length - 1 && parentId) {
      return parentIdPageList[parentIdIndex + 1]
    } else if (activePages.includes(currentId)) {
      return pages[currentId].pages[0]
    } else {
      return (currentIdIndex === currentPageList.length - 1 ? currentPageList[0] : currentPageList[currentIdIndex + 1])
    }
  } else if (direction === 'up') {        
    if (currentIdIndex === 0 && parentId) {
      return parentIdPageList[parentIdIndex]
    } else if (activePages.includes(prevId)) {
      const lastIndex = pages[prevId].pages.length - 1
      return pages[prevId].pages[lastIndex]
    } else {
      return (currentIdIndex === 0 ? currentPageList[currentPageList.length - 1] : prevId)
    }
  } else {
    console.error('wrong direction in Mousetrap: input "up" or "down"')
    return currentId
  }
}

/**
* @param {String} currentId
* @param {Object} [pageList=store.pages.pageList]
* @param {Array} [pages=pageList.entities.pages]
* @param {Array} activePages - state from Redux store
* @param {Function} setCurrentId - actionCreator from Redux reducer
* @param {String} direction ['up', 'down']
* ↓ does not applied for getNextId() ↓
* @param {Object} history - React Router history
*/
export function upDownKeysHandler(
  currentId,
  pageList,
  pages = pageList.entities.pages,
  activePages,
  setCurrentId,
  direction,
  history,
) {
  if (!currentId) {
    const currentId = pageList.topLevelIds[0]
    setCurrentId(currentId)
    history.push(pages[currentId].url)
  } else {
    const nextId = getNextId(pages, pageList, activePages, currentId, direction)
    setCurrentId(nextId)
    history.push(pages[nextId].url)
  }
}