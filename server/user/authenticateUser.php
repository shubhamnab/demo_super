<?php
if(!isset($_SESSION)) 
{ 
    session_start(); 
} 
	if(isset($_SESSION['login'])){
		echo(json_encode(array("valid"=> true, "email"=>$_SESSION['email'])));
	}
	else{
		echo(json_encode(array("valid"=> false)));	
	}

?>