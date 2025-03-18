import { USER_DATA, AUTH, AUTH_TOKEN } from "../actions/types";

const initialState = {
    userData: {},
    isAuthenticated: false,  // Fixed typo
    authToken: null
};

const userDataReducers = (state = initialState, action) => {
    switch (action.type) {
        case USER_DATA:
            return {
                ...state,
                userData: action.payload  // Update userData with payload
            };
        case AUTH:
            return {
                ...state,
                isAuthenticated: action.payload  // Fixed typo
            };
        case AUTH_TOKEN:
            return {
                ...state,
                authToken: action.payload
            };
        default:
            return state;
    }
};

export default userDataReducers;
