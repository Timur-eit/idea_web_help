import {connect} from 'react-redux'
import Menu from './Menu'

import {
  topLevelIdsSelector,
  pageListSelector,
  setActivePage,
  activePageSelector,
} from '../../modules/pages'

export default connect(state => ({
  pageList: pageListSelector(state),
  activePage: activePageSelector(state),
  topLevelIds: topLevelIdsSelector(state),
}), {
  setActivePage,
})(Menu)