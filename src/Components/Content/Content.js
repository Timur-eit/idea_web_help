import React from 'react'
import {Route, Switch} from "react-router-dom"
import './style.scss'

function Content({
                   routerPage,
                   currentLink
                 }) {

  // const pages = pageList.entities.pages
  

  return (
    <div className='content__container'>
      <div className='content'>Web-Help Visual Guidelines</div>
      {/*<Switch>*/}
      {/*  <Route path={currentLink.url}>*/}
          <div>
            Test: {currentLink.id} <br/>
            {routerPage.join(', ')}
          </div>
      {/*  </Route>*/}
      {/*</Switch>*/}
    </div>
  )
}


export default Content