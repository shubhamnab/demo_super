<?php

require('conn.class.php');
$conn = new DbConnection();
$db = $conn->getDbConn();

$_POST = json_decode(file_get_contents('php://input'), true);

$collection = $db->coupons;

$arr = array('couponCode' => $_POST['couponCode'] );
if ($collection->count($arr)) {

  $doc = $collection->findOne($arr);

  if ($_POST['totalPrice'] > $doc['discount']) {
    echo json_encode(array("status"=>true, "discount"=>$doc['discount']));
  }
  else {
    echo json_encode(array("status"=>false));
  }

}
else {
  echo json_encode(array("status"=>false));
}


?>
