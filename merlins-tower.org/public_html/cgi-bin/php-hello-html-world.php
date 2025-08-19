<?php
  header("Cache-Control: no-cache");
  header("Content-type: text/html");
?>
<!DOCTYPE html>
<html>
<head>
  <title>Hello, PHP</title>
</head>
<body>
  <h1>Hello, PHP!</h1>
  <hr>
  <p>This page was generated with the PHP programming language.</p>
  <p>Current Time: <?php echo date("Y-m-d H:i:s"); ?></p>
  <p>Your IP Address: <?php echo $_SERVER['REMOTE_ADDR']; ?></p>
</body>
</html>
