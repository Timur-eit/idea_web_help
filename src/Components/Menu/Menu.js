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
    topLevelIds,
    pages = pageList.entities.pages,
    setActivePage,
    setCurrentId,
    currentId,
  } = props

  const elementDomParams = useMemo(() => currentId && getCoords(document.getElementById(currentId)), [currentId])
  // console.log(elementDomParams)

  Mousetrap.bind('down', () => {
    
    if (!currentId) {
      setCurrentId(pageList.topLevelIds[0])
    } else {
      let currentPageList = null
    
      if (pages[currentId].level === 0) {
        currentPageList = pageList.topLevelIds
      } else {
        currentPageList = pages[pages[currentId].parentId].pages
      }

      let index = currentPageList.indexOf(currentId)
      let nextId = index === currentPageList.length - 1 ? currentPageList[0] : currentPageList[index + 1] 
          
      // console.log(currentId)
      // console.log(pages[currentId].level)
      // console.log(currentPageList)
      // console.log(nextId)
      setCurrentId(nextId)
     
    }
  })


  return (
    <div>
      {topLevelIds.map((id, key) => {
        {/* console.log(topLevelIds) */}
        const url = pages[id].url
        // console.log(key)
        {/* const nextId = id === currentId.id ? topLevelIds[key + 1] : topLevelIds[0] */}
        {/* const nextId = key === topLevelIds.length -1 ? topLevelIds[0] : topLevelIds[key + 1] */}
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
                pages = {pageList.entities.pages}
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
  pages = pageList.entities.pages,
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
        pages={pages}
        setActivePage={setActivePage}
        setCurrentId={setCurrentId}
        currentId={currentId}
        // isTopLevel={isTopLevel}
      />
    </div>
  )
} 

export default Menu
