import React from 'react-native';
const {
  Component,
  Navigator,
  View,
  TouchableHighlight,
  Text,
} = React;
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux/native';
import loggerMiddleware from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import CounterApp from './counterApp';
import Player from './player';

export default class App extends Component {
  render() {
    const createStoreWithMiddleware = applyMiddleware(thunk, loggerMiddleware)(createStore);
    const store = createStoreWithMiddleware(rootReducer);


    return (
      <Provider store={store}>
      {() => <Navigator
        style={{
          flex: 1
        }}
        initialRoute={{
          title: 'Trang chủ',
          name: "home",
          index: 0
        }}
        renderScene={(route, navigator) => {
          if(route.name === "home") {
            // return <CounterApp navigator={navigator}/>
            return (
              <View style={{flex: 1, backgroundColor: "#333333"}}>
              <TouchableHighlight style={{flex: 1}}
              onPress={() => navigator.push({name: "player", url: ""})}
              >
              <Text> Test </Text>
              </TouchableHighlight>
              </View>
            )
          }

          if(route.name === 'player') {
            // return <View style={{flex: 1}} />
            return <Player url={route.url}/>
          }

          return <Player url={route.url}/>

        }}
        // configureScene={(route) => Navigator.SceneConfigs.HorizontalSwipeJump}
        configureScene={(route) => {
          if(route.configureScene) {
            return route.configureScene;
          }
          return Navigator.SceneConfigs.FloatFromRight
        }}
        />}
      </Provider>
    );
  }
}
