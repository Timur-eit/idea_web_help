import React from 'react'
import {Link} from 'react-router-dom'
import './style.scss'

function Content({
                  pageList,
                  routerPage,
                  currentId,
                 }) {

  console.log(routerPage)

  const anchors = pageList.entities.anchors
  // const currentIdAnchors = routerPage
    
  return (
    <div className='content__container'>
      <div className='content'>
        <h1>Web-Help Visual Guidelines</h1>
        {routerPage && currentId
        ? routerPage.map(anchorId => {
          const url = anchors[anchorId].url
          const title = anchors[anchorId].title
          const currentAnchor = anchors[anchorId].anchor
          return <h2 key={anchorId}><Link to={`${url}${currentAnchor}`}>{title}</Link></h2>
        })
        : <h3>Please select an item from menu on the left</h3>}
      </div>
    </div>
  )
}


export default Content