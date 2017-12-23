'use strict'

const logSelector = '#log_detail'
const cheerio = require('cheerio');

exports.parse = module.exports.parse = page => {
  const $ = cheerio.load( page );
  return $( logSelector ).text();
}
