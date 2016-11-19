<?php
session_start();
// Require the configuration file
require_once $_SERVER["DOCUMENT_ROOT"] . "/config.php";
// If APP_DEBUG is set to 'true', below will evaluate to 'false', allowing error reporting
if(!Config::APP_DEBUG){
    error_reporting(0);
}
$database = new mysqli(Config::DATABASE_HOST, Config::DATABASE_USER, Config::DATABASE_PASSWORD, Config::DATABASE_NAME, Config::DATABASE_PORT);
function filter($data){
    global $database;
    /*
     * 1. Remove leading/trailing whitespaces
     * 2. Replace multiple whitespaces with just one whitespace
     * 3. Convert special characters to HTML entities
     * 4. Final touch for database
     */
    return $database->real_escape_string(htmlspecialchars(preg_replace('/\s+/', " ", trim($data))));
}
function generateHash($value){
    return hash("md5", "f4c3" . strrev(bin2hex($value)) . "cl45h"); // Much funs
}
function output($data){
    if(is_array($data)){
        // If index 'data' doesn't exist in $data, create empty array for it
        if(!array_key_exists("data", $data)){
            $data["data"] = [];
        }
        echo json_encode($data);
    }
}
function test(){
    global $database;
    if($database->connect_error){
        output(["status" => "fail", "message" => "Database error occurred with message: $database->connect_error"]);
        exit;
    }
}
function expected($a, $b){
    return 1 / (1 + pow(10, ($b - $a) / 400));
}
function loss($score, $expected){
    return $score + 32 * (0 - $expected);
}
function win($score, $expected){
    return $score + 32 * (1 - $expected);
}