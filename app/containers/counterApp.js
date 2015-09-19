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
  SliderIOS,
  ActivityIndicatorIOS,
  Navigator
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

  _pressRow(rowData: Object) {
    let shortUrl = rowData.href;
    let url = "http://www.phimmoi.net/" + shortUrl + "xem-phim.html"
    let title = rowData.title;

    this.props.navigator.push({
      name: "player",
      url: url,
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
    });
  }

  _renderRow(rowData: Object, sectionID: number, rowID: number) {
    let name = rowData.title;
    let imgSource = rowData.coverImage + "jpg";

    if(!!~imgSource.indexOf("ground-image:url(")) {
      var sub = "ground-image:url('";
      var pos = imgSource.indexOf(sub);
      imgSource = imgSource.substr(pos + sub.length, imgSource.length);
    }

    // let style = {flex: 1, width: 120, marginLeft: 2, marginRight: (parseInt(rowID) === this.props.homepage.data.length-1 ? 8 : 2)}
    let style = {flex: 1, width: 120, marginLeft: 2, marginRight: 2};

    return (
      <TouchableHighlight style={style} onPress={() => this._pressRow(rowData)}>
      <View>
          <Image style={[styles.thumb, {flex: 1}]} source={{uri: imgSource}} />
          <Text style={{flex: 1, fontSize: 12, marginTop: 3, height: 30}}>{name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderRowList(rowData: string, sectionID: number, rowID: number) {
    const { homepage, test } = this.props;
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let listView = (
      <View>
      <Text style={{flex: 1, fontSize: 16, marginTop: 3, marginLeft: 5, height: 24}}>
      {homepage.data[rowID].category.name}
      </Text>
      <ListView
      dataSource={ds.cloneWithRows(homepage.data[rowID].movies)}
      renderRow={this._renderRow.bind(this)}
      style={{height: 210, paddingRight: 10, paddingLeft: 5}}
      horizontal={true}
      directionalLockEnabled={true}
      automaticallyAdjustContentInsets={false}
      />
      </View>
    )
    return listView;
  }

  _setTime(obj) {
    this.props.currentTime = obj.currentTime;
  }

  render() {
    const { homepage, test } = this.props;

    if (homepage.data) {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      var bigListView = (
        <ListView
        style={{flex: 1, paddingTop: 20}}
        dataSource={ds.cloneWithRows(homepage.data)}
        renderRow={this._renderRowList.bind(this)}
        />
      )
      return (
        <View style={{flex: 1}}>
        {bigListView}
        </View>
      );
    }

    if(homepage.error) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#ffffff"}}>
        <Text>Lỗi khi load dữ liệu, vui lòng thử lại</Text>
        </View>
      )
    }

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicatorIOS
        animating={true}
        size="small"
      />
      </View>
    )

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
    margin: 3,
    width: 120,
    height: 180,
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
  }

});

export default connect(mapStateToProps)(CounterApp);
