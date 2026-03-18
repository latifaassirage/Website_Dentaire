<?php

echo "Testing Frontend Register Endpoint\n";
echo "=================================\n";

// Test 1: Vérifier si le frontend répond
echo "1. Frontend Status Check:\n";
try {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: Mozilla/5.0\r\n"
        ]
    ]);
    $response = file_get_contents('http://localhost:3000', false, $context);
    echo "✅ Frontend responds: " . substr($response, 0, 100) . "...\n";
} catch (Exception $e) {
    echo "❌ Frontend error: " . $e->getMessage() . "\n";
}

echo "\n2. Register Page Check:\n";
try {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: Mozilla/5.0\r\n"
        ]
    ]);
    $response = file_get_contents('http://localhost:3000/register', false, $context);
    echo "✅ Register page responds: " . substr($response, 0, 100) . "...\n";
    
    // Vérifier si c'est une page React
    if (strpos($response, 'react') !== false || strpos($response, 'React') !== false) {
        echo "✅ React app detected\n";
    }
    
} catch (Exception $e) {
    echo "❌ Register page error: " . $e->getMessage() . "\n";
}

echo "\n3. API Test from Frontend Context:\n";
try {
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\nOrigin: http://localhost:3000\r\n",
            'content' => json_encode([
                'name' => 'Frontend Test',
                'email' => 'frontend' . time() . '@example.com',
                'phone' => '0600000000',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'patient'
            ])
        ]
    ]);
    
    $response = file_get_contents('http://localhost:8000/api/register', false, $context);
    echo "✅ API from frontend context: " . $response . "\n";
    
} catch (Exception $e) {
    echo "❌ API from frontend error: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
