 <?php
$mysqli = new mysqli("merlins-lab-database-do-user-24569011-0.m.db.ondigitalocean.com","doadmin","AVNS_-wGatciBh4tYFnWKzT3","api");

// Check connection
if ($mysqli -> connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
  exit();
}
?> 