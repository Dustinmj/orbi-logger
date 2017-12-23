## Orbi Logger

Logging server which pulls logs out of Netgear's Orbi router at a given interval, saves them, then provides an interface to view these logs by date.
Also, a bootlog file is created which contains all initialization entries for the Orbi router for each day.

### Usage

```
1. Have node/npm
2. Change settings in .env
  a. Ping time in seconds
  b. Router ip
  c. Username/Password
3. Run server ( npm start )
4. URIS
  a. <ip>:<port>/logs -- today's logs
  b. <ip>:<port>/bootlogs -- today's bootlogs
  c. <ip>:<port>/logs/mm-dd-yy -- specific day's logs
  d. <ip>:<port>/bootlogs/mm-dd-yy -- specifc day's bootlogs
```

### Other Routers

It shouldn't be too difficult to alter this to work with other routers, you'll need to modify /src/log-filter.js to filter out line-by-line logs from whatever interface's html.
