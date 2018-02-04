import * as actions from "./actionsTypes";

export type LoadingAction =
    ({ type: actions.LOADING, request: string })
  | ({ type: actions.LOAD_ERROR, request: string })
  | ({ type: actions.LOAD_SUCCESS, request: string });

export const loading = (request: string): LoadingAction => ({ type: actions.LOADING, request });
export const loadError = (request: string): LoadingAction => ({ type: actions.LOAD_ERROR, request });
export const loadSuccess = (request: string): LoadingAction => ({ type: actions.LOAD_SUCCESS, request });
