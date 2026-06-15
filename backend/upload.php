<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['screenshot'])) {
        echo json_encode(["success" => false, "message" => "No file uploaded"]);
        exit();
    }

    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $file = $_FILES['screenshot'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];

    if (!in_array(strtolower($ext), $allowed)) {
        echo json_encode(["success" => false, "message" => "Invalid file type, try again"]);
        exit();
    }

    $filename = uniqid('bug_') . '.' . $ext;
    $destination = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        echo json_encode(["success" => true, "filename" => $filename, "path" => $destination]);
    } else {
        echo json_encode(["success" => false, "message" => "Upload failed"]);
    }
}
?>