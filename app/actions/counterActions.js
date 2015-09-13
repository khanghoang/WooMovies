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
