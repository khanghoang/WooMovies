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
  TouchableOpacity,
  Navigator,
  PanResponder
} = React;
import { bindActionCreators } from 'redux';
import { getHomePage } from '../actions/counterActions';
import { connect } from 'react-redux/native';

class CounterApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      scrollY: new Animated.Value(0),
    };
  }

  componentWillMount() {
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
      title: rowData.title,
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
      <TouchableOpacity style={style} onPress={() => this._pressRow(rowData)}>
      <View>
          <Image style={[styles.thumb, {flex: 1}]} source={{uri: imgSource}} />
          <Text style={{flex: 1, fontSize: 12, marginTop: 3, height: 30, color: "white"}}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderRowList(rowData: string, sectionID: number, rowID: number) {
    const { homepage, test } = this.props;
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let listView = (
      <View>
      <Text style={{flex: 1, fontSize: 16, marginTop: 3, marginLeft: 5, height: 24, color: "white"}}>
      {homepage.data[rowID].category.name}
      </Text>
      <ListView
      dataSource={ds.cloneWithRows(homepage.data[rowID].movies)}
      renderRow={this._renderRow.bind(this)}
      style={{height: 210, paddingRight: 10, paddingLeft: 5, width: 368}}
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

  onScroll(event) {
    // var offset = (event.nativeEvent.contentOffset.y + event.nativeEvent.contentInset.top) / 600;
    var opacity = 1 - ((event.nativeEvent.contentOffset.y + event.nativeEvent.contentInset.top) % 300) / 300;
    this.refs.header.setNativeProps({
      opacity
    })
  }

  render() {
    const { homepage, test} = this.props;

    if (homepage.data) {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      // let heightStyle = {height: this.state.height};
      let heightStyle = {bottom: this.state.height};
      console.log(heightStyle);
      var bigListView = (
        <View style={{flex: 1, position: "relative", backgroundColor: "black"}}>
        <View ref="header" style={{height: 300, backgroundColor: "#333", opacity: this.state.opacity}}
        >
        </View>
        <ListView
        style={{flex: 1, bottom: 0, position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "transparent"}}
        ref="bigList"
        contentInset={{top: 300}}
        contentOffset={{y: -300}}
        dataSource={ds.cloneWithRows(homepage.data)}
        renderRow={this._renderRowList.bind(this)}
        directionalLockEnabled={true}
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={16 /* get all events */ }
        onScroll={this.onScroll.bind(this)}
        />
        </View>
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#ffffff"}}>
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
