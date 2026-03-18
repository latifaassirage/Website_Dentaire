<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing API Register Endpoint\n";
echo "============================\n";

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

// Test data
$testData = [
    'name' => 'Test Patient',
    'email' => 'testpatient' . time() . '@example.com',
    'phone' => '0600000000',
    'password' => 'password123',
    'password_confirmation' => 'password123',
    'role' => 'patient'
];

echo "Test Data:\n";
echo json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

// Create request
$request = new Request();
$request->merge($testData);

// Simulate API call
echo "Testing POST /api/register...\n";

try {
    $response = Http::post('http://localhost:8000/api/register', $testData);
    
    echo "Status Code: " . $response->status() . "\n";
    echo "Response:\n";
    echo json_encode($response->json(), JSON_PRETTY_PRINT) . "\n";
    
} catch (\Exception $e) {
    echo "❌ Request failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test validation directly
echo "\nTesting Validation Rules:\n";

$validator = \Validator::make($testData, [
    'name' => 'required|string|max:255',
    'email' => 'required|email|unique:users',
    'phone' => 'required|string|max:20|regex:/^[0-9]{10}$/',
    'password' => 'required|min:8|confirmed',
    'role' => 'required|in:patient,admin'
], [
    'name.required' => 'Le nom est obligatoire',
    'name.string' => 'Le nom doit être une chaîne de caractères',
    'name.max' => 'Le nom ne doit pas dépasser 255 caractères',
    'email.required' => 'L\'email est obligatoire',
    'email.email' => 'Veuillez entrer une adresse email valide',
    'email.unique' => 'Cet email est déjà utilisé',
    'phone.required' => 'Le téléphone est obligatoire',
    'phone.string' => 'Le téléphone doit être une chaîne de caractères',
    'phone.max' => 'Le téléphone ne doit pas dépasser 20 caractères',
    'phone.regex' => 'Le format du téléphone n\'est pas valide (ex: 0600000000)',
    'password.required' => 'Le mot de passe est obligatoire',
    'password.min' => 'Le mot de passe doit contenir au moins 8 caractères',
    'password.confirmed' => 'La confirmation du mot de passe ne correspond pas',
    'role.required' => 'Le rôle est obligatoire',
    'role.in' => 'Le rôle doit être patient ou admin'
]);

if ($validator->fails()) {
    echo "❌ Validation failed:\n";
    $errors = $validator->errors();
    foreach ($errors->messages() as $field => $messages) {
        echo "  - $field: " . implode(', ', $messages) . "\n";
    }
} else {
    echo "✅ Validation passed!\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
