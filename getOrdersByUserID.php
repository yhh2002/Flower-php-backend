<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 資料庫連接設定
$server = "localhost";
$username = "root";
$password = "";
$dbname = "flowershop";

// 確保 `searchKey` 參數存在
if (!isset($_GET["searchKey"]) || empty($_GET["searchKey"])) {
    echo json_encode([
        "header" => [
            "success" => false,
            "err_code" => "0101",
            "err_msg" => "Missing search key."
        ]
    ]);
    exit();
}

$user_id = $_GET["searchKey"];

// 建立資料庫連線
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

// 查詢該用戶的所有訂單
$sql = "SELECT o.id AS order_id, o.user_id, p.name AS product_name, o.quantity, o.price, o.total_amount, o.status, o.created_at 
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE o.user_id='$user_id'";

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

// 將結果轉為 JSON
$resultArray = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $resultArray[] = [
            "order_id" => $row['order_id'],
            "user_id" => $row['user_id'],
            "product_name" => $row['product_name'],
            "quantity" => $row['quantity'],
            "price" => $row['price'],
            "total_amount" => $row['total_amount'],
            "status" => $row['status'],
            "created_at" => $row['created_at']
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
} else {
    echo json_encode([
        "header" => [
            "success" => false,
            "err_code" => "0104",
            "err_msg" => "No records retrieved"
        ]
    ]);
}

$conn->close();
?>
