<?php
// CORS 設定，允許從 Angular 網域連線
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// 回應預檢請求（Angular 在正式送資料前會先問一次）
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 顯示錯誤（開發用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 確保回傳格式為 JSON
header('Content-Type: application/json');


// ✅ 資料庫連線
$conn = new mysqli('localhost', 'root', '', 'flowershop');
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '資料庫連線失敗']);
    exit;
}

// ✅ 接收前端送來的 JSON 資料
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['items'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '無效的 JSON 資料']);
    exit;
}

// ✅ 抓取資料
$user_id = $data['user_id'] ?? ''; // ✅ 假設已登入用戶，請視情況改為 session 或 token 驗證
$name = $data['name'] ?? '';
$phone = $data['phone'] ?? '';
$deliveryMethod = $data['deliveryMethod'] ?? '標準送貨';
$delivery_district = $data['deliveryDistrict'] ?? '';
$delivery_time = $data['deliveryTime'] ?? '';
$address = $data['address'] ?? '';
$delivery_date = $data['deliveryDate'] ?? null;
$total = $data['total'] ?? 0;
$items = $data['items'] ?? [];

if ($deliveryMethod === '到店自取') {
    $address = '九龍旺角花園街123號B鋪';
    $deliveryDistrict = '';
    $delivery_time = '（星期一至日，上午11:00 - 晚上8:00）';
}



$status = 'Completed';

// ✅ 寫入每筆商品訂單（一項商品一筆記錄）
foreach ($items as $item) {
    $productId = $item['id'];
    $quantity = $item['quantity'];
    $price = $item['price'];
    $size = $item['size'];
    $stems = $item['stems'];


    $stmt = $conn->prepare("INSERT INTO orders (
        user_id, phone, product_id, quantity, price, total_amount,
        delivery_method, delivery_district, delivery_address, delivery_date,
        delivery_time,size,stems, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)");

    $stmt->bind_param(
        "isiiidssssdsis",
        $user_id,
        $phone,
        $productId,
        $quantity,
        $price,
        $total,
        $deliveryMethod,
        $delivery_district,
        $address,
        $delivery_date,
        $delivery_time,
        $size,
        $stems,
        $status,
    );
    $stmt->execute();
}

// ✅ 成功回應
echo json_encode(['success' => true, 'message' => '訂單已儲存']);
exit;
?>
