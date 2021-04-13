import React from "react"
import 'App.scss'
import Menu from 'Components/Menu'
import Content from 'Components/Content'
import {Switch, Route} from "react-router-dom"

function App() {

  return (
    <div className="App">
      <Menu />
      <Switch>
        <Route path="/">
          <Content />
        </Route>
      </Switch>
    </div>
  )
}


export default App

