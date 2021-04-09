import './App.scss';
import { connect } from 'react-redux'
import {
  pageListSelector,
  setActivePage,
  activePageSelector,
} from './modules/pages'

function App({
  pageList
}) {
  
  let idList

  const getIds = (pageList) => {
    const pages = pageList.entities.pages
    const result = []
    for (const page in pages) {
      result.push(pages[page].id)
      // console.log(pages[page].id)
    }
    idList = result
    console.log(idList)
    
  }

  
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => getIds(pageList)}>Test - show all IDs</button>
        <div>{idList}</div>
      </header>
      
    </div>
  );
}


export default connect(state => ({
  pageList: pageListSelector(state),
  activePage: activePageSelector(state),
}), {
  setActivePage,
})(App)