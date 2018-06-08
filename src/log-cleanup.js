'use strict'

const { LOG_FILE_PREFIX } = require('../config.json');

const fs = require('fs-extra');
const path = require('path');

const reOrder = s => {
  // remove prefix
  s = s.substring( process.env.LOG_FILE_PREFIX.length + 1 );
  // incoming string is mm-dd-yy
  let sa = s.split( '-' );
  sa.unshift( sa.pop() );
  return sa.join( '-' );
}

const removeBootLogs = ar => {
  let r = [];
  for( let s of ar ) {
    if( s.substr( -"_bootlogs".length ) == "_bootlogs" ) {
      continue;
    }
    r.push( s );
  }
  return r;
}

const sortByYYMMDD = ar => {
  // sort array by year/month/day
  return ar.sort( (x, y) => {
    x = reOrder( x );
    y = reOrder( y );
    if( x > y ) {
      return -1;
    } else if ( x < y ) {
      return 1;
    }
    return 0;
  });
}


exports.removeBootLogs = module.exports.removeBootLogs = removeBootLogs;

exports.prune = module.exports.prune = (dir, number) => {
  console.log("Pruning Directory");
  number = parseInt( number );
  // get files
  fs.readdir( dir+'/', 'utf8' ).then( ar => {
    if( ar.length * 2 > number ) {
      ar = removeBootLogs( ar );
      ar = sortByYYMMDD( ar );
      const rm = ar.slice( number, ar.length );
      for( let f of rm ) {
        fs.unlink( path.resolve( dir, f ) ).catch( err => {
          console.log( `Could not delete file: ${ err }`);
        });
        fs.unlink( path.resolve( dir, `${f}_bootlogs` ) ).catch( err => {
          console.log( `Could not delete file: ${ err }`);
        });
      }
    }
  }).catch( err => {
    console.log( err );
  });
}
