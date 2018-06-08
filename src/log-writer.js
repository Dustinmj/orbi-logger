'use strict'

// ensure values
let config = require('../config.json');
const { LOG_FILE_PREFIX, LOG_PATH, KEEP_HISTORY_DAYS } = config;
const PRUNE_LOGIN_ENTRIES = config.PRUNE_LOGIN_ENTRIES === "true"
                          || config.PRUNE_LOGIN_ENTRIES === true;

const _ = require('lodash');
const fs = require('fs-extra');
const dateformat = require('dateformat');
const path = require('path');
const logCleanup = require('./log-cleanup');
const filter = require('./log-filter');

const getDate = () => {
  return dateformat( new Date(), 'mm-dd-yy' );
}

const getFileName = ( date, suffix = '' ) => {
  date = date || getDate();
  return `${LOG_FILE_PREFIX}_${date}${suffix}`;
}

const fullPath = ( date, suffix = '' ) => {
  return path.resolve( __dirname, LOG_PATH, getFileName( date, suffix ) );
}

exports.readBoot = module.exports.readBoot = date => {
  const file = fullPath( date, '_bootlogs' );
  return fs.readFile( file, 'utf8' );
}

exports.read = module.exports.read = date => {
  const file = fullPath( date );
  return fs.readFile( file, 'utf8' );
}

exports.write = module.exports.write = logdata => {
  const file = fullPath();
  // only prune when we'll create a new file
  fs.stat( file ).catch( err => {
    logCleanup.prune(
      path.resolve( LOG_PATH ),
      KEEP_HISTORY_DAYS
    );
  });
  // return promise
  return fs.ensureFile( file ).then( () => {
    return fs.readFile( file, 'utf8' ).then( currentLog => {

      const cLog = currentLog.split("\n");
      const nLog = logdata.split("\n");

      // merge logs, deleting duplicates
      let aLog = _.union( nLog, cLog  );

      const newlines = aLog.length - nLog.length;

      // if we're pruning login entries, do that now
      if( PRUNE_LOGIN_ENTRIES ) {
       aLog = filter.pruneLogin( aLog );
      }

      // remove all data that's not today
      aLog = filter.pruneByToday( aLog );

      // create new log
      const newLog = aLog.join('\n');

      // determine boot sequences
      let boots = [];
      _.forEach( aLog, line => {
        let match = line.substring( 0, 12 );
        if( match == "[Initialized" ) {
          boots.push( line );
        }
      });

      // write out boot sequences to boots file
      const bootlog = fullPath( null, '_bootlogs' );
      fs.ensureFile( bootlog ).then( () => {
          fs.writeFile( bootlog, boots.join('\n'), 'utf8' )
            .catch( err => {
              console.log( 'Could not write boots file.' );
            });
      });

      // return promise, main log file write
      return fs.writeFile( file, newLog, 'utf8' ).then( err => {
        return newlines;
      });

    });
  });
}
