'use strict';

import React from "react-native";
import Button from "react-native-button";
import superagent from "superagent";
import _ from "lodash";
import cheerio from "cheerio";
var Parser = require('parse5').Parser;

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
import {bindActionCreators} from 'redux';
import Counter from '../components/counter';
import * as counterActions from '../actions/counterActions';
import { connect } from 'react-redux/native';

class CounterApp extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this._pressData = {};
  }

  componentDidMount() {
    // jsdom.env(
    //   "https://iojs.org/dist/",
    //   ["http://code.jquery.com/jquery.js"],
    //   function (err, window) {
    //     console.log("there have been", window.$("a").length - 4, "io.js releases!");
    //   }
    // );
    superagent.get("http://phimmoi.net")
    .end((err, res) => {
      //Instantiate parser 
      var parser = new Parser();

      //Then feed it with an HTML document 
      var domTree = parser.parse(res.text);
      var flatDom = _.flatten(domTree, true);

      debugger;
    })
  }

  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this._genRows({})),
      bounceValue: new Animated.Value(0),
    };
  }

  _genRows(pressData: {[key: number]: boolean}): Array<string> {
    var dataBlob = [];
    for (var ii = 0; ii < 100; ii++) {
      var pressedText = pressData[ii] ? ' (pressed)' : '';
      dataBlob.push('Row ' + ii + pressedText);
    }
    return dataBlob;
  }

  _pressRow(rowID: number) {
    console.log(rowID);
    this._pressData[rowID] = !this._pressData[rowID];
    this.setState({dataSource: this.state.dataSource.cloneWithRows(
      this._genRows(this._pressData)
    )});
    LayoutAnimation.spring();
  }

  _renderRow(rowData: string, sectionID: number, rowID: number) {
    var rowHash = Math.abs(hashCode(rowData));
    var imgSource = {
      uri: THUMB_URLS[rowHash % THUMB_URLS.length],
    };

    let transform = {
      height: 50,
      width: 100,
      backgroundColor: "#000000"
    }

    let style = !! this._pressData[rowID] ? [styles.rowEnable, transform] : [styles.row];

    return (
      <TouchableHighlight onPress={() => this._pressRow(rowID)}>
        <View style={styles.row}>
          <View style={style}>
          <Text style={{flex: 1}}>abc</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { state, dispatch } = this.props;

    return (
      <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
    );
  }
}

var THUMB_URLS = ['https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851549_767334479959628_274486868_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851561_767334496626293_1958532586_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851579_767334503292959_179092627_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851589_767334513292958_1747022277_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851563_767334559959620_1193692107_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851593_767334566626286_1953955109_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851591_767334523292957_797560749_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851567_767334529959623_843148472_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851548_767334489959627_794462220_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851575_767334539959622_441598241_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851573_767334549959621_534583464_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851583_767334573292952_1519550680_n.png'];
var LOREM_IPSUM = 'Lorem ipsum dolor sit amet, ius ad pertinax oportere accommodare, an vix civibus corrumpit referrentur. Te nam case ludus inciderint, te mea facilisi adipiscing. Sea id integre luptatum. In tota sale consequuntur nec. Erat ocurreret mei ei. Eu paulo sapientem vulputate est, vel an accusam intellegam interesset. Nam eu stet pericula reprimique, ea vim illud modus, putant invidunt reprehendunt ne qui.';

mapStateToProps = (state) => {
  return {
    state: state.counter
  }
}

var hashCode = function(str) {
  var hash = 15;
  for (var ii = str.length - 1; ii >= 0; ii--) {
    hash = ((hash << 5) - hash) + str.charCodeAt(ii);
  }
  return hash;
};

var styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center'
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
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
  },
});

export default connect(mapStateToProps)(CounterApp);
