import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
import Mousetrap  from 'mousetrap'
import {batch} from 'react-redux'
import {Fragment} from 'react'


function List({
                activePages,
                pageList,
                topLevelIds = pageList.entities.topLevelIds,
                pages = pageList.entities.pages,
                setActivePage,
                setCurrentLink,
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
          <Fragment key={id}>
            <Link  className={linkClasses} to={url ? url : '/'} onClick={(e) => {
              const currentUrl = e.target.href
              batch(() => {
                setCurrentLink(currentUrl, id)
                isNested && setActivePage(id)
              })
              }}>
              <div className={arrowClasses} style={{'left': `-1em`}}></div>
              {pages[id].title}
            </Link>
            
            {isNested && activePages.includes(id) && <div className='submenu'>
              <List
                activePages = {activePages}
                pageList = {pageList} 
                topLevelIds = {pages[id].pages}
                pages = {pageList.entities.pages}
                setActivePage = {setActivePage}
                setCurrentLink={setCurrentLink}
                key={pages[id]}
                // isTopLevel = {false}
              />
              </div>
            }
        </Fragment>)
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
  setCurrentLink,
  isTopLevel = true,
}) {
  return (
    <div className='menu-list__container'>
      <List key={activePages}
        activePages={activePages}
        pageList={pageList}
        topLevelIds={topLevelIds}
        pages={pages}
        setActivePage={setActivePage}
        setCurrentLink={setCurrentLink}
        // isTopLevel={isTopLevel}
      />
    </div>
  )
} 

export default Menu
