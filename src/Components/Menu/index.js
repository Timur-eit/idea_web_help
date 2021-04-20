import {connect} from 'react-redux'
import Menu from './Menu'

import {
  topLevelIdsSelector,
  pageListSelector,
  setActivePage,
  activePagesSelector,
  
  currentIdSelector,
  setCurrentId,

} from 'modules/pages'

export default connect(state => ({
  pageList: pageListSelector(state),
  activePages: activePagesSelector(state),
  topLevelIds: topLevelIdsSelector(state),
  currentId: currentIdSelector(state),
}), {
  setActivePage,
  setCurrentId,
})(Menu)