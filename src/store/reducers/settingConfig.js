import { APP_THEAM } from "../actions/types";


const initialState = {
    theme: "light"
}

const settings = (state = initialState, action) => {
    switch(action.type) {
        case APP_THEAM : 
            return {
                ...state,
                theme: action.payload
            }
        default:
            return state;
    }
}


export default settings;