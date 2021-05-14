import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated, config } from 'react-spring'
import './style.scss'

function Content({ pageList, routerPage, currentId }) {
    const anchors = pageList.entities.anchors

    const [flip, set] = useState(false)
    const props = useSpring({
        to: { opacity: 1 },
        from: { opacity: 0 },
        reset: true,
        reverse: flip,
        delay: 200,
        config: config.molasses,
        onRest: () => set(!flip),
    })

    return (
        <div className="content__container">
            <div className="content">
                <animated.h1 style={!currentId ? props : null}>Web-Help Visual Guidelines</animated.h1>
                {routerPage && currentId ? (
                    routerPage.map((anchorId) => {
                        const url = anchors[anchorId].url
                        const title = anchors[anchorId].title
                        const currentAnchor = anchors[anchorId].anchor
                        return (
                            <h2 key={anchorId}>
                                <Link to={`${url}${currentAnchor}`}>{title}</Link>
                            </h2>
                        )
                    })
                ) : (
                    <animated.h3 style={!currentId ? props : null}>Please select an item from menu on the left</animated.h3>
                )}
            </div>
        </div>
    )
}

export default Content
