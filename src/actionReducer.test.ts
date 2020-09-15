import { Expect, Test, TestFixture } from "alsatian";
import * as actions from "./actions";
import { loading, defaultState } from "./actionReducer";

@TestFixture("actionReducer")
export class ActionReducerTests {

    @Test("should return current state if non matching action")
    public shouldReturnDefault() {
        const result = loading(defaultState, { type: "anything" } as any);
        Expect(result).toEqual(defaultState);
    }

    @Test("should update active and active requests for loading")
    public shouldUpdateForLoading() {
        const result = loading(defaultState, actions.loading("TEST_REQUEST"));

        Expect(result).toEqual({
            active: true,
            activeRequests: ["TEST_REQUEST"],
            progress: 0,
            total: 1
        });
    }

    @Test("should update active and active requests for success")
    public shouldUpdateForSuccess() {
        const result = loading({
            active: true,
            activeRequests: ["TEST_REQUEST"],
            progress: 100,
            total: 1
        }, actions.loadSuccess("TEST_REQUEST"));

        Expect(result).toEqual({
            active: false,
            activeRequests: [],
            progress: 100,
            total: 0
        });
    }

    @Test("should update active and active requests for error")
    public shouldUpdateForError() {
        const result = loading({
            active: true,
            activeRequests: ["TEST_REQUEST"],
            progress: 100,
            total: 1
        }, actions.loadError("TEST_REQUEST"));

        Expect(result).toEqual({
            active: false,
            activeRequests: [],
            progress: 100,
            total: 0
        });
    }

    @Test("should update active and activeRequests for multiple loading actions")
    public shouldUpdateForMultipleLoading() {
        const result1 = loading(defaultState, actions.loading("TEST_REQUEST"));
        const result = loading(result1, actions.loading("TEST_REQUEST2"));

        Expect(result).toEqual({
            active: true,
            activeRequests: ["TEST_REQUEST", "TEST_REQUEST2"],
            progress: 0,
            total: 2
        });
    }

    @Test("should update percentage correctly at each point")
    public shouldUpdatePercentageCorrectly() {

        const initialState = {
            active: true,
            activeRequests: ["TEST_REQUEST", "TEST_REQUEST2", "TEST_REQUEST3", "TEST_REQUEST4"],
            progress: 0,
            total: 4
        };

        const result1 = loading(initialState, actions.loadSuccess("TEST_REQUEST"));

        Expect(result1).toEqual({
            active: true,
            activeRequests: ["TEST_REQUEST2", "TEST_REQUEST3", "TEST_REQUEST4"],
            progress: 25,
            total: 4
        });

        const result2 = loading(result1, actions.loadSuccess("TEST_REQUEST2"));

        Expect(result2).toEqual({
            active: true,
            activeRequests: ["TEST_REQUEST3", "TEST_REQUEST4"],
            progress: 50,
            total: 4
        });

        const result3 = loading(result2, actions.loadSuccess("TEST_REQUEST3"));

        Expect(result3).toEqual({
            active: true,
            activeRequests: ["TEST_REQUEST4"],
            progress: 75,
            total: 4
        });

        const result4 = loading(result3, actions.loadSuccess("TEST_REQUEST4"));

        Expect(result4).toEqual({
            active: false,
            activeRequests: [],
            progress: 100,
            total: 0
        });
    }

    @Test("should count duplicate requests separately")
    public duplicateRequests() {
        const result1 = loading(defaultState, actions.loading("TEST_REQUEST"));
        const result2 = loading(result1, actions.loading("TEST_REQUEST"));

        Expect(result2).toEqual({
            active: true,
            activeRequests: ["TEST_REQUEST", "TEST_REQUEST"],
            progress: 0,
            total: 2
        });
    }

    @Test("should only finish one duplicate request")
    public finishDuplicateRequest() {
        const initialState = {
            active: true,
            activeRequests: ["TEST_REQUEST", "TEST_REQUEST"],
            progress: 0,
            total: 2
        };

        const result = loading(initialState, actions.loadSuccess("TEST_REQUEST"));

        Expect(result).toEqual({
            active: true,
            activeRequests: ["TEST_REQUEST"],
            progress: 50,
            total: 2
        });
    }

    @Test("should update progress when new request starts")
    public shouldUpdateProgress() {
        const initialState = {
            active: true,
            activeRequests: ["TEST_REQUEST", "TEST_REQUEST2", "TEST_REQUEST3"],
            progress: 25,
            total: 4
        };

        const result = loading(initialState, actions.loading("TEST_REQUEST"));

        Expect(result).toEqual({
            active: true,
            activeRequests: ["TEST_REQUEST", "TEST_REQUEST2", "TEST_REQUEST3", "TEST_REQUEST"],
            progress: 20,
            total: 5
        });
    }

}
