<!doctype html>
<html>
<head>
  <title>{{date}} | {{title}}</title>
</head>
<body>
  <h2>{{title}} ~ {{date}}</h2>
  <p>
    {{ log|replace('\n','<br />', 'gm')|raw }}
  </p>
</body>
</html>
