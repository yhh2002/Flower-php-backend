<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// 確保 OPTIONS 預檢請求能被處理
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

if (!isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "缺少必 填欄位"]);
    exit();
}

$email = $data->email;
$password = $data->password;

$query = "SELECT id, name, phone, address, password FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $name, $phone, $address, $hashed_password);
$stmt->fetch();

if ($stmt->num_rows > 0 && password_verify($password, $hashed_password)) {
    echo json_encode(["success" => true, "user" => ["id" => $id, "name" => $name, "email" => $email, "phone" => $phone, "address" => $address]]);
} else {
    echo json_encode(["success" => false, "message" => "帳號或密碼錯誤"]);
}

$conn->close();
?>
