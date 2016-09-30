<?php

class Category extends Image
{
	private $conn;
	private $categorys;
	private $categoryProducts;
	private $result = [];

	function __construct($conn)
	{
		$this->conn = $conn;
		$this->categorys = $this->conn->categorys;
		$this->subCategories = $this->conn->subCategories;
		$this->result = ["valid"=>true];
	}


	public function get_all_products_in_category($post)
	{
		$arr = array("cId"=>$post['cId']);
		$products = [];
		if($this->categorys->count($arr)){
			$category = $this->categorys->findOne($arr);
			foreach ($category['products'] as $pId) {
				array_push($products, $this->conn->products->findOne(array("pId"=>$pId)));
			}
			echo(json_encode(array("valid"=>true, "data"=>$products)));
		}
		else {
			$this->error("Category not found");
		}
	}

	public function get_all_products_in_sub_category($post)
	{
		$arr = array("subCatId"=>$post['subCatId']);
		$products = [];
		if($this->subCategories->count($arr)){
			$sc = $this->subCategories->findOne($arr);
			foreach ($sc['products'] as $pId) {
				array_push($products, $this->conn->products->findOne(array("pId"=>$pId)));
			}
			echo(json_encode(array("valid"=>true, "data"=>$products)));
			
		}
		else {
			$this->error("Category not found");
		}
	}

	public function get_all_subcategory_in_category($post)
	{
		$arr = array("cId"=>$post['cId']);
		$data = [];
		if($this->categorys->count($arr)){
			$category = $this->categorys->findOne($arr);
			$subCategoryIds = $category['subCategories'];

			foreach ($subCategoryIds as $subCatId) {
				$sc = $this->subCategories->findOne(array("subCatId"=>$subCatId));
				unset($sc['_id']);
				array_push($data, $sc);
			}
			echo(json_encode(array("valid"=>true, "data"=>$data)));
		}
		else {
			$this->error("Category not found");
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

		$this->write_categorys_json();
		echo json_encode($this->result);
	}

	protected function index($array, $prop, $value)
	{
		$index = -1;
		foreach ($array as $item) {
				$index++;
				if($item[$prop] == $value){
					break;
				}
			}

		return $index;
	}
}

?>