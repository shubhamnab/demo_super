<?php
class DbConnection{
  private $db_conn;
  
  public function getDbConn(){
	  //$m = new MongoClient();
      $m = new MongoClient("mongodb://139.59.183.156");
      $db_conn = $m->riddhisiddhi;
      return($db_conn);
  }
}
?>