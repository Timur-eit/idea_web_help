import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
import Mousetrap from 'mousetrap'
import {batch} from 'react-redux'
import {Fragment, useCallback, useMemo, useState, useEffect} from 'react'
import {getCoords, ArrowKeysHandler, setMenuScrollHandler} from 'utils'
import SearchFieldContainer from 'Components/SearchField'
import { useSpring, animated, config } from 'react-spring'

function List(props) {
  const {
    activePages,
    pageList,
    topLevelIds,
    setMenuScrollPosition,
    setActivePage,
    setCurrentId,
    currentId,
    clickedId,
    setClickedId,
  } = props

  const pages = pageList.entities.pages
  const isNested = useCallback((id) => pages[id].pages && pages[id].pages.length > 0, [pages])
  const elementDomParams = useMemo(() => currentId && getCoords(document.getElementById(currentId)), [currentId])
  const onKeyDownArrowKeysHandler = useMemo(() => {
    return new ArrowKeysHandler(pageList, pages, currentId, activePages, setCurrentId, setActivePage, isNested)
  }, [pageList, pages, currentId, activePages, setCurrentId, setActivePage,isNested])

  const setMenuScroll = useCallback(() => setMenuScrollHandler(setMenuScrollPosition), [setMenuScrollPosition])

  Mousetrap.bind('down', () => {
    onKeyDownArrowKeysHandler.getMoveCursorDown()
    setMenuScroll()
  })
  Mousetrap.bind('up', () => {
    onKeyDownArrowKeysHandler.getMoveCursorUp()
    setMenuScroll()
  })
  Mousetrap.bind('right', () => onKeyDownArrowKeysHandler.getMoveCursorRight())
  Mousetrap.bind('left', () => onKeyDownArrowKeysHandler.getMoveCursorLeft())

  // const [isOpen, setOpen] = useState({})
  
  // function setOpenHandler(id, isOpen) {
  //   if (isOpen.hasOwnProperty(id)) {
  //     setOpen(() => ({...isOpen, id: 'isOpen'}))
  //   } else {
  //     const newIsOpen = {...isOpen}
  //     newIsOpen[id] = 'close'
  //     setOpen(() => newIsOpen)
  //   }
  // }
  
  const isOpen = (id) => clickedId[id] === 'open'
 
  const arrowStyleSpringProps = useSpring({
    // transform: clickedId.length > 0 ? 'rotate(-180deg)' : 'rotate(0deg)',
    // transform: clickedId.length > 0 ? 'rotate(-180deg)' : 'rotate(0deg)',
    // reset: true,
    // config: { duration: 500 },
    // delay: 1000,
    
    from: { rotate: isOpen(currentId) ? 0 : -180 },
    to: { rotate: isOpen(currentId) ? -180 : 0 },

    // reset: true,
    config: { duration: 500 },
    // config: config.molasses,
  })

  return (
    <div className='menu'>
      {topLevelIds.map((id) => {
        const url = pages[id].url

        const arrowClasses = classNames({
          'disclose-arrow': true,
          'hidden': !isNested(id),
          // 'rotated': activePages.includes(id)
        })

        const linkClasses = classNames({
          'nested-link': !isNested(id),
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
                setClickedId(id, pages)
              })

              console.log(clickedId)
              
            }}>
              <animated.div className={arrowClasses} style={arrowStyleSpringProps}></animated.div>
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
                clickedId={clickedId}
                setClickedId={setClickedId}
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
                clickedId,
                setClickedId,
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
            clickedId={clickedId}
            setClickedId={setClickedId}
      />
    </div>
  )
}

export default Menu
