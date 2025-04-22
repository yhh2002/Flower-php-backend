<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ 連接資料庫
$conn = new mysqli("localhost", "root", "", "flowershop");
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Database connection failed"]));
}

// ✅ 獲取 `PUT` 數據
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$name = $data['name'];
$category = $data['category'];
$price = $data['price'];
$description = $data['description'];
$stock_quantity = $data['stock_quantity'];

// ✅ 確保 `image_url` 不是 `"0"`，如果沒有新圖片則保持不變
$image_url = isset($data['image_url']) && $data['image_url'] !== "0" ? $data['image_url'] : NULL;

// ✅ 構建 SQL 更新語句
$sql = "UPDATE products SET 
            name = ?, 
            category = ?, 
            price = ?, 
            description = ?, 
            stock_quantity = ?" . ($image_url ? ", image_url = ?" : "") . "
        WHERE id = ?";

$stmt = $conn->prepare($sql);
if ($image_url) {
    $stmt->bind_param("ssdsssi", $name, $category, $price, $description, $stock_quantity, $image_url, $id);
} else {
    $stmt->bind_param("ssdssi", $name, $category, $price, $description, $stock_quantity, $id);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Product updated"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$conn->close();
?>
