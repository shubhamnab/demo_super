<?php
if(!isset($_SESSION)) 
{ 
    session_start(); 
} 
require('../conn.class.php');
require '../Image.class.php';
require 'Category.class.php';

$_POST = json_decode(file_get_contents('php://input'), true);


$conn = new DbConnection();
$conn = $conn->getDbConn();

$Category = new Category($conn);
$Category->get_all_subcategory_in_category($_POST);


?>