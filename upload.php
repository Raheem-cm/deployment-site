 <?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['sessionFile'])) {
        $file = $_FILES['sessionFile'];
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileName = uniqid('session_') . '_' . basename($file['name']);
        $filePath = $uploadDir . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            echo json_encode(['success' => true, 'file' => $fileName]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Upload failed']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}
?>
