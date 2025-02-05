import { USER_DATA, AUTH } from "../actions/types"

const initialState = {
    userData: {},
    isAunthenicated: false
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
        case AUTH : {
            return {
                ...state,
                isAunthenicated: action.payload.isAunthenicated
            }
        }
        default:
            return state;
    }
}


export default userDataReducers;