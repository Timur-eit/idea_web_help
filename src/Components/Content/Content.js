import React from 'react'
import {
  Switch,
  Route,
} from "react-router-dom";
import './style.scss'

function Content({
                  pageList,
                  currentLink
}) {

  // const pages = pageList.entities.pages

  return (
    <div className='content__container'>
    <div className='content'>Web-Help Visual Guidelines</div>
      <Switch>
        <Route path={currentLink.url}>
          {/* <div>{pages[currentLink.id].anchors ? pages[currentLink.id].anchors : null}</div> */}
          {currentLink.id}
        </Route>
      </Switch>
    </div>
  )
}


export default Content