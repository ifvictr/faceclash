<?php
require_once "functions.php";
header("Content-Type: image/jpeg");
$id = filter($_GET["id"]);
$root = $_SERVER["DOCUMENT_ROOT"];
if(isset($id) and file_exists($filename = "$root/../images/$id.jpg")){
    $row = $database->query("SELECT * FROM players WHERE id = '$id'")->fetch_assoc();
    // Only display the image if it's already been approved or if is logged in (for administration viewing)
    if($row["ready"] == 1 or $_SESSION["logged_in"]){
        $path = $filename;
    }
    // Photo not approved yet, show placeholder gender photo of the queued player
    else{
        $path = "$root/images/placeholder/" . $row["gender"] . ".gif";
    }
}
else{
    $path = "$root/images/placeholder/u.gif";
}
readfile($path); // Output image