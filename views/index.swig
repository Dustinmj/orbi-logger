<!doctype html>
<html>
<head>
  <title>Orbi Router Logs</title>
  <style type="text/css">
    a, a:hover, a:active {
      display:block;
      color:#369;
      text-decoration:none;
    }
    a:visited {
      color:#333;
    }
  </style>
</head>
<body>
  <h2>Orbi Logs</h2>
  {% for d in dates %}
    <a href="/logs/{{d}}">{{d}}</a>
    <a href="/bootlogs/{{d}}">{{d}} boot logs</a>
  {% endfor %}
</body>
</html>
