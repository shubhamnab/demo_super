<?php 
require('../conn.class.php');
require('user.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();
	
$data = array();
$_POST = json_decode(file_get_contents('php://input'), true);

$user = new User($conn);
$user->signup($_POST['name'], $_POST['email'], $_POST['phone'], $_POST['addr'], $_POST['pass'], $_POST['repass']);
   
// 	// print_r($_POST);
// 	// echo "Db connected";
// print_r($_POST);
?>