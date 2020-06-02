import userSessionReducer from './userSessionReducer'
import { combineReducers } from 'redux'

const combinedReducer = combineReducers({
    userSession : userSessionReducer
})

export default combinedReducer