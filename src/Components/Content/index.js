import {connect} from 'react-redux'
import Content from './Content'

import {
  topLevelIdsSelector,
  pageListSelector,
  setActivePage,
  activePagesSelector,
  currentLinkSelector,
  routerPageSelector
} from 'modules/pages'

export default connect(state => ({
  pageList: pageListSelector(state),
  activePages: activePagesSelector(state),
  topLevelIds: topLevelIdsSelector(state),
  currentLink: currentLinkSelector(state),
  routerPage: routerPageSelector(state),
}), {
  setActivePage,
})(Content)