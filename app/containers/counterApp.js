'use strict';

import React from "react-native";
import Button from "react-native-button";
import superagent from "superagent";
import _ from "lodash";
import cheerio from "cheerio";
import S from "string";

import Video from "react-native-video";
import Player from "./player";

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
  Label,
  SliderIOS
} = React;
import { bindActionCreators } from 'redux';
import { getHomePage } from '../actions/counterActions';
import { connect } from 'react-redux/native';

class CounterApp extends Component {
  constructor(props) {
    super(props);
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
    console.log(Player);
    let shortUrl = this.props.homepage.data[rowID].href;
    let url = "http://www.phimmoi.net/" + shortUrl + "xem-phim.html"

    this.props.navigator.push({
      component: Player,
      passProps: {
        url: url
      }
    });
  }

  _renderRow(rowData: string, sectionID: number, rowID: number) {
    let name = this.props.homepage.data[rowID].title;
    let imgSource = this.props.homepage.data[rowID].coverImage + "jpg";

    if(!!~imgSource.indexOf("ground-image:url(")) {
      var sub = "ground-image:url('";
      var pos = imgSource.indexOf(sub);
      imgSource = imgSource.substr(pos + sub.length, imgSource.length);
    }

    let style = {flex: 1, width: 120, marginLeft: 2, marginRight: (parseInt(rowID) === this.props.homepage.data.length-1 ? 8 : 2)}

    return (
      <TouchableHighlight style={style} onPress={() => this._pressRow(rowID)}>
      <View>
          <Image style={[styles.thumb, {flex: 1}]} source={{uri: imgSource}} />
          <Text style={{flex: 1, fontSize: 12, marginTop: 3, height: 30}}>{name}</Text>
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
      style={{height: 210, paddingRight: 10, paddingLeft: 5}}
      horizontal={true}
      directionalLockEnabled={true}
      automaticallyAdjustContentInsets={false}
      />
    )
    return listView;
  }

  _setTime(obj) {
    this.props.currentTime = obj.currentTime;
  }

  _onValueChange(value) {
    this.refs.videoPlayer.seek(value * 120 * 60);
  }

  _onLoad(obj) {
    console.log(obj);
  }

  render() {
    const { homepage, test } = this.props;

    if (homepage.data) {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      var bigListView = (
        <ListView
        style={{flex: 1, paddingTop: 20}}
        dataSource={ds.cloneWithRows([1, 2, 3, 4, 5, 6, 7, 8])}
        renderRow={this._renderRowList.bind(this)}
        />
      )
    }

    return (
      <View style={{flex: 1}}>
      {bigListView}
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
  slider: {
    height: 10,
    width: 568,
    top: 290,
    position: "relative"
  },
  list: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 200
  },
  row: {
    // justifyContent: 'center',
    // padding: 3,
    margin: 3,
    width: 120,
    height: 180,
    // alignItems: 'center',
  },
  rowEnable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  separator: {
    height: 1,
  },
  thumb: {
    width: 120,
    height: 170,
  },
  text: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // flex: 1
  }

});

export default connect(mapStateToProps)(CounterApp);
