import React from 'react-native';
const {
  Component
} = React;
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux/native';
import loggerMiddleware from 'redux-logger';
import thunk from 'redux-thunk';

import reducer from '../reducers';
import CounterApp from './counterApp';

const createStoreWithMiddleware = applyMiddleware(thunk, loggerMiddleware)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <CounterApp />}
      </Provider>
    );
  }
}
