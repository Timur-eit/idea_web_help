import {connect} from 'react-redux'
import SearchField from './SearchField'
import { withRouter } from 'react-router'

import {
  pageListSelector,
  setActivePage,
  activePagesSelector,
} from 'modules/pages'

let SearchFieldContainer = connect(state => ({
  pageList: pageListSelector(state),
  activePages: activePagesSelector(state),
}), {
  setActivePage,
})(SearchField)

SearchFieldContainer = withRouter(SearchFieldContainer)

export default SearchFieldContainer
