<?php
if(!isset($_SESSION)) 
{ 
    session_start(); 
} 
require('../conn.class.php');
require '../Image.class.php';
require 'Product.class.php';

$_POST = json_decode(file_get_contents('php://input'), true);


$conn = new DbConnection();
$conn = $conn->getDbConn();

$Product = new Product($conn);
$Product->get_all_products($_POST);


?>