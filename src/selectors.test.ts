import { AsyncTest, Expect, Test, TestCase, TestFixture, SpyOn } from "alsatian";

import {
    areRequestsActive,
    isRequestActive,
    makeAreRequestsActive,
    makeIsRequestActive
} from "./selectors";

@TestFixture("Selector")
export class SelectorTests {

    @Test("should return true for active request")
    public isRequestActiveTrue() {

        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST"],
                progress: 0,
                total: 1
            }
        };

        const result = isRequestActive(state, "TEST_REQUEST");
        Expect(result).toBeTruthy();
    }

    @Test("should return false for inactive request")
    public isRequestActiveFalse() {

        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST"],
                progress: 0,
                total: 1
            }
        };

        const result = isRequestActive(state, "SOMETHING_ELSE");
        Expect(result).not.toBeTruthy();
    }

    @Test("should return true for no request if any active")
    public isRequestActiveTrueWithoutRequest() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST"],
                progress: 0,
                total: 1
            }
        };

        const result = isRequestActive(state);
        Expect(result).toBeTruthy();
    }

    @Test("should return true for all requests active")
    public shouldReturnTrueForAllRequests() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST", "TEST_REQUEST2", "TEST_REQUEST3"],
                progress: 0,
                total: 3
            }
        };

        const result = areRequestsActive(state, ["TEST_REQUEST", "TEST_REQUEST2"]);
        Expect(result).toBeTruthy();
    }

    @Test("should return true for some requests active")
    public shouldReturnTrueForSomeRequests() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST", "TEST_REQUEST3"],
                progress: 0,
                total: 2
            }
        };

        const result = areRequestsActive(state, ["TEST_REQUEST", "TEST_REQUEST2"]);
        Expect(result).toBeTruthy();
    }

    @Test("should return false for no requests active")
    public shouldReturnFalseForNoRequestsActive() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST", "TEST_REQUEST2"],
                progress: 0,
                total: 2
            }
        };

        const result = areRequestsActive(state, ["TEST_REQUEST3", "TEST_REQUEST4"]);
        Expect(result).not.toBeTruthy();
    }

    @Test("should return true for no requests")
    public shouldReturnTrueForNoRequests() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST", "TEST_REQUEST2"],
                progress: 0,
                total: 2
            }
        };

        const result = areRequestsActive(state);
        Expect(result).toBeTruthy();
    }
}

// tslint:disable max-classes-per-file
@TestFixture("Memoized Selectors")
export class MemoizedSelectorTests {

    @Test("should return true for active request")
    public isRequestActiveTrue() {

        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST"],
                progress: 0,
                total: 1
            }
        };

        const memoizedIsRequestActive = makeIsRequestActive("TEST_REQUEST");

        const result = memoizedIsRequestActive(state);
        Expect(result).toBeTruthy();

        const result2 = memoizedIsRequestActive(state);
        Expect(result2).toBeTruthy();

        Expect(memoizedIsRequestActive.recomputations()).toBe(1);
    }

    @Test("should return false for inactive request")
    public isRequestActiveFalse() {

        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST"],
                progress: 0,
                total: 1
            }
        };

        const memoizedIsRequestActive = makeIsRequestActive("SOMETHING_ELSE");

        const result = memoizedIsRequestActive(state);
        Expect(result).not.toBeTruthy();

        const result2 = memoizedIsRequestActive(state);
        Expect(result2).not.toBeTruthy();

        Expect(memoizedIsRequestActive.recomputations()).toBe(1);
    }

    @Test("should return true for no request if any active")
    public isRequestActiveTrueWithoutRequest() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST"],
                progress: 0,
                total: 1
            }
        };

        const memoizedIsRequestActive = makeIsRequestActive();

        const result = memoizedIsRequestActive(state);
        Expect(result).toBeTruthy();

        const result2 = memoizedIsRequestActive(state);
        Expect(result).toBeTruthy();

        Expect(memoizedIsRequestActive.recomputations()).toBe(1);
    }

    @Test("should return true for all requests active")
    public shouldReturnTrueForAllRequests() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST", "TEST_REQUEST2", "TEST_REQUEST3"],
                progress: 0,
                total: 3
            }
        };

        const memoizedAreRequestsActive = makeAreRequestsActive(["TEST_REQUEST", "TEST_REQUEST2"]);

        const result = memoizedAreRequestsActive(state);
        Expect(result).toBeTruthy();

        const result2 = memoizedAreRequestsActive(state);
        Expect(result2).toBeTruthy();

        Expect(memoizedAreRequestsActive.recomputations()).toBe(1);
    }

    @Test("should return true for some requests active")
    public shouldReturnTrueForSomeRequests() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST", "TEST_REQUEST3"],
                progress: 0,
                total: 2
            }
        };

        const memoizedAreRequestsActive = makeAreRequestsActive(["TEST_REQUEST", "TEST_REQUEST2"]);

        const result = memoizedAreRequestsActive(state);
        Expect(result).toBeTruthy();

        const result2 = memoizedAreRequestsActive(state);
        Expect(result2).toBeTruthy();

        Expect(memoizedAreRequestsActive.recomputations()).toBe(1);
    }

    @Test("should return false for no requests active")
    public shouldReturnFalseForNoRequestsActive() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST", "TEST_REQUEST2"],
                progress: 0,
                total: 2
            }
        };

        const memoizedAreRequestsActive = makeAreRequestsActive(["TEST_REQUEST3", "TEST_REQUEST4"]);

        const result = memoizedAreRequestsActive(state);
        Expect(result).not.toBeTruthy();

        const result2 = memoizedAreRequestsActive(state);
        Expect(result2).not.toBeTruthy();

        Expect(memoizedAreRequestsActive.recomputations()).toBe(1);
    }

    @Test("should return true for no requests")
    public shouldReturnTrueForNoRequests() {
        const state = {
            loading: {
                active: true,
                activeRequests: ["TEST_REQUEST", "TEST_REQUEST2"],
                progress: 0,
                total: 2
            }
        };

        const memoizedAreRequestsActive = makeAreRequestsActive();

        const result = memoizedAreRequestsActive(state);
        Expect(result).toBeTruthy();

        const result2 = memoizedAreRequestsActive(state);
        Expect(result2).toBeTruthy();

        const result3 = memoizedAreRequestsActive(state);
        Expect(result3).toBeTruthy();

        Expect(memoizedAreRequestsActive.recomputations()).toBe(1);
    }
}
