import React, { /** useEffect */ } from "react"
import 'App.scss'
import Menu from 'Components/Menu'
import Content from 'Components/Content'

//  import { connect } from 'react-redux'


function App({
  topLevelIds
}) {

  // useEffect(() => {
  //   // initialize something - topId ?
  // }, [])

  return (
    <div className="App">
      <Menu />
      <Content />
    </div>
  )
}


export default App

// export default connect(state => ({
  // ?
// }), {
  // ?
// })(App)

