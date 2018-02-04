// tslint:disable max-classes-per-file
import { Dispatch } from "redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "./actions";
import * as types from "./actionTypes";

import { AsyncTest, Expect, Test, TestCase, TestFixture, SpyOn } from "alsatian";

@TestFixture("Actions")
export class ActionsTests {

    @TestCase(actions.loading("TEST"), { request: "TEST", type: types.LOADING })
    @TestCase(actions.loadSuccess("TEST"), { request: "TEST", type: types.LOAD_SUCCESS })
    @TestCase(actions.loadError("TEST"), { request: "TEST", type: types.LOAD_ERROR })
    public simpleActionCreation(action: actions.LoadingAction, expectedAction: actions.LoadingAction) {

        Expect(action).toEqual(expectedAction);
    }
}

@TestFixture("Async actions")
export class AsyncActionTests {

    private mockStore;

    constructor() {
        const middlewares = [thunk];
        this.mockStore = configureMockStore(middlewares);
    }

    @AsyncTest("should dispatch loading and success for resolved promise")
    public async shouldDispatchLoadingAndSuccess() {

        const store = this.mockStore({});

        const data = { test: 1 };
        const promise = Promise.resolve(data);

        const testAction = () => (dispatch: Dispatch<{}>) => actions.loadingHelper(dispatch, "TEST", promise);

        const result = await store.dispatch(testAction());

        Expect(store.getActions()).toEqual([
            actions.loading("TEST"),
            actions.loadSuccess("TEST")
        ]);

        Expect(result).toBe(data);
    }

    @AsyncTest("should dispatch loading and error for rejected promise")
    public async shouldDispatchLoadingAndError() {

        const store = this.mockStore({});

        const error = "TEST_ERROR";
        const promise = Promise.reject(error);

        const testAction = () => (dispatch: Dispatch<{}>) => actions.loadingHelper(dispatch, "TEST", promise);

        try {
            await store.dispatch(testAction());
        } catch (result) {

            Expect(result).toBe(error);
        }

        Expect(store.getActions()).toEqual([
            actions.loading("TEST"),
            actions.loadError("TEST")
        ]);
    }
}
