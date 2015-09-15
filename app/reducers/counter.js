import {
  REQUEST_HOMEPAGE,
  RECEIVE_HOMEPAGE
} from '../actions/counterActions';
import superagent from 'superagent';
import _ from 'lodash';

export default function homepage(state = {}, action) {
  switch (action.type) {
    case REQUEST_HOMEPAGE: {
      return Object.assign({}, {
        isLoading: true
      });
    }
    break;
    case RECEIVE_HOMEPAGE: {
      return Object.assign({}, {
        data: action.data,
        isLoading: false
      })
    }
    break;

    default:{
      return state;
    }
  }
}

export default function test(state = {}, action) {
  switch (action.type) {
    case REQUEST_HOMEPAGE: {
      return Object.assign({}, {
        text: "load"
      });
    }
    break;
    case RECEIVE_HOMEPAGE: {
      return Object.assign({}, {
        text: "done"
      })
    }
      break;

    default:{
      return state;
    }
  }
}
