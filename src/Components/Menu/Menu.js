import './style.scss'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import Mousetrap from 'mousetrap'
import { batch } from 'react-redux'
import { Fragment, useCallback, useMemo, useState, useEffect } from 'react'
import { getCoords, ArrowKeysHandler, setMenuScrollHandler } from 'utils'
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
        clickedId,
        setClickedId,
        foundId,
        setFoundId
    } = props

    const pages = pageList.entities.pages
    const isNested = useCallback((id) => pages[id].pages && pages[id].pages.length > 0, [pages])
    const elementDomParams = useMemo(
        () => currentId && getCoords(document.getElementById(currentId)),
        [currentId]
    )
    const onKeyDownArrowKeysHandler = useMemo(() => {
        return new ArrowKeysHandler(
            pageList,
            pages,
            currentId,
            activePages,
            setCurrentId,
            setActivePage,
            isNested
        )
    }, [pageList, pages, currentId, activePages, setCurrentId, setActivePage, isNested])

    const setMenuScroll = useCallback(
        () => setMenuScrollHandler(setMenuScrollPosition),
        [setMenuScrollPosition]
    )

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
    // const [highlightId, setHighlight] = useState([])

    // const setHighlightHandler = useCallback((id) => {
    //     const newHighlightId = [...highlightId, id]
    //     setHighlight(() => newHighlightId)
    // }, [highlightId, setHighlight])

    useEffect(() => {
        if (clickedId.length > 0 && arrowPosition < 180) {
            setArrowPosition(arrowPosition + 20)
        }

        if (foundId.length > 0) {
            // console.log('xxx')
            
            foundId.forEach(id => {
                if (pages[id].parentId === undefined) {
                    setClickedId(pages[id])
                } else {
                    // setHighlightHandler(id)
                    // console.log('lll')
                    const depth = pages[id].level
                    // console.log(depth)

                    let currentId = pages[id]
                    for (let i = depth; i >= 0; i--) {
                        const parentId = currentId.parentId
                        setActivePage(parentId)
                        setClickedId(parentId)
                        currentId = pages[parentId]
                    }
                }
            })
        } else if (foundId.length === 0 && clickedId.length === 0) {
            // setClickedId('')

        }
    }, [clickedId.length, arrowPosition, foundId, pages, setActivePage, setClickedId])

    // console.log(foundId)

    return (
        <div className="menu">
            {topLevelIds.map((id) => {
                const url = pages[id].url

                const arrowClasses = classNames({
                    'disclose-arrow': true,
                    'hidden': !isNested(id),
                    'rotated': activePages.includes(id),
                })

                const linkClasses = classNames({
                    'nested-link': !isNested(id),
                    'selected-link': currentId && currentId === id,
                })

                const linkBgClasses = classNames({
                    'link-background': true,
                    'active': currentId && currentId === id,
                    'highlighted': foundId.includes(id)
                })

                return (
                    <Fragment key={id}>
                        <div
                            className={linkBgClasses}
                            style={{
                                height: elementDomParams ? elementDomParams.height : 0,
                            }}
                        ></div>

                        <Link
                            id={id}
                            className={linkClasses}
                            to={url ? url : '/'}
                            onClick={() => {
                                batch(() => {
                                    setCurrentId(id)
                                    isNested(id) && setActivePage(id)
                                    setClickedId(id)
                                    setFoundId({})
                                })

                                // console.log(clickedId)
                            }}
                        >
                            <div
                                className={arrowClasses}
                                style={
                                    clickedId[clickedId.length - 1] === id
                                        ? {
                                              transform: `rotate(-${arrowPosition}deg)`,
                                          }
                                        : null
                                }
                            ></div>
                            {pages[id].title}
                        </Link>

                        {isNested(id) && activePages.includes(id) && (
                            <div className="submenu">
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
                                    foundId={foundId}
                                    setFoundId={setFoundId}
                                />
                            </div>
                        )}
                    </Fragment>
                )
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
    foundId,
    setFoundId
}) {
    const [menuScrollPosition, setMenuScrollPosition] = useState(0)

    useEffect(() => {
        document.querySelector('.menu-list__container').scrollTop = menuScrollPosition
    }, [menuScrollPosition])

    // console.log(foundId)

    return (
        <div className="menu-list__container">
            <SearchFieldContainer />
            <List
                key={activePages}
                activePages={activePages}
                pageList={pageList}
                topLevelIds={topLevelIds}
                setActivePage={setActivePage}
                setCurrentId={setCurrentId}
                currentId={currentId}
                setMenuScrollPosition={setMenuScrollPosition}
                clickedId={clickedId}
                setClickedId={setClickedId}
                foundId={foundId}
                setFoundId={setFoundId}
            />
        </div>
    )
}

export default Menu
