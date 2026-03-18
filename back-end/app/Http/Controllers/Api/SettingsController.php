<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ClinicSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller {
    public function getSettings() {
        return response()->json([
            'clinicName' => ClinicSetting::get('clinic_name', 'DentalFlow'),
            'clinicAddress' => ClinicSetting::get('clinic_address', ''),
            'clinicPhone' => ClinicSetting::get('clinic_phone', ''),
            'clinicEmail' => ClinicSetting::get('clinic_email', ''),
            'workingHours' => ClinicSetting::getWorkingHours(),
            'appointmentDuration' => ClinicSetting::get('appointment_duration', 30),
            'advanceBookingDays' => ClinicSetting::get('advance_booking_days', 30),
            'autoReminders' => ClinicSetting::get('auto_reminders', true),
            'reminderHours' => ClinicSetting::get('reminder_hours', 24),
            'paymentMethods' => ClinicSetting::get('payment_methods', ['cash', 'card', 'transfer']),
            'currency' => ClinicSetting::get('currency', 'MAD'),
            'taxRate' => ClinicSetting::get('tax_rate', 20),
            'invoicePrefix' => ClinicSetting::get('invoice_prefix', 'INV'),
            'devisPrefix' => ClinicSetting::get('devis_prefix', 'DEV')
        ]);
    }

    public function updateSettings(Request $request) {
        try {
            $validated = $request->validate([
                'clinicName' => 'required|string|max:255',
                'clinicAddress' => 'nullable|string|max:500',
                'clinicPhone' => 'nullable|string|max:20',
                'clinicEmail' => 'nullable|email|max:255',
                'workingHours' => 'required|array',
                'appointmentDuration' => 'required|integer|min:15|max:120',
                'advanceBookingDays' => 'required|integer|min:1|max:365',
                'autoReminders' => 'required|boolean',
                'reminderHours' => 'required|integer|min:1|max:168',
                'paymentMethods' => 'required|array',
                'currency' => 'required|string|max:3',
                'taxRate' => 'required|numeric|min:0|max:100',
                'invoicePrefix' => 'required|string|max:10',
                'devisPrefix' => 'required|string|max:10'
            ]);

            // Mettre à jour chaque setting
            foreach ($validated as $key => $value) {
                if (is_array($value)) {
                    $value = json_encode($value);
                }
                ClinicSetting::set($key, $value);
            }

            return response()->json([
                'success' => true,
                'message' => 'Paramètres mis à jour avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getServices() {
        return response()->json(ClinicSetting::getServices());
    }
}
