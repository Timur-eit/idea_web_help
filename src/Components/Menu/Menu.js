import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
import Mousetrap from 'mousetrap'
import {batch} from 'react-redux'
import {Fragment, useCallback, useMemo, useState, useEffect} from 'react'
import {getCoords, ArrowKeysHandler, setMenuScrollHandler} from 'utils'
import SearchFieldContainer from 'Components/SearchField'
import { useSpring, animated } from 'react-spring'

function List(props) {
  const {
    activePages,
    pageList,
    topLevelIds,
    setMenuScrollPosition,
    setActivePage,
    setCurrentId,
    currentId,
    setClickedIdHandler,
    clickedId
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

  const arrowStyleSpringProps = useSpring({
    transform: activePages.includes(clickedId) ? 'rotate(-180deg)' : 'rotate(0deg)',
    config: { duration: 500 },
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
              })

              // console.log(currentId)
              // console.log('click id ' + id)
              setClickedIdHandler(id)
              // ! ???
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
                setClickedIdHandler={setClickedIdHandler}
                clickedId={clickedId}

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

  const [clickedId, setClickedId] = useState([])
  function setClickedIdHandler(id) {
    setClickedId(() => {
        if (!clickedId.includes(id)) {
          return [...clickedId, id]
        } else {
          return clickedId.filter(x => x !== id)
      }
    })
  }

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
            setClickedIdHandler={setClickedIdHandler}
            clickedId={clickedId}

      />
    </div>
  )
}

export default Menu
