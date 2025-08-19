<?php
session_start();
header("Cache-Control: no-cache");
header("Content-Type: text/html");

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['username'])) {
    $_SESSION['name'] = htmlspecialchars(trim($_POST['username']));
}
?>
<html>
<head>
  <title>PHP Sessions</title>
</head>
<body>
  <h1 align="center">PHP Sessions Page 1</h1>
  <hr/>

  <?php if (isset($_SESSION['name']) && $_SESSION['name'] !== ''): ?>
    <p><b>Name:</b> <?= $_SESSION['name'] ?></p>
  <?php else: ?>
    <p><b>Name:</b> Not set</p>
  <?php endif; ?>

  <a href="/php-cgiform.html">CGI Form</a><br />

  <form style="margin-top:30px" action="/cgi-bin/php-destroy-cookie-session.php" method="get">
    <button type="submit">Destroy Session</button>
  </form>
</body>
</html>
