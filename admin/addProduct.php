<?php
header("Access-Control-Allow-Origin: *"); // 允許所有來源請求
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // 允許這些請求方法
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 處理 OPTIONS 預檢請求
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
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit();
}

// 接收 POST 參數
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit();
}

$name = $data['name'];
$category = $data['category'];
$price = $data['price'];
$description = $data['description'];
$image_url = $data['image_url'];
$stock_quantity = $data['stock_quantity'];



$sql = "INSERT INTO products (name, category, price, description, image_url, stock_quantity) 
        VALUES ('$name', '$category', '$price', '$description', '$image_url', '$stock_quantity')";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Product added successfully"]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to add product"]);
}

$conn->close();
?>
