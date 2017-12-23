'use strict'

const _ = require('lodash');
const fs = require('fs-extra');
const dateformat = require('dateformat');
const path = require('path');

const PREFIX = process.env.LOG_FILE_PREFIX;
const PATH = process.env.LOG_PATH;

const getDate = () => {
  return dateformat( new Date(), 'mm-dd-yy' );
}

const getFileName = ( date, suffix = '' ) => {
  date = date || getDate();
  return `${PREFIX}_${date}${suffix}`;
}

const fullPath = ( date, suffix = '' ) => {
  return path.resolve( PATH, getFileName( date, suffix ) );
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
  return fs.ensureFile( file ).then( () => {
    return fs.readFile( file, 'utf8' ).then( currentLog => {

      const cLog = currentLog.split("\n");
      const nLog = logdata.split("\n");

      // merge logs, deleting duplicates
      let aLog = _.union( nLog, cLog  );
      const newlines = aLog.length - nLog.length;
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
      })

      // return promise, main log file write
      return fs.writeFile( file, newLog, 'utf8' ).then( err => {
        return newlines;
      });

    });
  });
}
