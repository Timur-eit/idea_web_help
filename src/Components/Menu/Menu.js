import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
import Mousetrap  from 'mousetrap'
import {batch} from 'react-redux'
import {Fragment, useRef, useMemo} from 'react'
import {getCoords} from '../../utils'

function List(props) {
  const {
    activePages,
    pageList,
    topLevelIds = pageList.entities.topLevelIds,
    pages = pageList.entities.pages,
    setActivePage,
    setCurrentLink,
    currentLink,
  } = props

  const elementDomParams = useMemo(() => currentLink && getCoords(document.getElementById(currentLink.id)), [currentLink])
  console.log(elementDomParams)

  return (
    <div>
      {topLevelIds.map((id, key) => {
        const url = pages[id].url
        const nextId =  key === topLevelIds.length -1 ? topLevelIds[0] : topLevelIds[key + 1]
        const isNested = pages[id].pages && pages[id].pages.length > 0

        const arrowClasses = classNames({
          'disclose-arrow' : true,
          'hidden' : !isNested,
          'rotated': activePages.includes(id)
        })

        const linkClasses = classNames({
          
          'nested-link' : pages[id].level > 0 && !isNested,
          'selected-link' : currentLink && currentLink.id === id
        })

        const linkBgClasses = classNames({
          'link-background' : true,
          'active' : currentLink && currentLink.id === id
        })

        Mousetrap.bind('down', () => {
          batch(() => {
            console.log(pages[nextId].url, nextId, isNested)
            setCurrentLink(pages[nextId].url, nextId)
            setActivePage(nextId)
          })
        })

        return (
          <Fragment key={id}>
            <div className={linkBgClasses} style={{ height: elementDomParams ? elementDomParams.height : 0}}></div>

            <Link id={id} className={linkClasses} to={url ? url : '/'} onClick={(e) => {
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
