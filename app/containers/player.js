'use strict';

import React from "react-native";
import { connect } from 'react-redux/native';
import { getMovieWithURL } from '../actions/movieLoaderActions';
import Video from "react-native-video";
import _ from "lodash";

const {
  View,
  Component,
  SliderIOS,
  StyleSheet,
  Text,
  ActivityIndicatorIOS
} = React;

class Player extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch, url} = this.props;
    dispatch(getMovieWithURL(url));
  }

  _setTime(obj) {
    this.props.currentTime = obj.currentTime;
  }

  _onValueChange(value) {
    let duration = _.get(this, "props.currentPlayerMovie.duration");
    if(duration) {
      this.refs.videoPlayer.seek(value * duration);
    }
  }

  _onLoad(obj) {
    // console.log(obj);
    if(_.get(this, "props.currentPlayerMovie")) {
      this.props.currentPlayerMovie.duration = obj.duration;
    }
  }

  render() {

    let movie = this.props.currentPlayerMovie;

    if(movie.data) {
      let url = movie.data.content[1].url;
      return (
      <View style={{flex: 1}}>
      <Video source={{uri: url}} // Can be a URL or a local file.
      rate={1.0}                   // 0 is paused, 1 is normal.
      volume={1.0}                 // 0 is muted, 1 is normal.
      muted={false}                // Mutes the audio entirely.
      paused={false}               // Pauses playback entirely.
      // resizeMode="cover"           // Fill the whole screen at aspect ratio.
      repeat={true}                // Repeat forever.
      onLoadStart={this.loadStart} // Callback when video starts to load
      onLoad={this._onLoad.bind(this)}    // Callback when video loads
      onProgress={this._setTime.bind(this)}    // Callback every ~250ms with currentTime
      onEnd={this.onEnd}           // Callback when playback finishes
      onError={this.videoError}    // Callback when video cannot be loaded
      style={styles.backgroundVideo}
      ref="videoPlayer"
      />
      <View style={{position: "relative", height: 20, flex: 1, bottom: 20, backgroundColor: 'rgba(0,0,0,0)'}}>
      <SliderIOS 
      style={styles.slider} 
      onValueChange={this._onValueChange.bind(this)} 
      />
      </View>
      </View>
      )
    }

    if(movie.error) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
  let {currentPlayerMovie} = state;
  return {
    currentPlayerMovie
  }
}

var styles = StyleSheet.create({
  slider: {
    height: 10,
    flex: 1,
    bottom: 0,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  backgroundVideo: {
    position: 'absolute',
    backgroundColor: '#000000',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1
  }
});

export default connect(mapStateToProps)(Player);
