<?php

class Product extends Image
{
	private $conn;
	private $products;
	private $result = [];

	function __construct($conn)
	{
		$this->conn = $conn;
		$this->products = $this->conn->products;
		$this->result = ["valid"=>true];
	}

	public function get_product($post)
	{
		$arr = array('pId'=>$post['id']);
		if ($this->products->count($arr)) 
		{
			$doc = $this->products->findOne($arr);
			$this->result['data'] = $doc;
			echo(json_encode($this->result));
		} 
		else 
		{
			$this->error("Product not found");
		}
		
	}
	
	protected function error($error)
	{
		$this->result['valid'] = false;
		$this->result['error'] = $error;

		echo json_encode($this->result);
	}
	protected function success()
	{
		$this->result['valid'] = true;
		$this->result['error'] = "";

		$this->write_products_json();
		echo json_encode($this->result);
	}
}
?>