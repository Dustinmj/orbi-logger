'use strict'

require('dotenv').config();

const express = require('express');
const app = express();
const logger = require('./src/log-writer');
const worker = require('./src/log-worker');

const handleReq = (promise, res) => {
  promise.then( data => {
    res.send(`<pre>${data}</pre>`);
  }).catch( err => {
    res.status(404).send("Date not found (mm-dd-yy).")
  });
}

/* /logs/mm-dd-yy */
app.get( '/logs/:date([0-9]{2}\-[0-9]{2}\-[0-9]{2})', (req, res) => {
  handleReq( logger.read( req.params.date ), res );
});

/* /bootlogs/mm-dd-yy */
app.get( '/bootlogs/:date([0-9]{2}\-[0-9]{2}\-[0-9]{2})', (req, res) => {
  handleReq( logger.readBoot( req.params.date ), res );
});

/* /logs */
app.get( '/logs', (req, res) => {
  handleReq( logger.read(), res );
});

/* /bootlogs */
app.get( '/bootlogs', (req, res) => {
  handleReq( logger.readBoot(), res );
});

app.use( (req, res) => {
  res.status(404).send('Not Found');
});

// start logging
console.log( `Updating every ${process.env.PING_TIME} seconds.`);
worker.start();

app.listen( process.env.PORT, () => {
  console.log(`App listening on ${process.env.PORT}.`)
});
