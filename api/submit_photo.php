<?php
require_once "functions.php";
header("Content-Type: application/json");
$firstName = ucfirst(filter($_POST["first_name"]));
$lastName = ucfirst(filter($_POST["last_name"]));
$gender = strtolower(filter($_POST["gender"]));
$age = (int) filter($_POST["age"]);
$photo = $_POST["photo"];
if(empty($firstName)){
    output(["status" => "fail", "message" => "POST parameter 'first_name' not found"]);
    exit;
}
if(empty($gender)){
    output(["status" => "fail", "message" => "POST parameter 'gender' not found"]);
    exit;
}
if(empty($photo)){
    output(["status" => "fail", "message" => "POST parameter 'photo' not found"]);
    exit;
}
test();
if(!$lastName or $lastName === ""){
    $lastName = null;
}
// Sanitize gender
if($gender !== "f" and $gender !== "m"){
    $gender = "f"; // Assume they're female if not female or male
}
// If age is not within 1 and 4 inclusively, assume they're a teenager, because they're the intended audience ;)
if(!($age >= 1) and !($age <= 4)){
    $age = 1;
}
$ip = $_SERVER["REMOTE_ADDR"];
$directory = $_SERVER["DOCUMENT_ROOT"] . "/../images";
// Insert new data into database
test();
// Process the image and data, and it's ready
@mkdir($directory); // Create directory if it doesn't exist
try{
    // Database
    $statement = $database->prepare("INSERT INTO players (id, first_name, last_name, gender, ip, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $statement->bind_param("isssssi", $time, $firstName, $lastName, $gender, $ip, generateHash($ip), time());
    $statement->execute();
    // Image
    $imagick = new Imagick();
    $imagick->readImageBlob(base64_decode(explode(",", $photo)[1]));
    $imagick->setImageFormat("jpeg");
    $imagick->setImageCompressionQuality(75);
    $imagick->setImageBackgroundColor("white"); // White background color for fill
    // Resize image to make it a 300x300 square
    $width = $imagick->getImageWidth();
    $height = $imagick->getImageHeight();
    $size = $width > $height ? $width : $height; // Set max size, based on the greater one of width and height
    $imagick->extentImage($size, $size, -($size - $width) / 2, -($size - $height) / 2);
    $imagick->resizeImage(300, 300, Imagick::FILTER_UNDEFINED, 0.9);
    // Save image outside of webserver, for security reasons. Images will be fetched via photo.php
    $imagick->writeImage("$directory/" . $database->query("SELECT id FROM players WHERE id = (SELECT MAX(id) FROM players)")->fetch_assoc()["id"] . ".jpg");
    output(["status" => "success", "message" => "Player has been added to the database"]);
}
catch(Exception $exception){
    output(["status" => "fail", "message" => "Caught exception with message: " . $exception->getMessage()]);
    exit;
}