<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClinicSetting;

class ClinicSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'clinic_name',
                'value' => 'DentalFlow',
                'type' => 'text',
                'description' => 'Nom du cabinet dentaire'
            ],
            [
                'key' => 'clinic_address',
                'value' => '123 Rue Hassan, Agadir 80000, Maroc',
                'type' => 'text',
                'description' => 'Adresse du cabinet'
            ],
            [
                'key' => 'clinic_phone',
                'value' => '+212 5 12345678',
                'type' => 'text',
                'description' => 'Téléphone du cabinet'
            ],
            [
                'key' => 'clinic_email',
                'value' => 'contact@dentalflow.ma',
                'type' => 'text',
                'description' => 'Email du cabinet'
            ],
            [
                'key' => 'monday_hours',
                'value' => '09:00-18:00',
                'type' => 'text',
                'description' => 'Horaires d\'ouverture Lundi'
            ],
            [
                'key' => 'tuesday_hours',
                'value' => '09:00-18:00',
                'type' => 'text',
                'description' => 'Horaires d\'ouverture Mardi'
            ],
            [
                'key' => 'wednesday_hours',
                'value' => '09:00-18:00',
                'type' => 'text',
                'description' => 'Horaires d\'ouverture Mercredi'
            ],
            [
                'key' => 'thursday_hours',
                'value' => '09:00-18:00',
                'type' => 'text',
                'description' => 'Horaires d\'ouverture Jeudi'
            ],
            [
                'key' => 'friday_hours',
                'value' => '09:00-18:00',
                'type' => 'text',
                'description' => 'Horaires d\'ouverture Vendredi'
            ],
            [
                'key' => 'saturday_hours',
                'value' => '09:00-14:00',
                'type' => 'text',
                'description' => 'Horaires d\'ouverture Samedi'
            ],
            [
                'key' => 'sunday_hours',
                'value' => 'Fermé',
                'type' => 'text',
                'description' => 'Horaires d\'ouverture Dimanche'
            ],
            [
                'key' => 'consultation_price',
                'value' => '300.00',
                'type' => 'number',
                'description' => 'Prix de la consultation'
            ],
            [
                'key' => 'detartrage_price',
                'value' => '450.00',
                'type' => 'number',
                'description' => 'Prix du détartrage'
            ],
            [
                'key' => 'blanchiment_price',
                'value' => '800.00',
                'type' => 'number',
                'description' => 'Prix du blanchiment'
            ],
            [
                'key' => 'cancellation_policy',
                'value' => '24',
                'type' => 'number',
                'description' => 'Délai d\'annulation en heures'
            ]
        ];

        foreach ($settings as $setting) {
            ClinicSetting::create($setting);
        }
    }
}
