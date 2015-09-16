'use strict';

import React from "react-native";
import Button from "react-native-button";
import superagent from "superagent";
import _ from "lodash";
import cheerio from "cheerio";
import S from "string";

const {
  Component,
  ListView,
  Image,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  Animated,
  LayoutAnimation,
  Label
} = React;
import { bindActionCreators } from 'redux';
import { getHomePage } from '../actions/counterActions';
import { connect } from 'react-redux/native';

class CounterApp extends Component {
  constructor(props) {
    super(props);
    this._pressData = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getHomePage());
  }

  _genRows(pressData: {[key: number]: boolean}): Array<string> {
    let data = this.props.homepage.data || [];
    return _.map(data, (movie) => {
      var pressedtext = movie.name ? ' (pressed)' : '';
    });
  }

  _pressRow(rowID: number) {
    console.log(rowID);
  }

  _renderRow(rowData: string, sectionID: number, rowID: number) {
    let transform = {
      height: 50,
      width: 100,
      backgroundColor: "#333333"
    }

    let style = !! this.props.homepage.data[rowID] ? [styles.rowEnable, transform] : [styles.row];
    let name = this.props.homepage.data[rowID].title;
    let imgSource = this.props.homepage.data[rowID].coverImage + "jpg";

    if(!!~imgSource.indexOf("ground-image:url(")) {
      var sub = "ground-image:url('";
      var pos = imgSource.indexOf(sub);
      imgSource = imgSource.substr(pos + sub.length, imgSource.length);
    }

    return (
      <TouchableHighlight onPress={() => this._pressRow(rowID)}>
        <View style={styles.row}>
          <Image style={styles.thumb} source={{uri: imgSource}} />
          <Text style={{flex: 1}}>{name}</Text>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  _renderRowList() {
    const { homepage, test } = this.props;
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let listView = (
      <ListView
      dataSource={ds.cloneWithRows(homepage.data)}
      renderRow={this._renderRow.bind(this)}
      style={[{height: 180, width: 320, backgroundColor: "#232345"}]}
      horizontal={true}
      directionalLockEnabled={true}
      />
    )
    return listView;
  }

  render() {
    const { homepage, test } = this.props;

    if (homepage.data) {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      var bigListView = (
        <ListView
        // dataSource={ds.cloneWithRows([listView, listView2])}
        dataSource={ds.cloneWithRows([1, 2, 3, 4, 5, 6, 7, 8])}
        renderRow={this._renderRowList.bind(this)}
        />
      )
    }

    return (
      <View style={{flex: 1}}>
      {{bigListView}}
      </View>
    );
  }
}

mapStateToProps = (state) => {
  let {homepage, test} = state;
  return {
    homepage,
    test
  }
}

var styles = StyleSheet.create({
  list: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 200
  },
  row: {
    justifyContent: 'center',
    padding: 5,
    margin: 3,
    width: 100,
    height: 150,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC'
  },
  rowEnable: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#000000',
    alignItems: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  thumb: {
    width: 75,
    height: 100,
  },
  text: {
    flex: 1,
  },
});

export default connect(mapStateToProps)(CounterApp);
