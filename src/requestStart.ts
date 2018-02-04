import { Loading } from "./model";
import { getProgress } from "./getProgress";

export const requestStart = (state: Loading, request: string): Loading => {

    const activeRequests = [...state.activeRequests, request];
    const total = state.total + 1;
    const progress = getProgress(total, activeRequests);

    return {
        active: true,
        activeRequests,
        progress,
        total
    };
};
