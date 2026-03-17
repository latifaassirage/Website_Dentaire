<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller {
    public function register(Request $request) {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'phone' => 'required|string|max:20',
                'password' => 'required|min:8',
                'role' => 'required|in:patient,admin'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            if ($request->role === 'patient') {
                Patient::create([
                    'user_id' => $user->id,
                    'nom' => $request->name,
                    'telephone' => $request->phone,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Compte créé avec succès',
                'role' => $request->role
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du compte: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request) {
        $credentials = $request->only('email', 'password');
        $selectedRole = $request->role;

        // Debug logging
        \Log::info('Login attempt:', [
            'email' => $request->email,
            'role_selected' => $selectedRole,
            'credentials_provided' => !empty($credentials)
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            \Log::info('Auth successful:', [
                'user_role' => $user->role,
                'selected_role' => $selectedRole,
                'user_id' => $user->id
            ]);
            
            // Verify role matches
            if ($user->role !== $selectedRole) {
                \Log::warning('Role mismatch:', [
                    'user_role' => $user->role,
                    'selected_role' => $selectedRole
                ]);
                
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => "Ce compte est de type {$user->role}. Veuillez choisir le bon type de compte."
                ], 403);
            }

            return response()->json([
                'success' => true,
                'role' => $user->role,
                'user_id' => $user->id,
                'name' => $user->name,
                'message' => 'Login successful'
            ]);
        }

        \Log::warning('Auth failed for email:', ['email' => $request->email]);

        return response()->json([
            'success' => false,
            'message' => 'Email ou mot de passe incorrect'
        ], 401);
    }
}
