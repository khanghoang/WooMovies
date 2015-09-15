var types = require('../actions/counterActions.js')
import superagent from 'superagent';
import { combineReducers } from 'redux';

import _ from 'lodash';

function homepage(state = {}, action) {
  switch (action.type) {
    case types.REQUEST_HOMEPAGE: {
      return Object.assign({}, {
        isLoading: true
      });
    }
      break;
    case types.RECEIVE_HOMEPAGE: {
      return Object.assign({}, {
        data: action.data,
        error: action.error,
        isLoading: false
      })
    }
      break;

    default:{
      return state;
    }
  }
}

function test(state = {text: "done"}, action) {
  switch (action.type) {
    case types.REQUEST_HOMEPAGE: {
      return Object.assign({}, {
        text: "load"
      });
    }
      break;
    case types.RECEIVE_HOMEPAGE: {
      return {
        text: "Not done"
      }
    }
      break;

    default:{
      return state;
    }
  }
}

const rootReducer = combineReducers({
  homepage,
  test
});

export default rootReducer;
