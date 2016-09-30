<?php
if(!isset($_SESSION)) 
{ 
    session_start(); 
} 
class User
{
	
	function __construct($conn)
	{
		$this->conn = $conn;
		$this->error = "";
		$this->users = $this->conn->users;
	}

	public function signup($name, $email, $phone, $addr, $pass, $repass)
	{
		if( $this->validate($pass, $repass, $email, $phone) )
		{
			$this->users->insert(array(
				'name' =>  htmlspecialchars(trim($name)), 
				'email' =>  htmlspecialchars(trim($email)), 
				'phone' =>  htmlspecialchars(trim(strval($phone))), 
				'address' =>  htmlspecialchars(trim($addr)), 
				'password' =>  htmlspecialchars(trim($pass))
				));
			echo(json_encode(array('valid'=>true, 'error'=>'')));
		}
		else{
			echo json_encode(array('valid'=>false, 'error' => $this->error));
		}
	}

	public function login($email, $pass)
	{
		if($this->checkEmail($email)){
			if(	$this->users->count(array('email' => $email, 'password' => $pass)) === 1){
				$user = $this->users->findOne(array('email' => $email, 'password' => $pass));
				
				$_SESSION['login'] = true;
				$_SESSION['email'] = $email;
				echo json_encode(array('valid'=>true));
			}
			else{
				echo json_encode(array('valid'=>false, 'error' => 'Email and Password does not match'));
			}
		}
		else{
			echo json_encode(array('valid'=>false, 'error' => $this->error));
		}
	}

	public function logout()
	{
		session_destroy();
		echo(json_encode(array('valid'=>true)));
	}

	private function runQuery($q, $arr)
	{
		$prep = $this->conn->prepare($q);
		$prep->execute($arr);
	}

	private function validate($pass, $repass, $email, $phone)
	{
		return
			($this->checkPassword($pass, $repass) && 
			$this->checkPhoneNumber(strval($phone)) &&
			$this->checkEmail($email) &&
			$this->emailNotExist($email));
	}
	private function checkPassword($pass, $repass)
	{
		if($pass !== $repass){ 
			$this->error = "Both Password should be same";
			return false; 
		}
		if(strlen($pass) <= 6){
			$this->error = "Password length should be greater then 6";
			return false;
		}

		return true;
	}

	private function checkPhoneNumber($number)
	{
		if (!preg_match('/^\d{10}$/', $number)) {
		 	$this->error = "phone number must be a number and length should be 10.";
		 	return false;
		}
		if ($this->exist(array('phone' => $number))) {
			$this->error = "phone number already exist.";
		 	return false;	
		}
		return true;
	}

	private function checkEmail($email)
	{
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		  $this->error = 'Please enter a valid email.';
		  return false;
		}

		return true;
	}

	private function emailNotExist($email)
	{
		if ($this->exist(array( 'email' => $email))) {
			$this->error = "email already exist.";
		 	return false;	
		}

		return true;
	}

	private function exist($a){	 
		return($this->users->count($a));
  	}
}
?>