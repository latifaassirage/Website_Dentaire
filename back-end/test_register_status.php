<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Checking /api/register Status\n";
echo "============================\n";

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

// Test 1: Vérifier si la route existe
echo "Test 1: Route Check\n";
$routes = Route::getRoutes();
$registerRoute = null;

foreach ($routes as $route) {
    if ($route->uri() === 'register' && in_array('POST', $route->methods())) {
        $registerRoute = $route;
        break;
    }
}

if ($registerRoute) {
    echo "✅ Route POST /register trouvée\n";
    echo "Action: " . $registerRoute->getActionName() . "\n";
    echo "Middleware: " . implode(', ', $registerRoute->middleware()) . "\n";
} else {
    echo "❌ Route POST /register NON TROUVÉE\n";
}

echo "\n" . str_repeat("-", 30) . "\n";

// Test 2: Test direct de l'endpoint
echo "Test 2: Direct API Test\n";
try {
    $response = Http::post('http://localhost:8000/api/register', [
        'name' => 'Test Status',
        'email' => 'teststatus' . time() . '@example.com',
        'phone' => '0600000000',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'patient'
    ]);
    
    echo "Status: " . $response->status() . "\n";
    echo "Headers: " . json_encode($response->headers()) . "\n";
    echo "Body: " . $response->body() . "\n";
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "Type: " . get_class($e) . "\n";
}

echo "\n" . str_repeat("-", 30) . "\n";

// Test 3: Vérifier le serveur Laravel
echo "Test 3: Laravel Server Check\n";
try {
    $response = Http::get('http://localhost:8000/api/');
    echo "API Root Status: " . $response->status() . "\n";
    
    $response = Http::get('http://localhost:8000/api/csrf-token');
    echo "CSRF Token Status: " . $response->status() . "\n";
    
} catch (\Exception $e) {
    echo "❌ Serveur inaccessible: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
