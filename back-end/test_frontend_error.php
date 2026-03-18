<?php

echo "Frontend Error Diagnosis\n";
echo "========================\n";

// Test 1: Vérifier si le frontend React est accessible
echo "1. React Frontend Check:\n";
try {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n"
        ]
    ]);
    $response = file_get_contents('http://localhost:3000', false, $context);
    
    if (strpos($response, 'react') !== false || strpos($response, 'React') !== false) {
        echo "✅ React app running\n";
    } else {
        echo "❌ React app not detected\n";
    }
    
} catch (Exception $e) {
    echo "❌ Frontend inaccessible: " . $e->getMessage() . "\n";
}

echo "\n2. Register Page Check:\n";
try {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n"
        ]
    ]);
    $response = file_get_contents('http://localhost:3000/register', false, $context);
    
    echo "✅ Register page accessible: " . strlen($response) . " bytes\n";
    
} catch (Exception $e) {
    echo "❌ Register page error: " . $e->getMessage() . "\n";
}

echo "\n3. CORS Preflight Test:\n";
try {
    $context = stream_context_create([
        'http' => [
            'method' => 'OPTIONS',
            'header' => "Origin: http://localhost:3000\r\nAccess-Control-Request-Method: POST\r\nAccess-Control-Request-Headers: Content-Type\r\n"
        ]
    ]);
    $response = file_get_contents('http://localhost:8000/api/register', false, $context);
    
    echo "✅ CORS preflight: " . $http_response_header[0] ?? "No headers\n";
    
} catch (Exception $e) {
    echo "❌ CORS preflight error: " . $e->getMessage() . "\n";
}

echo "\n4. Simulate Browser Request:\n";
try {
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\nOrigin: http://localhost:3000\r\nUser-Agent: Mozilla/5.0\r\n",
            'content' => json_encode([
                'name' => 'Browser Test',
                'email' => 'browser' . time() . '@example.com',
                'phone' => '0600000000',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'patient'
            ])
        ]
    ]);
    
    $response = file_get_contents('http://localhost:8000/api/register', false, $context);
    echo "✅ Browser simulation: " . $response . "\n";
    
} catch (Exception $e) {
    echo "❌ Browser simulation error: " . $e->getMessage() . "\n";
    
    if (isset($http_response_header)) {
        echo "Response headers:\n";
        foreach ($http_response_header as $header) {
            echo "  $header\n";
        }
    }
}

echo "\n" . str_repeat("=", 50) . "\n";
