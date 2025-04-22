<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// 資料庫連接
$server = "localhost";
$username = "root";
$password = "";
$dbname = "flowershop";

$conn = new mysqli($server, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode([
        "header" => [
            "success" => false,
            "err_code" => "0102",
            "err_msg" => "Failed to connect to DB: " . $conn->connect_error
        ]
    ]);
    exit();
}
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->name) || !isset($data->email) || !isset($data->password) || !isset($data->phone) || !isset($data->address)) {
    echo json_encode(["success" => false, "message" => "缺少必填欄位"]);
    exit();
}

$name = $data->name;
$email = $data->email;
$phone = $data->phone;
$address = $data->address;
$password = password_hash($data->password, PASSWORD_DEFAULT);

$query = "INSERT INTO users (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("sssss", $name, $email, $phone, $address, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "註冊成功"]);
} else {
    echo json_encode(["success" => false, "message" => "註冊失敗，Email 可能已被使用"]);
}

$conn->close();
?>
