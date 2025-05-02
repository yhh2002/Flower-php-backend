<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// 連接資料庫
$host     = "localhost";
$username = "root";       // 你的 MySQL 用戶名
$password = "";           // 你的 MySQL 密碼
$dbname   = "flowershop"; // 你的資料庫名稱

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "資料庫連線失敗: " . $conn->connect_error]));
}

// 確保 `user_id` 存在
$data = json_decode(file_get_contents("php://input"), true);
if (! isset($data["user_id"])) {
    die(json_encode(["success" => false, "message" => "缺少 user_id"]));
}

$user_id = $data["user_id"];

// 查詢該用戶的訂單
$sql = "SELECT
    o.id,
    o.user_id,
    o.phone,
    o.product_id,
    p.name AS product_name,
    o.quantity,
    o.price,
    o.total_amount,
    o.delivery_method,
    o.delivery_district,
    o.delivery_address,
    o.delivery_date,
    o.delivery_time,
    o.size,
    o.stems,
    o.status,
    o.payment_method,
    o.created_at
FROM orders o 
LEFT JOIN products p ON o.product_id = p.id
WHERE user_id = ? 
ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = [
            "id"     => $row["id"],
            "total_amount"  => $row["total_amount"],
            "status" => $row["status"],
            "date"   => $row["created_at"],
            "price"   => $row["price"],
            "phone"   => $row["phone"],
            "quantity"   => $row["quantity"],
            "product_name"   => $row["product_name"],
            "delivery_method"   => $row["delivery_method"],
            "delivery_address"   => $row["delivery_address"],
            "delivery_date"   => $row["delivery_date"],
            "delivery_time"   => $row["delivery_time"],
            "size"   => $row["size"],
            "stems"   => $row["stems"],
            "delivery_district"   => $row["delivery_district"],
            "payment_method" => $row['payment_method'],


        ];
    }
}

echo json_encode(["success" => true, "orders" => $orders]);

$conn->close();
