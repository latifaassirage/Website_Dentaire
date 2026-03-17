<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class AuthController extends Controller {
    public function login(Request $request) {
        $credentials = $request->only('email', 'password');
        if ($credentials['email'] === 'admin@dental.com' && $credentials['password'] === 'admin123') {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 401);
    }
}
