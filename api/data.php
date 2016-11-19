<?php
require_once "functions.php";
header("Content-Type: application/json");
$operation = strtolower(filter($_POST["operation"]));
$gender = strtolower(filter($_POST["gender"]));
if(empty($operation)){
    output(["status" => "fail", "message" => "POST parameter 'operation' not found"]);
    exit;
}
if(empty($gender) xor ($gender !== "f" and $gender !== "m")){
    $gender = "f"; // Assume they're female if not female or male
}
else{
    test();
    $out = [];
    switch($operation){
        case "all":
            if(!$_SESSION["logged_in"]){
                output(["status" => "fail", "message" => "Need to be logged in as admin"]);
                exit;
            }
            $result = $database->query("SELECT * FROM players ORDER BY id DESC");
            while($row = $result->fetch_assoc()){
                $out[] = $row;
            }
            $result->free();
            output(["status" => "success", "message" => "Fetched all players from database", "data" => $out]);
            break;
        case "random":
            $result = $database->query("SELECT * FROM players WHERE gender = '$gender' AND ready = '1' ORDER BY RAND() LIMIT 2");
            while($row = $result->fetch_assoc()){
                unset($row["ip"]); // Don't expose player IP address
                $out[] = $row;
            }
            $result->free();
            output(["status" => "success", "message" => "Fetched " . count($out) . " players from database of gender '$gender'", "data" => $out]);
            break;
        case "leaderboard":
            $result = $database->query("SELECT * FROM players WHERE gender = '$gender' AND ready = '1' ORDER BY score DESC LIMIT 50");
            while($row = $result->fetch_assoc()){
                unset($row["ip"]); // Don't expose player IP address
                $out[] = $row;
            }
            $result->free();
            output(["status" => "success", "message" => "Fetched top " . count($out) . " players", "data" => $out]);
            break;
        default:
            output(["status" => "fail", "message" => "Unknown operation specified"]);
            break;
    }
}