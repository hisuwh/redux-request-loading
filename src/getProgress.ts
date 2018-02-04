export const getProgress = (total: number, activeRequests: string[]) => {

    if (total === 0) {
        return 100;
    }
    return ((total - activeRequests.length) / total) * 100;
};
