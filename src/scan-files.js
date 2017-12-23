'use strict'

const path = require('path');
const fs = require('fs-extra');
const { removeBootLogs } = require('./log-cleanup');

exports = module.exports = () => {
  const dir = path.resolve( __dirname, '../', process.env.LOG_PATH );
  return fs.readdir( dir ).then( logs => {
    let r = [];
    logs = removeBootLogs( logs );
    for( let l of logs ) {
      // remove prefix
      l = l.substring( process.env.LOG_FILE_PREFIX.length + 1 );
      r.push( l );
    }
    return r;
  });
}
