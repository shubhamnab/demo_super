<?php

    $data = json_decode(file_get_contents("php://input"));
    
    $totalprice =$data->totalPrice;
    $selectedProducts = $data->selectedProducts;
	$totalProducts = $data->totalProducts;
    $userDetails = $data->details;
    
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "riddhi";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } 
        
        $orderId = rand(0,10000000);


        foreach ($selectedProducts as $selectedProduct) {
            $sql1 = "INSERT INTO order_details (productId, orderId)
        VALUES ('$selectedProduct->id', '$orderId')";
             if ($conn->query($sql1) != TRUE) {
            echo "Error: " . $sql1 . "<br>" . $conn->error;
        }
        }
        
        foreach ($selectedProducts as $selectedProduct) {
            $sql3 = "INSERT INTO product_details (pID, pName,price,image)
        VALUES ('$selectedProduct->id', '$selectedProduct->id','$selectedProduct->price','$selectedProduct->img')";
            
             if ($conn->query($sql3) != TRUE) {
            echo "Error: " . $sql3 . "<br>" . $conn->error;
        } 
        }
        

        $sql2 = "INSERT INTO user_details (Name, Email, phone, Address, orderID, totalAmount, totalProducts)
        VALUES ('$userDetails->name', '$userDetails->email', '$userDetails->phoneNumber', '$userDetails->address', '$orderId', '$totalprice','$totalProducts')";

        if ($conn->query( $sql2) === TRUE) {
            echo "Error: " . $sql2 . "<br>" . $conn->error;
        } 

        $conn->close();
        ?>
     
 
  
