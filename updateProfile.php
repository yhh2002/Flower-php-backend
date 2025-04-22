<?php
header("Access-Control-Allow-Origin: *");  // ✅ 允許所有網域請求
header("Access-Control-Allow-Methods: POST, OPTIONS"); // ✅ 允許 POST 和 OPTIONS 請求
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // ✅ 允許特定標頭

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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

if (!isset($data->id) || !isset($data->name) || !isset($data->phone) || !isset($data->address)) {
    echo json_encode(["success" => false, "message" => "缺少必填欄位"]);
    exit();
}

$id = $data->id;
$name = $data->name;
$phone = $data->phone;
$address = $data->address;

// 🛠️ 如果有新密碼，則加密存儲
if (isset($data->password) && !empty($data->password)) {
    $password = password_hash($data->password, PASSWORD_DEFAULT);
    $query = "UPDATE users SET name = ?, phone = ?, address = ?, password = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssi", $name, $phone, $address, $password, $id);
} else {
    $query = "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssi", $name, $phone, $address, $id);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "資料更新成功"]);
} else {
    echo json_encode(["success" => false, "message" => "資料更新失敗"]);
}

$conn->close();
?>
