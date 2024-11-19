import { USER_DATA } from "../actions/types"

const initialState = {
    userData: {},
    isLoggedIn: false
}

const userDataReducers = (state = initialState, action) => {
    switch(action.type) {
        case USER_DATA : 
            return {
                ...state,
                userData : {
                    ...state.userData
                }
            }
        default:
            return state;
    }
}


export default userDataReducers;