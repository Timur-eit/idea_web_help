import React from 'react'
import './style.scss'

function Content({
                   routerPage,
                   currentLink = {}
                 }) {

  return (
    <div className='content__container'>
      <div className='content'>
        Web-Help Visual Guidelines
        Test: {currentLink && currentLink.id} <br/>
        {routerPage.join(', ')}
      </div>
    </div>
  )
}


export default Content