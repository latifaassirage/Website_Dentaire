<?php

// Test simple pour vérifier si PHP fonctionne
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    echo json_encode([
        'success' => true,
        'message' => 'Test simple réussi',
        'received' => $input,
        'method' => $_SERVER['REQUEST_METHOD'],
        'headers' => getallheaders()
    ]);
} else {
    echo json_encode([
        'message' => 'Test simple - endpoint actif',
        'method' => $_SERVER['REQUEST_METHOD'],
        'time' => date('Y-m-d H:i:s')
    ]);
}
?>
