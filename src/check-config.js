'use strict'

const config = require('../config.json');

const required = [
  "PORT", "ROUTER_USERNAME", "ROUTER_PASSWORD",
  "ROUTER_LOG_URI", "ROUTER_IP", "LOG_PATH",
  "LOG_FILE_PREFIX", "PING_TIME", "KEEP_HISTORY_DAYS",
  "PRUNE_LOGIN_ENTRIES"
];

(() => {

  for( let setting of required ) {
    if( config[ setting ] === undefined ){
      throw `Required setting ${ setting } not found in config.json.js`;
    }
  }

  console.log( `Configuration Ok` );

})();
