import {homepage, test} from './counter';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  homepage,
  test
});

export default rootReducer;
