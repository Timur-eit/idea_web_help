import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
import Mousetrap from 'mousetrap'
import {batch} from 'react-redux'
import {Fragment, useCallback, useMemo, useState, useEffect} from 'react'
import {getCoords, VerticalHandler} from 'utils'
import SearchFieldContainer from 'Components/SearchField'

function List(props) {
  const {
    activePages,
    pageList,
    topLevelIds,
    setMenuScrollPosition,
    setActivePage,
    setCurrentId,
    currentId,
  } = props

  const pages = pageList.entities.pages
  const isNested = useCallback((id) => pages[id].pages && pages[id].pages.length > 0, [pages])  
  const elementDomParams = useMemo(() => currentId && getCoords(document.getElementById(currentId)), [currentId])  
  const onKeyDownVerticalHandler = useMemo(() => {
    return new VerticalHandler(pageList, pages, currentId, activePages, setCurrentId, setActivePage, isNested)
  }, [pageList, pages, currentId, activePages, setCurrentId, setActivePage,isNested])  

  Mousetrap.bind('down', () => {  
    onKeyDownVerticalHandler.getMoveCursorDown()    

    const activeTopPosition = document.querySelector('.selected-link').getBoundingClientRect().top
    const menuHeight = document.querySelector('.menu-list__container').offsetHeight
    const currentMenuScrollPosition = document.querySelector('.menu-list__container').scrollTop

    if(currentMenuScrollPosition > activeTopPosition){
      setMenuScrollPosition(0)
    } else if((menuHeight - activeTopPosition) < 40){
      setMenuScrollPosition(currentMenuScrollPosition + 60)
    }

  })
  Mousetrap.bind('up', () => onKeyDownVerticalHandler.getMoveCursorUp())
  Mousetrap.bind('right', () => onKeyDownVerticalHandler.getMoveCursorRight())
  Mousetrap.bind('left', () => onKeyDownVerticalHandler.getMoveCursorLeft())

  return (
    <div className='menu'>
      {topLevelIds.map((id) => {
        const url = pages[id].url

        const arrowClasses = classNames({
          'disclose-arrow': true,
          'hidden': !isNested(id),
          'rotated': activePages.includes(id)
        })

        const linkClasses = classNames({
          'nested-link': pages[id].level > 0 && !isNested(id),
          'selected-link': currentId && currentId === id
        })

        const linkBgClasses = classNames({
          'link-background': true,
          'active': currentId && currentId === id
        })

        return (
          <Fragment key={id}>
            <div className={linkBgClasses} style={{height: elementDomParams ? elementDomParams.height : 0}}></div>

            <Link id={id} className={linkClasses} to={url ? url : '/'} onClick={() => {
              batch(() => {
                setCurrentId(id)
                isNested(id) && setActivePage(id)
              })
            }}>
              <div className={arrowClasses} style={{'left': `-1em`}}></div>
              {pages[id].title}
            </Link>

            {isNested(id) && activePages.includes(id) && <div className='submenu'>
              <List
                activePages={activePages}
                pageList={pageList}
                topLevelIds={pages[id].pages}
                setMenuScrollPosition={setMenuScrollPosition}
                setActivePage={setActivePage}
                setCurrentId={setCurrentId}
                currentId={currentId}
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
                setActivePage,
                setCurrentId,
                currentId,
              }) {
  const [menuScrollPosition, setMenuScrollPosition] = useState(0)

  useEffect(() => {
    document.querySelector('.menu-list__container').scrollTop = menuScrollPosition
  }, [menuScrollPosition])

  return (
    <div className='menu-list__container'>
      <SearchFieldContainer/>
      <List key={activePages}
            activePages={activePages}
            pageList={pageList}
            topLevelIds={topLevelIds}
            setActivePage={setActivePage}
            setCurrentId={setCurrentId}
            currentId={currentId}
            setMenuScrollPosition={setMenuScrollPosition}
      />
    </div>
  )
}

export default Menu
