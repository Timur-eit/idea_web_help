import { connect } from 'react-redux'
import Content from './Content'

import {
    topLevelIdsSelector,
    pageListSelector,
    setActivePage,
    activePagesSelector,
    currentIdSelector,
    routerPageSelector,
} from 'modules/pages'

export default connect(
    (state) => ({
        pageList: pageListSelector(state),
        activePages: activePagesSelector(state),
        topLevelIds: topLevelIdsSelector(state),
        currentId: currentIdSelector(state),
        routerPage: routerPageSelector(state),
    }),
    {
        setActivePage,
    }
)(Content)
