#!/usr/bin/php
<?php
header('Cache-Control: no-cache');
header('Content-type: application/json');

$date = date("Y-m-d H:i:s");
$address = $_SERVER['REMOTE_ADDR'];

echo json_encode ([
    "title" => "Hello, PHP!",
    "heading" => "Hello, PHP!",
    "message" => "This page was generated with the PHP programming language",
    "time" => $date,
    "IP" => $address
]);
?>




