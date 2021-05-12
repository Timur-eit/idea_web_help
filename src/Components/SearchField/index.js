import { connect } from 'react-redux'
import SearchField from './SearchField'
import { withRouter } from 'react-router'

import {
    pageListSelector,
    activePagesSelector,
    topLevelIdsSelector,
    setFoundId
} from 'modules/pages'

let SearchFieldContainer = connect(
    (state) => ({
        pageList: pageListSelector(state),
        activePages: activePagesSelector(state),
        topLevelIds: topLevelIdsSelector(state),
    }),
    {  
        setFoundId,
    }
)(SearchField)

SearchFieldContainer = withRouter(SearchFieldContainer)

export default SearchFieldContainer
