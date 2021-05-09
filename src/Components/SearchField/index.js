import {connect} from 'react-redux'
import SearchField from './SearchField'
import { withRouter } from 'react-router'

import {
  pageListSelector,
  filterData,
  setActivePage,
  activePagesSelector,
  getSearchedData,
  topLevelIdsSelector
} from 'modules/pages'

let SearchFieldContainer = connect(state => ({
  pageList: pageListSelector(state),
  activePages: activePagesSelector(state),
  topLevelIds: topLevelIdsSelector(state),
}), {
  filterData,
  setActivePage,
  getSearchedData,
})(SearchField)

SearchFieldContainer = withRouter(SearchFieldContainer)

export default SearchFieldContainer
