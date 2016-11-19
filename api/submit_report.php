<?php
require_once "functions.php";
header("Content-Type: application/json");
$name = ucfirst(filter($_POST["name"]));
$email = filter($_POST["email"]);
$message = filter($_POST["message"]);
if(!empty($_POST["gotcha"])){
    output(["status" => "fail", "message" => "POST parameter 'gotcha' not found"]);
    exit;
}
if(empty($message)){
    output(["status" => "fail", "message" => "POST parameter 'message' not found"]);
    exit;
}
$statement = $database->prepare("INSERT INTO reports (name, email, message, created_at) VALUES (?, ?, ?, ?)");
$statement->bind_param("sssi", $name, $email, $message, time());
$statement->execute();
output(["status" => "success", "message" => "Saved report"]);