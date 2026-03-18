<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\Patient;

class DashboardController extends Controller {
    public function getPatients() { 
        return User::where('role', 'patient')
                   ->with('patient')
                   ->get()
                   ->map(function($user) {
                       return [
                           'id' => $user->id,
                           'name' => $user->name,
                           'email' => $user->email,
                           'phone' => $user->phone,
                           'created_at' => $user->created_at->format('d/m/Y'),
                           'patient_info' => $user->patient ? [
                               'address' => $user->patient->address,
                               'birth_date' => $user->patient->birth_date ? $user->patient->birth_date->format('d/m/Y') : null,
                               'emergency_contact' => $user->patient->emergency_contact,
                               'emergency_phone' => $user->patient->emergency_phone
                           ] : null
                       ];
                   });
    }
    
    public function getAppointments() { 
        return Appointment::with(['patient', 'patient.user'])
                     ->where('status', '!=', 'cancelled')
                     ->orderBy('date_appointment', 'desc')
                     ->get()
                     ->map(function($app) {
                         return [
                             'id' => $app->id,
                             'title' => $app->patient->name . ' (' . $app->type_soin . ')',
                             'start' => $app->date_appointment . 'T' . $app->time_appointment,
                             'status' => $app->status,
                             'type_soin' => $app->type_soin,
                             'date_appointment' => $app->date_appointment,
                             'time_appointment' => $app->time_appointment,
                             'date_heure' => $app->date_heure,
                             'notes' => $app->notes,
                             'patient' => $app->patient ? [
                                 'name' => $app->patient->nom,
                                 'phone' => $app->patient->telephone
                             ] : null
                         ];
                     });
    }

    public function getInvoices() { 
        return Invoice::with(['patient', 'patient.user'])
                   ->orderBy('created_at', 'desc')
                   ->get()
                   ->map(function($invoice) {
                       return [
                           'id' => $invoice->id,
                           'reference' => 'INV-' . str_pad($invoice->id, 4, '0', STR_PAD_LEFT),
                           'amount' => $invoice->amount,
                           'status' => $invoice->status,
                           'type' => $invoice->type,
                           'due_date' => $invoice->due_date ? $invoice->due_date->format('d/m/Y') : null,
                           'created_at' => $invoice->created_at->format('d/m/Y'),
                           'date_facture' => $invoice->created_at->format('d/m/Y'),
                           'montant' => $invoice->amount,
                           'statut' => $invoice->status,
                           'description' => $invoice->notes,
                           'patient' => $invoice->patient ? [
                               'name' => $invoice->patient->nom
                           ] : null
                       ];
                   });
    }

    public function getPatientData() {
        $user = auth()->user();
        
        if (!$user || $user->role !== 'patient') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Récupérer les informations du patient
        $patient = $user->patient;
        
        // Historique des rendez-vous
        $history = Appointment::where('patient_id', $user->id)
                        ->orderBy('date', 'desc')
                        ->get()
                        ->map(function($apt) {
                            return [
                                'id' => $apt->id,
                                'type_soin' => $apt->type_soin ?? $apt->service,
                                'date_appointment' => $apt->date_appointment ?? $apt->date,
                                'time_appointment' => $apt->time_appointment ?? $apt->time,
                                'date_heure' => $apt->date_heure,
                                'status' => $apt->status,
                                'notes' => $apt->notes,
                                'created_at' => $apt->created_at->format('d/m/Y H:i'),
                                'patient' => [
                                    'name' => $apt->patient->name ?? $user->name,
                                    'phone' => $apt->patient->phone ?? $user->phone
                                ]
                            ];
                        });

        // Paiements et factures
        $payments = Invoice::where('patient_id', $user->id)
                     ->orderBy('created_at', 'desc')
                     ->get()
                     ->map(function($invoice) {
                         return [
                             'id' => $invoice->id,
                             'reference' => 'INV-' . str_pad($invoice->id, 4, '0', STR_PAD_LEFT),
                             'amount' => $invoice->amount,
                             'status' => $invoice->status,
                             'type' => $invoice->type,
                             'due_date' => $invoice->due_date ? $invoice->due_date->format('d/m/Y') : null,
                             'created_at' => $invoice->created_at->format('d/m/Y'),
                             'date_facture' => $invoice->created_at->format('d/m/Y'),
                             'montant' => $invoice->amount,
                             'statut' => $invoice->status,
                             'description' => $invoice->notes,
                             'payment_method' => $invoice->payment_method ?? 'cash'
                         ];
                     });

        // Informations personnelles et médicales
        $info = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'created_at' => $user->created_at->format('d/m/Y'),
            'last_login' => $user->last_login_at ? $user->last_login_at->format('d/m/Y H:i') : 'Jamais'
        ];

        // Ajouter les informations médicales si disponibles
        if ($patient) {
            $info['blood_type'] = $patient->blood_type ?? 'O+';
            $info['allergies'] = $patient->allergies ?? 'Aucune connue';
            $info['medications'] = $patient->medications ?? 'Aucun';
            $info['medical_history'] = $patient->medical_history ?? 'Aucun antécédent';
            $info['emergency_contact'] = $patient->emergency_contact ?? 'À compléter';
            $info['emergency_phone'] = $patient->emergency_phone ?? 'À compléter';
            $info['address'] = $patient->address ?? 'Non renseigné';
            $info['birth_date'] = $patient->birth_date ? $patient->birth_date->format('d/m/Y') : null;
        }

        return response()->json([
            'history' => $history,
            'payments' => $payments,
            'info' => $info,
            'stats' => [
                'total_appointments' => $history->count(),
                'completed_appointments' => $history->where('status', 'completed')->count(),
                'cancelled_appointments' => $history->where('status', 'cancelled')->count(),
                'total_payments' => $payments->count(),
                'paid_amount' => $payments->where('status', 'paid')->sum('amount'),
                'pending_amount' => $payments->where('status', 'pending')->sum('amount')
            ]
        ]);
    }
}
