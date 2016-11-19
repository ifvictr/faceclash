<?php
require_once "functions.php";
header("Content-Type: application/json");
$operation = strtolower(filter($_POST["operation"]));
$user = strtolower(filter($_POST["user"]));
$password = filter($_POST["password"]);
if(!isset($_SESSION["logged_in"])){
    $_SESSION["logged_in"] = false;
}
if(empty($user) and empty($password) and empty($operation)){
    output(["status" => "success", "message" => "Fetched login data", "data" => ["logged_in" => $_SESSION["logged_in"]]]);
    exit;
}
switch($operation){
    case "login":
        if(empty($user)){
            output(["status" => "fail", "message" => "POST parameter 'username' not found"]);
            exit;
        }
        if(empty($password)){
            output(["status" => "fail", "message" => "POST parameter 'password' not found"]);
            exit;
        }
        if($user === strtolower(Config::ADMIN_USER) and $password === Config::ADMIN_PASSWORD){
            $_SESSION["logged_in"] = true;
            output(["status" => "success", "message" => "Successfully logged in", "data" => ["logged_in" => $_SESSION["logged_in"]]]);
            exit;
        }
        else{
            output(["status" => "fail", "message" => "Invalid credentials", "data" => ["logged_in" => $_SESSION["logged_in"]]]);
            exit;
        }
        break;
    case "logout":
        $_SESSION["logged_in"] = false;
        output(["status" => "success", "message" => "Successfully logged out", "data" => ["logged_in" => $_SESSION["logged_in"]]]);
        break;
    default:
        output(["status" => "fail", "message" => "Unknown operation specified"]);
        break;
}