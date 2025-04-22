<?php
// ✅ 設定 CORS，允許來自 Angular (`localhost:4200`) 的請求
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ 設定上傳目錄到 `uploads/`
$uploadDir = __DIR__ . "/uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_FILES['file']) {
    $category = $_POST['category'] ?? '未分類';
    $category = str_replace(" ", "_", trim($category)); // ✅ 確保類別名稱不包含空格
    $categoryDir = $uploadDir . $category;

    if (!file_exists($categoryDir)) {
        mkdir($categoryDir, 0777, true);
    }

    $fileName = basename($_FILES['file']['name']);
    $targetPath = $categoryDir . "/" . $fileName;

    // ✅ 產生圖片 URL
    $imageUrl = "http://localhost/IT-Project/Project2/admin/uploads/$category/$fileName";

    // ✅ 如果圖片已存在，直接返回 `image_url`
    if (file_exists($targetPath)) {
        echo json_encode(["success" => true, "image_url" => $imageUrl, "message" => "圖片已存在，直接使用"]);
        exit();
    }

    // ✅ 如果圖片不存在，執行上傳
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
        echo json_encode(["success" => true, "image_url" => $imageUrl, "message" => "圖片上傳成功"]);
    } else {
        echo json_encode(["success" => false, "error" => "上傳失敗"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "沒有收到檔案"]);
}
?>
