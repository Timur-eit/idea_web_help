
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
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getObjects(obj[i], key, val))
    } else if (i == key && obj[key] == val) {
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
    if (typeof obj[i] == 'object') {
      objects = setObject(obj[i], key, val, set)
    } else if (i == key && obj[key] == val) {
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
    if (typeof obj[i] == 'object') {
      let tempObj = obj
      if (obj[i] && obj[i].id == val) {
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
* @param {String} currentId
* @param {Object} [pageList=store.pages.pageList]
* @param {Array} [pages=pageList.entities.pages]
* @param {Function} setCurrentId - actionCreator from Redux reducer
* @param {String} direction ['up', 'down']
*/
export function upDownKeysHandler(
  currentId,
  pageList,
  pages = pageList.entities.pages,
  setCurrentId,
  direction,
) {

  if (!currentId) {
    setCurrentId(pageList.topLevelIds[0])
  } else {
    let currentPageList = (
      pages[currentId].level === 0 ? pageList.topLevelIds : pages[pages[currentId].parentId].pages
    )
    const index = currentPageList.indexOf(currentId)
    const nextId = () => {
      if (direction === 'down') {
        return (index === currentPageList.length - 1 ? currentPageList[0] : currentPageList[index + 1])
      } else if (direction === 'up') {
        return (index === 0 ? currentPageList[currentPageList.length - 1] : currentPageList[index - 1])
      } else {
        console.error('wrong direction in Mousetrap: input "up" or "down"')
        return currentId
      }
    }
    setCurrentId(nextId())
   
  }
}