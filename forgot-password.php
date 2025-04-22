<?php

error_reporting(E_ALL);
error_reporting(E_ALL);
ini_set('display_errors', 0); // ✅ 確保錯誤不會輸出到 API 回應
ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log'); // ✅ 只記錄錯誤日誌，避免影響 JSON 回應

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/Exception.php';
require 'PHPMailer/SMTP.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");




$host = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "flowershop"; 

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "資料庫連線失敗: " . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->action)) {
    echo json_encode(["error" => "❌ 請提供操作類型！"]);
    exit();
}

$action = $data->action;

// 1️⃣ 發送驗證碼
if ($action === "send_code") {
    if (!isset($data->email)) {
        echo json_encode(["error" => "❌ 請提供 Email"]);
        exit();
    }

    $email = $data->email;
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $verificationCode = rand(100000, 999999);

        // 刪除舊驗證碼
        $deleteOld = "DELETE FROM password_resets WHERE email = ?";
        $stmtDelete = $conn->prepare($deleteOld);
        $stmtDelete->bind_param("s", $email);
        $stmtDelete->execute();

        // 插入新驗證碼
        $insertCode = "INSERT INTO password_resets (email, reset_code) VALUES (?, ?)";
        $stmtInsert = $conn->prepare($insertCode);
        $stmtInsert->bind_param("ss", $email, $verificationCode);
        $stmtInsert->execute();

        // 📩 發送 Email
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // ✅ 你的 SMTP 伺服器
            $mail->SMTPAuth = true;
            $mail->Username = 'hy9471604@gmail.com'; // ✅ 輸入你的 Email
            $mail->Password = 'pwib qzyw ckyp kxli'; // ✅ 輸入你的 Gmail App Password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            $mail->SMTPDebug = 0; // ✅ 啟用 Debug 模式，檢查錯誤訊息
            $mail->CharSet = 'UTF-8'; // ✅ 設定 UTF-8，避免亂碼

            $mail->setFrom('hy9471604@gmail.com', 'flow');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = '🔑 你的驗證碼';
            $mail->Body = "<p>您好，您的驗證碼是：<b>$verificationCode</b></p><p>請在 10 分鐘內輸入驗證碼來重設密碼。</p>";

            $mail->send();
            echo json_encode(["message" => "📩 驗證碼已發送，請檢查你的 Email！"]);
        } catch (Exception $e) {
            echo json_encode(["error" => "❌ Email 發送失敗: " . $mail->ErrorInfo]);
        }
    } else {
        echo json_encode(["error" => "❌ 找不到該 Email！"]);
        exit();
    }
}

// 2️⃣ 驗證驗證碼
if ($action === "verify_code") {
    if (!isset($data->email) || !isset($data->code)) {
        echo json_encode(["error" => "❌ 請提供 Email 和驗證碼"]);
        exit();
    }

    $email = $data->email;
    $code = $data->code;

    $sql = "SELECT * FROM password_resets WHERE email = ? AND reset_code = ? AND created_at >= NOW() - INTERVAL 10 MINUTE";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["message" => "✅ 驗證成功！請輸入新密碼"]);
        exit();
    } else {
        echo json_encode(["error" => "❌ 驗證碼錯誤或已過期"]);
        exit();
    }
}

// 3️⃣ 更新密碼
if ($action === "reset_password") {
    if (!isset($data->email) || !isset($data->new_password)) {
        echo json_encode(["error" => "❌ 請提供 Email 和新密碼"]);
        exit();
    }

    $email = $data->email;
    $newPassword = password_hash($data->new_password, PASSWORD_DEFAULT);

    $updateSql = "UPDATE users SET password = ? WHERE email = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("ss", $newPassword, $email);
    $updateStmt->execute();

    // 刪除已使用的驗證碼
    $deleteCode = "DELETE FROM password_resets WHERE email = ?";
    $stmtDelete = $conn->prepare($deleteCode);
    $stmtDelete->bind_param("s", $email);
    $stmtDelete->execute();

    echo json_encode(["message" => "✅ 密碼已成功重設，請重新登入！"]);
    exit();
}

$stmt->close();
$conn->close();
?>
