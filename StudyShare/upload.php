<?php
// Enable error reporting to see server issues
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db.php';

$response = ['success' => false, 'message' => ''];
$uploadDir = 'uploads/';

// 1. Check if folder exists
if (!is_dir($uploadDir)) {
    // 0777 gives full permissions (Read/Write/Execute)
    if (!mkdir($uploadDir, 0777, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create "uploads" folder. Check permissions.']);
        exit;
    }
}

// 2. Check if folder is writable
if (!is_writable($uploadDir)) {
    echo json_encode(['success' => false, 'message' => 'Error: Permission denied. Set "uploads" folder to 777.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    
    // 3. Check for PHP Upload Errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $phpErrors = [
            1 => 'File exceeds upload_max_filesize in php.ini',
            2 => 'File exceeds MAX_FILE_SIZE in HTML form',
            3 => 'File was only partially uploaded',
            4 => 'No file was uploaded',
            6 => 'Missing a temporary folder',
            7 => 'Failed to write file to disk',
            8 => 'A PHP extension stopped the file upload.',
        ];
        $errorMsg = isset($phpErrors[$file['error']]) ? $phpErrors[$file['error']] : 'Unknown PHP error';
        echo json_encode(['success' => false, 'message' => "Upload Failed: $errorMsg"]);
        exit;
    }

    $fileName = $file['name'];
    $fileTmp = $file['tmp_name'];
    $fileSize = $file['size'];
    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    $uniqueName = uniqid() . '_' . $fileName;
    $destination = $uploadDir . $uniqueName;

    if (move_uploaded_file($fileTmp, $destination)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO materials (filename, filepath, filetype, filesize) VALUES (?, ?, ?, ?)");
            $stmt->execute([$fileName, $destination, $ext, $fileSize]);
            $response['success'] = true;
            $response['message'] = "File uploaded successfully!";
        } catch (PDOException $e) {
            $response['message'] = "Database Error: " . $e->getMessage();
        }
    } else {
        // Get the specific system error if move fails
        $error = error_get_last();
        $response['message'] = "Failed to move file. System says: " . $error['message'];
    }
} else {
    $response['message'] = "No file received or method not POST.";
}

header('Content-Type: application/json');
echo json_encode($response);
?>