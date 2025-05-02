<?php
// ✅ 設定 CORS 頭
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ 若為預檢請求 (OPTIONS)，立即回應
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}



$conn = new mysqli("localhost", "root", "", "flowershop");
$data = json_decode(file_get_contents("php://input"));

$order_id = $data->order_id ?? null;
$status = $data->status ?? null;

if (!$order_id || !$status) {
  echo json_encode(["success" => false, "message" => "缺少資料"]);
  exit;
}

$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $order_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => $stmt->error]);
}
$conn->close();
