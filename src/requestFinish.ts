import { Loading } from "./model";
import { getProgress } from "./getProgress";

export const requestFinish = (state: Loading, request: string): Loading => {
    const index = state.activeRequests.indexOf(request);
    const activeRequests = [...state.activeRequests];

    if (index !== -1) {
        activeRequests.splice(index, 1);
    }

    const progress = getProgress(state.total, activeRequests);
    const active = activeRequests.length > 0;
    const total = active ? state.total : 0;

    return {
        active,
        activeRequests,
        progress,
        total
    };
};
