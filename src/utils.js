
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