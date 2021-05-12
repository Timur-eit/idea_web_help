import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated, config } from 'react-spring'
import './style.scss'

function Content({ pageList, routerPage, currentId }) {
    // console.log(routerPage)

    const anchors = pageList.entities.anchors
    // const currentIdAnchors = routerPage
    // const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })

    const [flip, set] = useState(false)
    const props = useSpring({
        to: { opacity: 1 },
        from: { opacity: 0 },
        // reset: wtrue,
        reverse: flip,
        delay: 200,
        config: config.molasses,
        onRest: () => set(!flip),
    })

    return (
        <div className="content__container">
            {/* <animated.div style={props}>I will fade in</animated.div> */}
            <div className="content">
                <animated.h1 style={props}>Web-Help Visual Guidelines</animated.h1>
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
                    <h3>Please select an item from menu on the left</h3>
                )}
            </div>
        </div>
    )
}

export default Content
