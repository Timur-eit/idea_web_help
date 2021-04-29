import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"
import Mousetrap from 'mousetrap'
import {batch} from 'react-redux'
import {Fragment, useCallback, useMemo, useState, useEffect} from 'react'
import {getCoords, upDownKeysHandler} from 'utils'
import history from '../../history'
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
    // history,
  } = props

  const pages = pageList.entities.pages
  const elementDomParams = useMemo(() => currentId && getCoords(document.getElementById(currentId)), [currentId])
  // const isNested = (id) => pages[id].pages && pages[id].pages.length > 0
  const isNested = useCallback((id) => pages[id].pages && pages[id].pages.length > 0, [pages])

  // const onKeyDownVerticalHandler = useCallback((direction) => {
  //   upDownKeysHandler(currentId, pageList, pages, activePages, setCurrentId, direction)
  // }, [currentId, pageList, pages, activePages, setCurrentId])
  
  const onKeyDownVerticalHandler = useCallback((direction) => {
    const upDownKeysHandler = new VerticalHandler(currentId, pageList, pages, activePages, setCurrentId, direction)
    return upDownKeysHandler.getMoveCursor(direction)
  }, [currentId, pageList, pages, activePages, setCurrentId])

  const onKeyDownRightHandler = useCallback(() => {
    if (currentId && isNested(currentId) && !activePages.includes(currentId)) {
      const nextId = pages[currentId].pages[0]

      // ? why batch does not work here? => ↓
      // ! TypeError: Cannot read property 'getBoundingClientRect' of null
      setActivePage(currentId)
      setCurrentId(nextId)
      history.push(pages[nextId].url)
    }
  }, [currentId, isNested, activePages, pages, setActivePage, setCurrentId])

  const onKeyDownLeftHandler = useCallback(() => {
    if (currentId && pages[currentId].level !== 0) {
      const prevId = pages[currentId].parentId
      batch(() => {
        setActivePage(prevId)
        setCurrentId(prevId)
      })
      history.push(pages[prevId].url)
    } else if (currentId && activePages.includes(currentId)) {
      batch(() => {
        setActivePage(currentId)
        setCurrentId(currentId)
      })
      history.push(pages[currentId].url)
    }
  }, [currentId, activePages, pages, setActivePage, setCurrentId])


  Mousetrap.bind('down', () => {
    onKeyDownVerticalHandler('down')

    const activeTopPosition = document.querySelector('.selected-link').getBoundingClientRect().top
    const menuHeight = document.querySelector('.menu-list__container').offsetHeight
    const currentMenuScrollPosition = document.querySelector('.menu-list__container').scrollTop

    if(currentMenuScrollPosition > activeTopPosition){
      setMenuScrollPosition(0)
    } else if((menuHeight - activeTopPosition) < 40){
      setMenuScrollPosition(currentMenuScrollPosition + 60)
    }

  })
  Mousetrap.bind('up', () => onKeyDownVerticalHandler('up'))
  Mousetrap.bind('right', onKeyDownRightHandler)
  Mousetrap.bind('left', onKeyDownLeftHandler)

  console.log(pageList)


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

            <Link id={id} className={linkClasses} to={url ? url : '/'} onClick={(e) => {
              // const currentUrl = e.target.href

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
        // pages={pages}
            setActivePage={setActivePage}
            setCurrentId={setCurrentId}
            currentId={currentId}
            setMenuScrollPosition={setMenuScrollPosition}
        // isTopLevel={isTopLevel}
      />
    </div>
  )
}

export default Menu
