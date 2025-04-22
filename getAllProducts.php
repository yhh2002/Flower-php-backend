<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

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

// 查詢所有產品
$sql = "SELECT * FROM products";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "header" => [
            "success" => false,
            "err_code" => "0103",
            "err_msg" => "Query failed: " . $conn->error
        ]
    ]);
    $conn->close();
    exit();
}

// 轉換成 JSON 格式
$resultArray = array();
while ($row = $result->fetch_assoc()) {
    $resultArray[] = [
        "id" => $row['id'],
        "name" => $row['name'],
        "category" => $row['category'],
        "price" => $row['price'],
        "description" => $row['description'],
        "image_url" => $row['image_url'],
        "stock_quantity" => $row['stock_quantity']
    ];
}

echo json_encode([
    "header" => [
        "success" => true,
        "err_code" => "0000",
        "err_msg" => "Success"
    ],
    "data" => $resultArray
]);

$conn->close();
?>
