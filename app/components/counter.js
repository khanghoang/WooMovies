import React from 'react-native';

const {
  Component,
  View,
  Text,
  TouchableHighlight
} = React;

export default class Counter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { counter, increment, decrement } = this.props;

    return (
      <View style={{flex: 1}}>
        <Text>{counter}</Text>
        <TouchableHighlight onPress={increment}>
          <Text>up</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={decrement}>
          <Text>down</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
