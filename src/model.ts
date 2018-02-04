export interface Loading {
    readonly active: boolean;
    readonly activeRequests: string[];
    readonly progress: number;
    readonly total: number;
}

export interface LoadingState {
    loading: Loading;
}
