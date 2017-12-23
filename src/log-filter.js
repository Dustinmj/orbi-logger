'use strict'

const loginMatch = "[remote login]";
const logSelector = '#log_detail'
const cheerio = require('cheerio');
const dateformat = require('dateformat');

exports.pruneByToday = module.exports.pruneByToday = ar => {
  const dateString = dateformat( new Date(), 'dddd, mmmm d, yyyy' );
  let r = [];
  for( let x of ar ) {
    if( x.includes( dateString ) ) {
      r.push( x );
    }
  }
  return r;
}

exports.pruneLogin = module.exports.pruneLogin = ar => {
  let r = [];
  for( let x of ar ) {
    if( x.substring( 0, loginMatch.length ) !== loginMatch ) {
      r.push( x );
    }
  }
  return r;
}

exports.checkAuth = module.exports.checkAuth = page => {
  const $ = cheerio.load( page );
  const title = $('title').text().trim();
  return title.substring( 0, 3 ) != '401';
}

exports.parse = module.exports.parse = page => {
  const $ = cheerio.load( page );
  return $( logSelector ).text();
}
