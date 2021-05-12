import {Cursor} from './utils'
import data from './data/HelpTOC.json'
const topLevelIds = data.topLevelIds

describe('Cursor tests', () => {

  topLevelIds.map((topId, key) => {

    const pageList = data, pages = pageList.entities.pages, currentId = "top", activePages = ["top"]


    it('Cursor`s getDownDirection have worked', () => {

      const myCursor = new Cursor(pageList, pages, currentId, activePages)
      expect('Install_and_set_up__product_').toBe(myCursor.getDownDirection())
    })

    it('Cursor`s getUpDirection have worked', () => {
      const pageList = data, pages = pageList.entities.pages, currentId = "top", activePages = ["top"]
      const myCursor = new Cursor(pageList, pages, currentId, activePages)
      expect('feedback.mainpage').toBe(myCursor.getUpDirection())
    })
  })

})