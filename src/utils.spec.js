import {Cursor} from './utils'
import data from './data/HelpTOC.json'
const topLevelIds = data.topLevelIds

describe('Cursor tests', () => {

  const pageList = data
  const pages = pageList.entities.pages
  const activePages = [
    "top",
    "procedures.workingwithprojects.config.template",
    "concepts.module.path",
    "Working_with_source_code",
    "d732e166",
    "d732e254",
    "procedures.vcWithIDEA",
    "d732e375",
    "d732e380",
    "d732e1056",
    "d732e1069"
  ]

  topLevelIds.map((topId, i) => {
    const myCursorForFlatTest = new Cursor(pageList, pages, topId, [])
    it('Cursor`s getDownDirection have worked: for non-nested Ids', () => {
      expect(i === topLevelIds.length - 1 ? topLevelIds[0] : topLevelIds[i + 1]).toBe(myCursorForFlatTest.getDownDirection())
    })
    it('Cursor`s getUpDirection have worked: for non-nested Ids', () => {
      expect(i === 0 ? topLevelIds[topLevelIds.length - 1] : topLevelIds[i - 1]).toBe(myCursorForFlatTest.getUpDirection())
    })

    const myCursorForNestedTest = new Cursor(pageList, pages, topId, activePages)
    it('Cursor`s getDownDirection have worked: for nested Ids', () => {
      const getCorrectId = (id, index) => {
        if (activePages.includes(id)) {
          return pages[id].pages[0]
        } else if (!activePages.includes(id) && index === topLevelIds.length - 1) {
          return topLevelIds[0]
        } else {
          return topLevelIds[i + 1]
        }
      }

      expect(getCorrectId(topId, i)).toBe(myCursorForNestedTest.getDownDirection())
    })
  })


})