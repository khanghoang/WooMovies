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

      // category section
      let data = _.chain($(".movie-list-index"))

      // get category name
      .map((el) => {
        let categoryName = $('.title-list-index', el).text();
        return {
          el: el,
          categoryName: categoryName
        }
      })

      // get view all href
      .map((node) => {
        let viewAllHref = $(".more-list-index", node.el).attr("href");
        return Object.assign({}, {viewAllHref: viewAllHref}, node);
      })

      // get all movies
      .map((node) => {
        let movieNodes = $(".last-film-box li a", node.el);

        let movies = _.map(movieNodes, (mNode) => {

          let image = {
            coverImage: S($('.public-film-item-thumb', mNode).attr("style")).between('&url=', 'jpg').s
          }

          var movie = _.assign({}, mNode.attribs, image);
          return movie;
        })

        return Object.assign({},
                             {
                               movies: movies
                             },
                             {
                               category:
                                 {
                                 name: node.categoryName,
                                 viewAllHref: node.viewAllHref
                               }
                             });

      })
      .value();

      dispatch(receiveHomePage(err, data))
    })
  };
}
