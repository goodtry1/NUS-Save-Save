import loginReducer from './loginReducer'
import { combineReducers } from 'redux'

const combinedReducer = combineReducers({
    isLoggedIn : loginReducer
})

export default combinedReducer