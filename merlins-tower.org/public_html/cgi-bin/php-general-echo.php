<?php
header("Cache-Control: no-cache");
header("Content-type: text/html");
?>

<!DOCTYPE html>
<html>
<head>
    <title>General Request Echo</title>
</head>
<body>
    <h1 align="center">General Request Echo</h1>
    <hr>

    <p><b>HTTP Protocol:</b> <?= $_SERVER['SERVER_PROTOCOL'] ?></p>
    <p><b>HTTP Method:</b> <?= $_SERVER['REQUEST_METHOD'] ?></p>
    <p><b>Query String:</b> <?= $_SERVER['QUERY_STRING'] ?></p>

    <p><b>Message Body:</b>
    <?php
        $body = file_get_contents("php://input");
        echo nl2br(htmlspecialchars($body));
    ?>
    </p>
</body>
</html>
