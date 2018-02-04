import { createSelector } from "reselect";
import { LoadingState } from "./model";

const activeRequests = (state: LoadingState) => state.loading.activeRequests;

const requestActive = (requests: string[], request?: string) => request === undefined
    ? requests.length > 0
    : requests.filter(r => r === request).length > 0;

const requestsActive = (requests: string[], queryRequests: string[]) => queryRequests.length === 0
    ? requests.length > 0
    : requests.filter(r => queryRequests.some(q => q === r)).length > 0;

export const isRequestActive = (state: LoadingState, request?: string) => requestActive(activeRequests(state), request);
export const areRequestsActive = (state: LoadingState, requests: string[] = []) => requestsActive(activeRequests(state), requests);

export const makeIsRequestActive = (request?: string) => createSelector(
    activeRequests,
    requests => requestActive(requests, request)
);

export const makeAreRequestsActive = (requests: string[] = []) => createSelector(
    activeRequests,
    r => requestsActive(r, requests)
);
