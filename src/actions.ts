import { Dispatch } from "redux";

import * as actions from "./actionTypes";

export type LoadingAction =
    ({ type: actions.LOADING, request: string })
  | ({ type: actions.LOAD_ERROR, request: string })
  | ({ type: actions.LOAD_SUCCESS, request: string });

export const loading = (request: string): LoadingAction => ({ type: actions.LOADING, request });
export const loadError = (request: string): LoadingAction => ({ type: actions.LOAD_ERROR, request });
export const loadSuccess = (request: string): LoadingAction => ({ type: actions.LOAD_SUCCESS, request });

export const loadAndTrack = <T>(dispatch: Dispatch<{}>, request: string, promise: Promise<T>) => {
    dispatch(loading(request));

    return promise
        .then(result => {
            dispatch(loadSuccess(request));
            return result;
        })
        .catch(error => {
            dispatch(loadError(request));
            throw error;
        });
};
