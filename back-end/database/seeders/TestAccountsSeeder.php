<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Support\Facades\Hash;

class TestAccountsSeeder extends Seeder
{
    public function run(): void
    {
        // Create or update Admin account
        $admin = User::updateOrCreate(
            ['email' => 'admin@dental.com'],
            [
                'name' => 'Admin DentalFlow',
                'phone' => '0600000001',
                'password' => Hash::make('admin1234'),
                'role' => 'admin',
            ]
        );

        // Create or update Patient account
        $patient = User::updateOrCreate(
            ['email' => 'patient@dental.com'],
            [
                'name' => 'Patient Test',
                'phone' => '0600000002',
                'password' => Hash::make('patient1234'),
                'role' => 'patient',
            ]
        );

        // Create or update patient record for patient user
        Patient::updateOrCreate(
            ['user_id' => $patient->id],
            [
                'nom' => 'Patient Test',
                'prenom' => 'Test',
                'telephone' => '0600000002',
                'email' => 'patient@dental.com',
            ]
        );

        $this->command->info('✅ Comptes de test créés avec succès:');
        $this->command->info('📧 Admin: admin@dental.com | Mot de passe: admin1234');
        $this->command->info('👤 Patient: patient@dental.com | Mot de passe: patient1234');
    }
}
