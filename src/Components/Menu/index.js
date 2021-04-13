import {connect} from 'react-redux'
import Menu from './Menu'

import {
  topLevelIdsSelector,
  pageListSelector,
  setActivePage,
  activePagesSelector,
} from 'modules/pages'

export default connect(state => ({
  pageList: pageListSelector(state),
  activePages: activePagesSelector(state),
  topLevelIds: topLevelIdsSelector(state),
}), {
  setActivePage,
})(Menu)