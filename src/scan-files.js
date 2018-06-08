'use strict'

const { LOG_PATH, LOG_FILE_PREFIX } = require('../config.json');

const path = require('path');
const fs = require('fs-extra');
const { removeBootLogs } = require('./log-cleanup');

exports = module.exports = () => {
  const dir = path.resolve( __dirname, '../', LOG_PATH );
  return fs.readdir( dir ).then( logs => {
    let r = [];
    logs = removeBootLogs( logs );
    for( let l of logs ) {
      // remove prefix
      l = l.substring( LOG_FILE_PREFIX.length + 1 );
      r.push( l );
    }
    return r;
  });
}
