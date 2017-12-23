'use strict'

const { spawn } = require('threads');
const logReader = require('./log-request');
const logWriter = require('./log-writer');
const stdout = require('single-line-log').stdout;
const tick = process.env.PING_TIME * 1000;

let thread;
let dots='.';

exports.start = module.exports.start = () => {

  const thread = new spawn( ( input, done ) => {
    console.log("Logging thread started.")
    const logReader = require(`${input.__dirname}/log-request`);
    const logWriter = require(`${input.__dirname}/log-writer`);
    const process = () => {
      logReader.getLog().then( log => {
        if( log.length > 0 ) {
          logWriter.write( log )
            .then( newlines =>{
              done( newlines );
            }).catch( err => {
              Promise.reject( 'Could not write file.' );
            });
        }
      }).catch( err => {
        console.log( `Could not reach Orbi: ${err}` );
      });
    }
    process();
    setInterval( process, input.tick );
  });

  thread.send({ __dirname, tick })
    .on( 'message', newlines => {
      dots = dots.length > 25 ?
        '.' : dots + '.';
      stdout( dots );
    })
    .on( 'error', err => {
      console.error( err );
      thread.kill();
    })
    .on( 'exit', () => {
      console.log('Worker terminated.');
    });

}

exports.stop = module.exports.stop = () => {
  thread.kill();
}
