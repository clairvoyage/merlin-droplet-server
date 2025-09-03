 <?php
$servername = "68.252.126.52";
$username = "doadmin";
$password = "AVNS_-wGatciBh4tYFnWKzT3";
$dbname = "api";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO performance (id, name)
VALUES ('3sva-m0', 'https://merlins-tower.org/')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?> 