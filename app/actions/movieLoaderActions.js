import superagent from 'superagent'

// var superagent = require('superagent');
import cheerio from 'cheerio';
import _ from 'lodash';
import S from 'string';

export const REQUEST_CURRENT_PLAYER_MOVIE = "REQUEST_CURRENT_PLAYER_MOVIE";
export const RECEIVE_CURRENT_PLAYER_MOVIE = "RECEIVE_CURRENT_PLAYER_MOVIE";

function requestCurrentPlayerMovie() {
  return {
    type: REQUEST_CURRENT_PLAYER_MOVIE
  }
}

function receiveCurrentPlayerMovie(error, data) {
  return {
    type: RECEIVE_CURRENT_PLAYER_MOVIE,
    data: data,
    error: error
  }
}

export function getMovieWithURL(sourceUrl) {
  return dispatch => {
    dispatch(requestCurrentPlayerMovie());
    return fetch(sourceUrl)
    .then(function(res) {
        return res.text();
    }).then(function(htmlText) {
        var re = /currentEpisode\.url='(.*)\'/;

        var result = re.exec(htmlText);
        var url = false;

        if (!result.length) {
            return reject({
                message: 'Cannot get video url'
            });
        }

        return result[1];
    }).then(function(url) {
        return fetch('http://www.phimmoi.net/player/v1.46/plugins/gkplugins_picasa2gdocs/plugins/plugins_player.php', {
            method: 'post',
            headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `url=${url}`
        });
    })
    .then((res) => {
      return res.json();
    })
    .then(function(res) {
      dispatch(receiveCurrentPlayerMovie(null, res));
    })
    .catch((err) => {
      dispatch(receiveCurrentPlayerMovie(err, null));
    })
  }
}
