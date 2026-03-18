<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "DEBUG Patient Registration Error\n";
echo "================================\n";

use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;

// Test 1: Simulation exacte du frontend
echo "1. Frontend Simulation:\n";
try {
    $request = new Request();
    $request->merge([
        'name' => 'Test Patient Frontend',
        'email' => 'patientfrontend' . time() . '@example.com',
        'phone' => '0600000000',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'patient'
    ]);
    
    $authController = new AuthController();
    $response = $authController->register($request);
    
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Response: " . json_encode($response->getData(true), JSON_PRETTY_PRINT) . "\n";
    
} catch (\Exception $e) {
    echo "❌ ERREUR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n2. Database Connection Test:\n";
try {
    \DB::connection()->getPdo();
    echo "✅ Database connected\n";
    
    // Check tables
    $tables = \DB::select('SHOW TABLES');
    echo "Tables: " . implode(', ', array_column($tables, array_keys($tables[0])[0])) . "\n";
    
} catch (\Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}

echo "\n3. User Model Test:\n";
try {
    $user = new \App\Models\User();
    echo "✅ User model accessible\n";
    echo "Fillable: " . implode(', ', $user->getFillable()) . "\n";
    
} catch (\Exception $e) {
    echo "❌ User model error: " . $e->getMessage() . "\n";
}

echo "\n4. Patient Model Test:\n";
try {
    $patient = new \App\Models\Patient();
    echo "✅ Patient model accessible\n";
    echo "Fillable: " . implode(', ', $patient->getFillable()) . "\n";
    
} catch (\Exception $e) {
    echo "❌ Patient model error: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
