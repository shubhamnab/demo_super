<?php
if(!isset($_SESSION)) 
{ 
    session_start(); 
} 
require('../conn.class.php');
require('user.class.php');


$conn = new DbConnection();
$conn = $conn->getDbConn();

$user = new User($conn);
$user->logout();
?>