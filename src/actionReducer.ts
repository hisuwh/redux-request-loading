import * as actions from "./actionsTypes";
import { Loading } from "./model";
import { LoadingAction } from "./actions";
import { requestStart } from "./requestStart";
import { requestFinish } from "./requestFinish";

export const defaultState: Loading = {
    active: false,
    activeRequests: [],
    total: 0,
    progress: 0
};

export const loading = (state: Loading = defaultState, action: LoadingAction): Loading => {
    switch (action.type) {
        case actions.LOADING:
            return requestStart(state, action.request);
        case actions.LOAD_SUCCESS:
        case actions.LOAD_ERROR:
            return requestFinish(state, action.request);
        default:
            return state;
    }
};
