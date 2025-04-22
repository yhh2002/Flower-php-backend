<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 資料庫連接
$server   = "localhost";
$username = "root";
$password = "";
$dbname   = "flowershop";

$conn = new mysqli($server, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode([
        "header" => [
            "success"  => false,
            "err_code" => "0102",
            "err_msg"  => "Failed to connect to DB: " . $conn->connect_error,
        ],
    ]);
    exit();
}

// 查詢所有訂單
$sql = "SELECT o.id AS order_id,
        u.name AS customer,
        p.name AS product_name,
        o.quantity, o.price,
        o.total_amount, o.status,
        o.created_at,
        o.delivery_method,
        o.delivery_address,
        o.delivery_date,
        o.delivery_time,
        o.delivery_district
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN products p ON o.product_id = p.id
        ORDER BY o.created_at DESC";

$result = $conn->query($sql);

if (! $result) {
    echo json_encode(["success" => false, "error" => "Query failed: " . $conn->error]);
    exit();
}

// 將結果轉為 JSON 格式
$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode(["success" => true, "orders" => $orders]);

$conn->close();
