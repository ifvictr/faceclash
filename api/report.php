<?php
require_once "functions.php";
header("Content-Type: application/json");
$operation = strtolower(filter($_POST["operation"]));
$id = filter($_POST["id"]);
if(empty($operation)){
    output(["status" => "fail", "message" => "POST parameter 'operation' not found"]);
    exit;
}
if(!$_SESSION["logged_in"]){
    output(["status" => "fail", "message" => "Need to be logged in as admin"]);
    exit;
}
test();
$out = [];
if(empty($id)){
    $result = $database->query("SELECT * FROM reports ORDER BY id DESC LIMIT 50");
    while($row = $result->fetch_assoc()){
        $out[] = $row;
    }
    $result->free();
    output(["status" => "success", "message" => "Fetched all reports from database", "data" => $out]);
}
else{
    if($operation === "delete"){
        $database->query("DELETE FROM reports WHERE id = '$id'");
        output(["status" => "success", "message" => "Deleted report with id '$id'"]);
        exit;
    }
    output(["status" => "success", "message" => "Fetched report with id '$id'", "data" => $database->query("SELECT * FROM reports WHERE id = '$id'")->fetch_assoc()]);
}