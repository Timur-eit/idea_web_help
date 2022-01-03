import { combineReducers } from 'redux';
import pagesReducer, { moduleName as pageModule } from '../modules/pages';
import { connectRouter } from 'connected-react-router';
import history from '../history';
import { reducer as reduxFormReducer } from 'redux-form';

export default combineReducers({
    router: connectRouter(history),
    [pageModule]: pagesReducer,
    form: reduxFormReducer,
});
