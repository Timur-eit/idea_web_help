import './App.scss'
import {connect} from 'react-redux'
import {
  pageListSelector,
  setActivePage,
  activePageSelector,
} from './modules/pages'
import {useState, useCallback} from 'react'

function App({
               pageList
             }) {

  const [idList, setIdList] = useState([])

  const getIds = useCallback((pageList) => {
    const pages = pageList.entities.pages
    const result = []
    for (const page in pages) {
      result.push(pages[page].id)
    }
    return result
  }, [pageList])

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setIdList(getIds(pageList))}>Det data</button>
        <div>{idList}</div>
      </header>

    </div>
  )
}


export default connect(state => ({
  pageList: pageListSelector(state),
  activePage: activePageSelector(state),
}), {
  setActivePage,
})(App)