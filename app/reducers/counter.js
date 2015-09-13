import * as types from '../actions/actionTypes';
import {
  REQUEST_HOMEPAGE,
  RECEIVE_HOMEPAGE
} from '../actions/actionTypes';
import superagent from 'superagent';
import _ from 'lodash';

export function homepage(state = {}, action) {
  switch (action.type) {
    case REQUEST_HOMEPAGE: {
      return _.assign({}, state, {
        isLoading: true
      });
      break;
    }
    case RECEIVE_HOMEPAGE: {
      return _.assign({}, {
        data: []
      }, {
        isLoading: false
      })
      break;
    }

    default:{
      return state;
    }
  }
}

export function test(state = {text: "load"}, action) {
  switch (action.type) {
    case REQUEST_HOMEPAGE: {
      return _.assign({}, state, {
        text: "load"
      });
      break;
    }
    case RECEIVE_HOMEPAGE: {
      return _.assign({}, action, {
        text: "done"
      })
      break;
    }

    default:{
      return state;
    }
  }
}
