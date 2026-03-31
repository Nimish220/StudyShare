<?php
include 'db.php';

$query = isset($_GET['q']) ? $_GET['q'] : '';
$type = isset($_GET['type']) ? $_GET['type'] : 'all';

$sql = "SELECT * FROM materials WHERE filename LIKE :query";
$params = [':query' => "%$query%"];

if ($type !== 'all') {
    if ($type === 'image') {
        $sql .= " AND filetype IN ('jpg', 'png', 'webp', 'jpeg')";
    } else {
        $sql .= " AND filetype = :type";
        $params[':type'] = $type;
    }
}

$sql .= " ORDER BY upload_date DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$files = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($files);
?>