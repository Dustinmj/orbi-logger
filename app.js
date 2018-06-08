'use strict'

// check user entered configuration
require('./src/check-config.js');

const { PING_TIME, PORT } = require('./config.json');

const express = require('express');
const app = express();
const logger = require('./src/log-writer');
const worker = require('./src/log-worker');
const scanFiles = require('./src/scan-files');
const swig = require('swig');
const dateformat = require('dateformat');

const index = swig.compileFile( './views/index.swig' );
const logPg = swig.compileFile( './views/log.swig' );

const handleReq = (promise, res, title) => {
  promise.then( log => {
    let date = dateformat(new Date(), 'dddd, mmmm d, yyyy');
    let out = logPg({ date, log, title });
    res.send( out );
  }).catch( err => {
    res.status(404).send("Date not found (mm-dd-yy).")
  });
}

/* /logs/mm-dd-yy */
app.get( '/logs/:date([0-9]{2}\-[0-9]{2}\-[0-9]{2})', (req, res) => {
  handleReq( logger.read( req.params.date ), res, 'Orbi Log' );
});

/* /bootlogs/mm-dd-yy */
app.get( '/bootlogs/:date([0-9]{2}\-[0-9]{2}\-[0-9]{2})', (req, res) => {
  handleReq( logger.readBoot( req.params.date ), res, 'Orbi Boot Log' );
});

/* /logs */
app.get( '/logs', (req, res) => {
  handleReq( logger.read(), res, 'Orbi Log' );
});

/* /bootlogs */
app.get( '/bootlogs', (req, res) => {
  handleReq( logger.readBoot(), res, 'Orbi Boot Log' );
});

app.get( '/', (req, res) => {
  scanFiles().then( dates => {
    let out = index({ dates });
    res.status(200).send(out);
  });
});

app.use( (req, res) => {
  res.status(404).send('Not Found');
});

// start logging
console.log( `Updating every ${PING_TIME} seconds.`);
worker.start();

app.listen( PORT, () => {
  console.log(`App listening on ${PORT}.`)
});
