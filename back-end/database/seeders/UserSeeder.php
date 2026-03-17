<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder {
    public function run() {
        // Create admin user
        User::create([
            'name' => 'Admin Test',
            'email' => 'admin@dental.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }
}
