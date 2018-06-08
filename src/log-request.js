'use strict'

const {
  ROUTER_IP,
  ROUTER_LOG_URI,
  ROUTER_USERNAME,
  ROUTER_PASSWORD
} = require('../config.json');

const http = require('http');
const filter = require('./log-filter');

exports.getLog = module.exports.getLog = () => {

  return new Promise( (resolve, reject) => {
    let page = '';
    
    const req = http.get(
      {
        host:ROUTER_IP,
        path:ROUTER_LOG_URI,
        auth:`${ROUTER_USERNAME}:${ROUTER_PASSWORD}`
      },
      res => {
        res.setEncoding('utf8');
        res.on( 'data', chunk => {
            page += chunk;
        });
        res.on( 'end', () => {
          if( !filter.checkAuth( page ) ) {
            reject( 'Authentication failed.' );
          }
          resolve( filter.parse( page ) );
        });
      }
    );

    req.setTimeout( 2000, () => {
      req.abort();
    });

    req.on( 'error', err => {
      reject( err );
    });

    req.end();
  });

}
