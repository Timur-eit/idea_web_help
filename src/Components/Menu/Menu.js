import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
// import data from '../../data/HelpTOC.json' 

function List({
                activePages,
                pageList,
                topLevelIds = pageList.entities.topLevelIds,
                pages = pageList.entities.pages,
                setActivePage,
                // isTopLevel = true,
              }) {

  // const pages = pageList.entities.pages
  // console.log(pageList)

  return (
    <div>
      {topLevelIds.map(id => {
        const url = pages[id].url
        const isNested = pages[id].pages && pages[id].pages.length > 0

        const arrowClasses = classNames({
          'disclose-arrow' : true,
          'hidden' : !isNested,
          'rotated': activePages.includes(id)
        })

        const linkClasses = classNames({
          
          'nested-link' : pages[id].level > 0 && !isNested,
        })

        return (
          <>
          <Link className={linkClasses} key={id} to={url ? url : '/'} onClick={() => {
          isNested && setActivePage(id)
        }}>
          {/* {isTopLevel && <div className={arrowClasses}></div>} */}
          <div className={arrowClasses} style={{'left': `${1 + pages[id].level}em`}}></div>
          
          {pages[id].title}
          
          
        </Link>
        {isNested && activePages.includes(id) && <div className='submenu'>
              <List
                activePages = {activePages}
                pageList = {pageList} 
                topLevelIds = {pages[id].pages}
                pages = {pageList.entities.pages}
                setActivePage = {setActivePage}
                // isTopLevel = {false}
              />
            </div>
          }
        </>)
      })}
    </div>
  )
}


function Menu({
  activePages,
  pageList,
  topLevelIds = pageList.entities.topLevelIds,
  pages = pageList.entities.pages,
  setActivePage,
  // isTopLevel = true,
}) {
  return (
    <div className='menu-list__container'>
      <List 
        activePages={activePages}
        pageList={pageList}
        topLevelIds={topLevelIds}
        pages={pages}
        setActivePage={setActivePage}
        // isTopLevel={isTopLevel}
      />
    </div>
  )
} 

export default Menu


