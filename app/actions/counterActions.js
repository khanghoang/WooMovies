import * as types from './actionTypes';
import superagent from 'superagent'
import cheerio from 'cheerio';
import _ from 'lodash';
import S from 'string';

export const REQUEST_HOMEPAGE = "REQUEST_HOMEPAGE";
export const RECEIVE_HOMEPAGE = "RECEIVE_HOMEPAGE";

export function increment() {
  return {
    type: types.INCREMENT
  };
}

export function decrement() {
  return {
    type: types.DECREMENT
  };
}

// var request = require('superagent').agent();
//
// request.get('http://www.phimmoi.net/phim/ke-the-mang-3002/xem-phim.html')
// .end(function(err, res) {
//    request.post('http://www.phimmoi.net/player/v1.46/plugins/gkplugins_picasa2gdocs/plugins/plugins_player.php')
//    .type('form')
//    .send({
//        url: 'https://picasaweb.google.com/lh/photo/phimmoi.net/UGhpbU1vaV8LivHXpYwPAQON1vsrSSIXTYgtwJIkT4M8ESfam!vZHNyLZMdnUrF7l!vZH.*OnDvT0FZahQ6wpWWVjL~plKqh0~plKsofV5m~plKfOLAqmW.*OnOhdx~plKnP6Fzg9VO7QGW!vZHw0ikPgUom4zL6zfW8nHWG5bizpNvAg__eefd448d1442391078@v1.3'
//    })
//    .end(function(err1, res1) {
//        console.log(res1.text);
//    });
// })

function requestHomePage() {
  return {
    type: REQUEST_HOMEPAGE
  }
}

function receiveHomePage(error, data) {
  return {
    type: RECEIVE_HOMEPAGE,
    data: data,
    error: error
  }
}

export function getHomePage() {
  return dispatch => {
    dispatch(requestHomePage());
    return superagent
    .get('http://phimmoi.net')
    .end((err, res) => {
      //Then feed it with an HTML document 
      var $ = cheerio.load(res.text);
      let data = _.chain($(".home-v2 .last-film-box-wrapper ul li a"))
      .map((el) => {
        let image = {
          coverImage: S($('.public-film-item-thumb', el).attr("style")).between('&url=', 'jpg').s
        }
        var movie = _.assign({}, el.attribs, image);
        return movie;
      })
      .value();
      dispatch(receiveHomePage(err, data))
    })
  };
}
