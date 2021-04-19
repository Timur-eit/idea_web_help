import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
// import data from '../../data/HelpTOC.json'
import {batch} from 'react-redux'
import {Fragment, useEffect} from 'react'

function List({
                activePages,
                pageList,
                topLevelIds = pageList.entities.topLevelIds,
                pages = pageList.entities.pages,
                setActivePage,
                setCurrentLink,
                currentLink,
                // isTopLevel = true,
              }) {

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
          'selected-link' : currentLink.id === id
        })

        

        return (
          <Fragment key={id}>
            <div className='link-background'></div>
            <Link className={linkClasses} to={url ? url : '/'} onClick={(e) => {
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
                // key={pages[id]}
                currentLink={currentLink}
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
  currentLink,
  // isTopLevel = true,
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
        currentLink={currentLink}
        // isTopLevel={isTopLevel}
      />
    </div>
  )
} 

export default Menu
