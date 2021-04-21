import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
import Mousetrap  from 'mousetrap'
import {batch} from 'react-redux'
import {Fragment, useRef, useMemo} from 'react'
import {getCoords} from 'utils'
import {upDownKeysHandler} from 'utils'


function List(props) {
  const {
    activePages,
    pageList,
    topLevelIds,
    
    setActivePage,
    setCurrentId,
    currentId,
  } = props

  const pages = pageList.entities.pages;
  const elementDomParams = useMemo(() => currentId && getCoords(document.getElementById(currentId)), [currentId])
  Mousetrap.bind('down', () => upDownKeysHandler(currentId, pageList, pages, setCurrentId, 'down'))
  Mousetrap.bind('up', () => upDownKeysHandler(currentId, pageList, pages, setCurrentId, 'up'))

  return (
    <div>
      {topLevelIds.map((id) => {

        const url = pages[id].url
        const isNested = pages[id].pages && pages[id].pages.length > 0

        const arrowClasses = classNames({
          'disclose-arrow' : true,
          'hidden' : !isNested,
          'rotated': activePages.includes(id)
        })

        const linkClasses = classNames({
          
          'nested-link' : pages[id].level > 0 && !isNested,
          'selected-link' : currentId && currentId === id
        })

        const linkBgClasses = classNames({
          'link-background' : true,
          'active' : currentId && currentId === id
        })

        Mousetrap.bind('', () => {
          let nextId
          
          if (currentId) {
            // nextId = pages[pages.indexOf(id) + 1]
            const index = topLevelIds.indexOf(id)
            const nextId = () => {
              if (index === topLevelIds.length - 1) {
                return topLevelIds[0]
              } else {
                return topLevelIds[index + 1]
              }
            }
            console.log(nextId(), topLevelIds)
          }
          
          batch(() => {
            {/* console.log(pages[nextId].url, nextId, isNested) */}
            {/* console.log(topLevelIds) */}
            {/* const currentUrl = pages[nextId].url ? pages[nextId].url : '/' */}
            {/* setCurrentId(currentUrl, nextId) */}

            {/* setCurrentId('currentUrl', nextId)
            setActivePage(nextId) */}
          })
        })

        {/* Mousetrap.bind('4', function() { alert('4'); }); */}

        {/* Mousetrap.bind('esc', function() { console.log('escape'); }, 'keyup'); */}



        return (
          <Fragment key={id}>
            <div className={linkBgClasses} style={{ height: elementDomParams ? elementDomParams.height : 0}}></div>

            <Link id={id} className={linkClasses} to={url ? url : '/'} onClick={(e) => {
              // const currentUrl = e.target.href

              batch(() => {
                setCurrentId(id)
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
                // pages = {pageList.entities.pages}
                setActivePage = {setActivePage}
                setCurrentId={setCurrentId}
                // key={pages[id]}
                currentId={currentId}
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
  topLevelIds,
  // pages = pageList.entities.pages,
  setActivePage,
  setCurrentId,
  currentId,
  // isTopLevel = true,
}) {

  return (
    <div className='menu-list__container'>
      <List key={activePages}
        activePages={activePages}
        pageList={pageList}
        topLevelIds={topLevelIds}
        // pages={pages}
        setActivePage={setActivePage}
        setCurrentId={setCurrentId}
        currentId={currentId}
        // isTopLevel={isTopLevel}
      />
    </div>
  )
} 

export default Menu
