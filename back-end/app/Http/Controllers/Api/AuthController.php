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
            $messages = [
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
                'role.in' => 'Le rôle doit être patient ou admin',
            ];

            $validator = \Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'phone' => 'required|string|max:20|regex:/^[0-9]{10}$/',
                'password' => 'required|min:8|confirmed',
                'role' => 'required|in:patient,admin'
            ], $messages);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors(),
                    'field_errors' => $this->formatValidationErrors($validator->errors())
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            if ($request->role === 'patient') {
                // Séparer le nom complet en nom et prénom
                $nameParts = explode(' ', $request->name, 2);
                $nom = $nameParts[0] ?? $request->name;
                $prenom = $nameParts[1] ?? '';
                
                Patient::create([
                    'user_id' => $user->id,
                    'nom' => $nom,
                    'prenom' => $prenom,
                    'telephone' => $request->phone,
                    'email' => $request->email,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Compte créé avec succès',
                'role' => $request->role,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone
                ]
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du compte: ' . $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    private function formatValidationErrors($errors)
    {
        $formatted = [];
        foreach ($errors->messages() as $field => $messages) {
            $formatted[$field] = [
                'field' => $field,
                'message' => $messages[0],
                'rules' => [
                    'name' => 'Doit être une chaîne de caractères, max 255',
                    'email' => 'Doit être un email valide et unique',
                    'phone' => 'Doit être 10 chiffres (ex: 0600000000)',
                    'password' => 'Minimum 8 caractères et confirmation identique'
                ]
            ];
        }
        return $formatted;
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

            // Generate token for API authentication
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'role' => $user->role,
                'user_id' => $user->id,
                'name' => $user->name,
                'token' => $token,
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
