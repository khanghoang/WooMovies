import React from 'react-native';
const {
  Component,
  Navigator,
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  PixelRatio,
  TouchableOpacity
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
          flex: 1,
        }}
        initialRoute={{
          title: 'Trang chủ',
          name: "home",
          index: 0
        }}
        renderScene={(route, navigator) => {
          if(route.name === "home") {
            return <CounterApp navigator={navigator} height={368}/>
          }

          if(route.name === 'player') {
            // return <View style={{flex: 1, backgroundColor: "black"}} />
            return <Player url={route.url}/>
          }

          return <Player url={route.url}/>

        }}
        configureScene={(route) => {
          if(route.configureScene) {
            return route.configureScene;
          }
          return Navigator.SceneConfigs.FloatFromRight
        }}

        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={{backgroundColor: "white"}}
          />
        }

        />}
      </Provider>
    );
  }
}

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {"< Trở về"}
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return null;
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText, styles.navBarTitleText ]}>
        {route.title}
      </Text>
    );
  },

};

var styles = StyleSheet.create({
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: "blue",
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarTitleText: {
    width: 200,
    height: 20,
    overflow: "hidden",
    textAlign: "center",
    fontFamily: 'helvetica neue'
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
});
