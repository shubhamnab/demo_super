<?php
  /*  if(!isset($_SESSION))
{
    session_start();
}*/
require('conn.class.php');


$_POST = json_decode(file_get_contents('php://input'), true);

	// connect to mongodb
//	$m = mongodb;//riddhi:DBdb021@@ds023570.mlab.com:23570/riddhi;
	// $m = new MongoClient();

    $conn = new DbConnection();
    $db = $conn->getDbConn();

	// select a database
	//$db = $m->riddhi;

	// create collection
	$collection = $db->orders;

  // genreate new order id
  $oId = $collection->find()->count() + 1;

  // get current date
  $date = date('d-m-Y');

  $post = $_POST;
  $post['oId'] = $oId;
  $post['date'] = $date;

	// insert data into collection
	$collection->insert($post);

	// Response
	echo(json_encode(array('valid'=>true , "data"=>$oId )));

?>
