<?php
require_once "functions.php";
header("Content-Type: application/json");
$operation = strtolower(filter($_POST["operation"]));
$id = filter($_POST["id"]);
if(empty($operation)){
    output(["status" => "fail", "message" => "POST parameter 'operation' not found"]);
    exit;
}
if(empty($id)){
    output(["status" => "fail", "message" => "POST parameter 'id' not found"]);
    exit;
}
if(!$_SESSION["logged_in"] and $operation !== "data"){
    output(["status" => "fail", "message" => "Need to be logged in as admin"]);
    exit;
}
else{
    test();
    $out = [];
    switch($operation){
        case "approve":
            $database->query("UPDATE players SET ready = '1' WHERE id = '$id'");
            output(["status" => "success", "message" => "Approved player $id"]);
            break;
        case "data":
            output(["status" => "success", "message" => "Fetched info for player with id $id", "data" => $database->query("SELECT * FROM players WHERE id = '$id'")->fetch_assoc()]);
            break;
        case "delete":
            $database->query("DELETE FROM players WHERE id = '$id'");
            @unlink($_SERVER["DOCUMENT_ROOT"] . "/../images/$id.jpg");
            output(["status" => "fail", "message" => "Deleted player $id"]);
            break;
        case "edit":
            $firstName = ucfirst(filter($_POST["first_name"]));
            $lastName = ucfirst(filter($_POST["last_name"]));
            $gender = strtolower(filter($_POST["gender"]));
            if(empty($firstName)){
                output(["status" => "fail", "message" => "POST parameter 'firstName' not found"]);
                exit;
            }
            if(empty($gender)){
                output(["status" => "fail", "message" => "POST parameter 'gender' not found"]);
                exit;
            }
            $statement = $database->prepare("UPDATE players SET first_name = ?, last_name = ?, gender = ? WHERE id = ?");
            $statement->bind_param("sssi", $firstName, $lastName, $gender, $id);
            $statement->execute();
            output(["status" => "success", "message" => "Updated player info"]);
            break;
        default:
            output(["status" => "fail", "message" => "Unknown operation specified"]);
            break;
    }
}