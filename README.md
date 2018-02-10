# redux-request-loading

[![Build Status](https://travis-ci.org/hisuwh/redux-request-loading.svg?branch=master)](https://travis-ci.org/hisuwh/redux-request-loading)
[![npm version](https://badge.fury.io/js/redux-request-loading.svg)](https://badge.fury.io/js/redux-request-loading)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/hisuwh/redux-request-loading/blob/master/LICENSE.md)

**redux-request-loading** provides actions and reducers to track the loading state of your application.  What makes it different is that it tracks each individual request not just the overall state.  This allows you to monitor the state of specific requests you care about in your components and display the loading state accordingly.  I.e. your post has loaded but the comments are still loading.

## Installation

`npm install redux-request-loading`

> Note: the package includes typings for Typescript

## Setup

Add the loading reducer to your store:

```js
import { createStore, combineReducers } from "redux";
import { reducer as loading } from "redux-request-loading";

const store = createStore(
    combineReducers({
        anotherReducer
        loading
    })
);
```

Modify your code making asynchronous requests to dispatch the appropriate actions.  E.g. using [redux-thunk](https://github.com/gaearon/redux-thunk):

```js
import { loading, loadSuccess, loadError } from "redux-request-loading";

export function loadComments() {
    const COMMENTS = "COMMENTS";

    return (dispatch) => {
        dispatch(loading(COMMENTS));

        return fetch("/comments")
            .then(comments => {
                dispatch(loadCommentsSuccess(comments));
                dispatch(loadSuccess(COMMENTS));
            })
            .catch(error => {
                dispatch(loadError(COMMENTS));
                throw error;
            });
    };
}
```

Or use the `loadAndTrack` method:

```js
import { loadAndTrack } from "redux-request-loading";

export function loadComments() {
    return (dispatch) => loadAndTrack(dispatch, "COMMENTS", fetch("/comments"))
        .then(comments => dispatch(loadCommentsSuccess(comments));
}

```

> `loadAndTrack` replaces `loadingHelper` which is now deprecated and will be removed in version 2.0.0

## Checking state of request

Use the `isRequestActive` *selector* to check the state of your request

```jsx
import { isRequestActive } from "redux-request-loading";

const Comments = (props) => (
  <div>
    {props.loading ? "Comments loading..." : "Comments loaded!"}
  </div>
);

const mapStateToProps = (state) => ({
  loading: isRequestActive(state, "COMMENTS");
});

export default connect(mapStateToProps)(Comments);
```

## Selectors

### isRequestActive

Check whether a request is active.
Returns `true` if request is active, false if not.  If no request is passed it will return `true` if any requests are active.

```js
import { loading, isRequestActive } from "redux-request-loading";

store.dispatch(loading("POSTS"));

const postsLoading = isRequestActive(store.getState(), "POSTS");  // true
const commentsLoading = isRequestActive(store.getState(), "COMMENTS"); // false
const loading = isRequestActive(store.getState()); // true
```

### areRequestsActive

Allows you to check if any of a list requests are active.

```js
import { loading, areRequestsActive } from "redux-request-loading";

store.dispatch(loading("POSTS"));

const postsLoading = areRequestsActive(store.getState(), ["POSTS"]);  // true
const commentsLoading = areRequestsActive(store.getState(), ["COMMENTS"]); // false
const postsLoading = areRequestsActive(store.getState(), ["POSTS", "COMMENTS"]);  // true
const loading = areRequestsActive(store.getState()); // true
```

### getProgress

Gets the progress of all requests as a percentage (i.e. `100` when finished).

```js
import { loading, loadSuccess, getProgress } from "redux-request-loading";

store.dispatch(loading("POSTS"));
store.dispatch(loading("COMMENTS"));

let progress = getProgress(store.getState()); // 0

store.dispatch(loadSuccess("POSTS"));

progress = getProgress(store.getState()); // 50

store.dispatch(loadSuccess("COMMENTS"));

progress = getProgress(store.getState()); // 100
```

## Memoized Selectors

Using [reselect](https://github.com/reactjs/reselect) there are factory functions for memoized versions of `isRequestActive` and `areRequestsActive`.  The returned functions will only calculate once when called multiple times for the same state - offering a peformance improvement.  Read more about this concept on the [reselect](https://github.com/reactjs/reselect) GitHub page.

### makeIsRequestActive

```js
import { makeIsRequestActive } from "redux-request-loading";

// component definition

const makeMapStateToProps = () => {

  const isRequestActive = makeIsRequestActive("COMMENTS");

  return (state) => ({
    loading: isRequestActive(state);
  });
};

export default connect(makeMapStateToProps)(Comments);

```

### makeAreRequestsActive

```js
import { makeAreRequestsActive } from "redux-request-loading";

// component definition

const makeMapStateToProps = () => {

  const areRequestsActive = makeAreRequestsActive(["POSTS", "COMMENTS"]);

  return (state) => ({
    loading: areRequestsActive(state);
  });
};

export default connect(makeMapStateToProps)(Comments);

```
