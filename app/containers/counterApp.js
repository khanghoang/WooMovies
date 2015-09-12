'use strict';

import React, { Component } from 'react-native';
import {bindActionCreators} from 'redux';
import Counter from '../components/counter';
import * as counterActions from '../actions/counterActions';
import { connect } from 'react-redux/native';

class CounterApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { state, dispatch } = this.props;

    return (
      <Counter
        counter={state.count}
        {...bindActionCreators(counterActions, dispatch)} />
    );
  }
}

mapStateToProps = (state) => {
  return {
    state: state.counter
  }
}

export default connect(mapStateToProps)(CounterApp);
