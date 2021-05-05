import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
import Mousetrap from 'mousetrap'
import {batch} from 'react-redux'
import {Fragment, useCallback, useMemo, useState, useEffect} from 'react'
import {getCoords, ArrowKeysHandler, setMenuScrollHandler} from 'utils'
import SearchFieldContainer from 'Components/SearchField'

function ListItem(props) {
  const {pages, isNested, id, currentId, setActivePage, setCurrentId, activePages, pageList, setMenuScrollPosition, elementDomParams, url} = props

  const isActive = activePages.includes(id)

  const arrowClasses = classNames({
    'disclose-arrow': true,
    'hidden': !isNested(id),
    'rotated': isActive
  })

  const linkClasses = classNames({
    'nested-link': !isNested(id),
    'selected-link': currentId && currentId === id
  })

  const linkBgClasses = classNames({
    'link-background': true,
    'active': currentId && currentId === id
  })

  const [arrowPosition, setArrowPosition] = useState(0)

  useEffect(() => {
    if(arrowPosition > 0 && arrowPosition < 180) {
      setArrowPosition(prev => prev + 5)
    }
  }, [isActive, arrowPosition, setArrowPosition])

  useEffect(() => {
    if(isActive && arrowPosition === 0) {
      setArrowPosition(prev => prev + 5)
    }
  }, [isActive])

  return (
    <Fragment key={id}>
      <div className={linkBgClasses} style={{height: elementDomParams ? elementDomParams.height : 0}}></div>

      <Link id={id} className={linkClasses} to={url ? url : '/'} onClick={() => {
        batch(() => {
          setCurrentId(id)
          isNested(id) && setActivePage(id)
        })

      }}>
        <div className={arrowClasses} style={{transform: `rotate(-${arrowPosition}deg)`}}></div>
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
}

function List(props) {
  const {
    activePages,
    pageList,
    topLevelIds,
    setMenuScrollPosition,
    setActivePage,
    setCurrentId,
    currentId
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

  const [arrowPosition, setArrowPosition] = useState(0)
  useEffect(() => {
    if(arrowPosition > 0 && arrowPosition < 180){
      setArrowPosition(prev => prev + 10)
    }
  }, [arrowPosition])

  return (
    <div className='menu'>
      {topLevelIds.map((id, key) => <ListItem
        key={currentId + key}
        id={id}
        url={pages[id].url}
        elementDomParams={elementDomParams}
        setMenuScrollPosition={setMenuScrollPosition}
        isNested={isNested}
        currentId={currentId}
        pageList={pageList}
        setActivePage={setActivePage}
        activePages={activePages}
        setCurrentId={setCurrentId}
        topLevelIds={topLevelIds}
        pages={pages}
      />)}
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
