<?php
class Image
{
	protected $uploadedImages = [];
	private $failled = [];

	private $imageUploadResult = ["valid"=>true, "error"=>""];

	protected function upload_images($dirPath, $files)
	{	
		$files = $files['files'];
		
		if(!is_dir($dirPath)){
			mkdir($dirPath);
		}

		if (is_array($files['name'])) {
			foreach ($files['name'] as $key => $file_name) {
				$this->upload($dirPath, $files, $file_name, $key);
			}
		}
		else{
			$this->upload($dirPath, $files, $files['name'], 0);
		}

	}

	protected function delete_dir($path)
	{
	    if (is_dir($path) === true)
	    {
	        $files = array_diff(scandir($path), array('.', '..'));

	        foreach ($files as $file)
	        {
	            $this->delete_dir(realpath($path) . '/' . $file);
	        }

	        return rmdir($path);
	    }

	    else if (is_file($path) === true)
	    {
	        return unlink($path);
	    }

	    return false;
	}

	protected function delete_file($path)
	{
		if (is_file($path) === true)
	    {
	        return unlink($path);
	    }

	    return false;
	}

	public function uploaded_images()
	{
		return $this->uploadedImages;
	}

	public function failedImages()
	{
		return $this->failed;
	}

	private function upload($dirPath, $files, $file_name, $key)
	{
		$allowed = ['jpg', 'png', 'jpeg', 'gif'];

		if(is_array($files['name'])){
			$file_tmp = $files['tmp_name'][$key];
			$file_size = $files['size'][$key];
			$file_error = $files['error'][$key];
		}
		else{
			$file_tmp = $files['tmp_name'];
			$file_size = $files['size'];
			$file_error = $files['error'];	
		}

		// getimagesize($file_tmp);

		$file_ext = explode('.', $file_name);
		$file_ext = strtolower(end($file_ext));

		if (in_array($file_ext, $allowed)) {
			
			if($file_error === 0){

				if($file_size <= 2097152){
					$new_file_name = uniqid('', true) . '.' . $file_ext;
					$file_destination = $dirPath . $new_file_name;

					if(move_uploaded_file($file_tmp, $file_destination))
						$this->uploadedImages[$key] = $new_file_name;
					else
						$this->failed[$key] = $file_name . " error in uploading";
				}
				else
					$this->failed[$key] = $file_name . " is too large, image size should less then 2MB  ";
			}
			else
				$this->failed[$key] = $file_name . " errored with code {$file_error}";
		} 
		else
			$this->failed[$key] = $file_name . " file extension '{$file_ext}' is not allowed";
	}
}

?>