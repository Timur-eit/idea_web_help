import React from "react"
import 'App.scss'
import Menu from 'Components/Menu'
import Content from 'Components/Content'
//import {Switch, Route, Router} from "react-router-dom"

function App() {

  return (
    <div className="App">
      {/* <Router> */}
        <Menu />
        {/* <Switch> */}
          {/* <Route path="/"> */}
            <Content />
          {/* </Route> */}
        {/* </Switch> */}
      {/* </Router> */}
    </div>
  )
}


export default App

