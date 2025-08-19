<?php
header("Cache-Control: no-cache");
header("Content-type: text/html");

$query_string = $_SERVER['QUERY_STRING'];
?>

<!DOCTYPE html>
<html>
<head>
    <title>GET Request Echo</title>
</head>
<body>
    <h1 align="center">GET Request Echo</h1>
    <hr>

    <b>Raw Query String:</b> <?php echo htmlspecialchars($query_string); ?><br/><br/>

    <b>Formatted Query String:</b><br/><br/>
    <?php
    // Parse query string manually
    parse_str($query_string, $params);
    foreach ($params as $key => $value) {
        echo htmlspecialchars($key) . " : " . htmlspecialchars($value) . "<br/>\n";
    }
    ?>

</body>
</html>
