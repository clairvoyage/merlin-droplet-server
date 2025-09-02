<?php
	$servername = "merlins-lab-database-do-user-24569011-0.m.db.ondigitalocean.com";
	$username = "doadmin";
	$password = "AVNS_-wGatciBh4tYFnWKzT3";

	// Create connection
	$conn = new mysqli($servername, $username, $password);

	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	echo "Connected successfully";
?>