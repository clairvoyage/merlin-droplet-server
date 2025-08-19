<?php
session_start();

// Clear session data
session_unset();
session_destroy();

// Expire the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

header("Cache-Control: no-cache");
header("Content-Type: text/html");
?>
<html>
<head>
  <title>PHP Session Destroyed</title>
</head>
<body>
  <h1>Session Destroyed</h1>
  <a href="/php-cgiform.html">Back to the CGI Form</a><br />
  <a href="/cgi-bin/php-cookie-sessions-1.php">Back to Page 1</a><br />
</body>
</html>
