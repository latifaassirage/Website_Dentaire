<?php

namespace Database\Seeders;
use App\Models\Patient;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   

public function run(): void
{
    Patient::create([
        'nom' => 'Alami',
        'prenom' => 'Majid',
        'telephone' => '0699381473'
    ]);
}
}
