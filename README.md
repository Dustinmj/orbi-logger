## Orbi Logger

Logging server which pulls logs out of Netgear's Orbi router at a given interval, saves them, then provides an interface to view these logs by date.
Also, a bootlog file is created which contains all initialization entries for the Orbi router for each day.

### Usage

```
1. Have node,npm,git
2. Clone this repository
3. Change settings in config.json
  a. Ping time in seconds
  b. Router ip
  c. Username/Password
4. Run server ( npm install && npm start )
  a. Run as a daemon (on boot) with forever
    i. npm install -g forever
    ii. cd <dir> && forever start app.js
5. URIS
  a. <ip>:<port>/ -- index
  b. <ip>:<port>/logs -- today's logs
  c. <ip>:<port>/bootlogs -- today's bootlogs
  d. <ip>:<port>/logs/mm-dd-yy -- specific day's logs
  e. <ip>:<port>/bootlogs/mm-dd-yy -- specifc day's bootlogs
```

### Other Routers

It shouldn't be too difficult to alter this to work with other routers, you'll need to modify /src/log-filter.js to filter out line-by-line logs from whatever interface's html.
