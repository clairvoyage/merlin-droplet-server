#!/usr/bin/php
<?php
header("Cache-Control: no-cache");
header("Content-type: text/html");

echo <<<HTML
<!DOCTYPE html>
<html>
<head>
  <title>Environment Variables</title>
</head>
<body>
  <h1 align="center">Environment Variables</h1>
  <hr>
HTML;

// Environment variables (PHP stores these in $_SERVER and $_ENV)
$env_vars = array_merge($_SERVER, $_ENV);
ksort($env_vars);

foreach ($env_vars as $key => $value) {
    echo "<b>$key:</b> $value<br />\n";
}

echo <<<HTML
</body>
</html>
HTML;
?>