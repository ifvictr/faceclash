<?php
require_once "functions.php";
header("Content-Type: application/json");
$winner = filter($_POST["winner"]);
$loser = filter($_POST["loser"]);
if(empty($winner)){
    output(["status" => "fail", "message" => "POST parameter 'winner' not found"]);
    exit;
}
if(empty($loser)){
    output(["status" => "fail", "message" => "POST parameter 'loser' not found"]);
    exit;
}
test();
$winnerData = $database->query("SELECT * FROM players WHERE id = '$winner'")->fetch_assoc();
$loserData = $database->query("SELECT * FROM players WHERE id = '$loser'")->fetch_assoc();
// Update the winner's stats
$database->query("UPDATE players SET score = '" . win($winnerData["score"], expected($winnerData["score"], $loserData["score"])) . "', wins = wins + 1 WHERE id = '$winner'");
// Update the loser's stats
$database->query("UPDATE players SET score = '" . loss($loserData["score"], expected($loserData["score"], $winnerData["score"])) . "', losses = losses + 1 WHERE id = '$loser'");
output(["status" => "success", "message" => "Database updated"]);