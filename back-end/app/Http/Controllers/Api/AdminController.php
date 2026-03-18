<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller {
    public function getStats() {
        return response()->json([
            'monthlyRevenue' => Invoice::whereMonth('created_at', now()->month)
                                     ->where('status', 'paid')
                                     ->sum('amount'),
            'revenueChange' => 12, // Calculer différence vs mois précédent
            'fillRate' => 92, // Calculer taux de remplissage
            'waitingList' => Appointment::where('status', 'pending')->count(),
            'unpaidInvoices' => Invoice::where('status', '!=', 'paid')->sum('amount'),
            'unpaidPatients' => Invoice::where('status', '!=', 'paid')
                                     ->pluck('patient_id')
                                     ->unique()
                                     ->count()
        ]);
    }

    public function getPatients() {
        try {
            $patients = Patient::with(['user', 'appointments'])
                       ->get();
            
            return response()->json($patients);
        } catch (\Exception $e) {
            \Log::error('Error fetching patients:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des patients: ' . $e->getMessage()
            ], 500);
        }
    }

    public function storePatient(Request $request) {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'phone' => 'required|string|max:20',
                'address' => 'nullable|string',
                'birthDate' => 'nullable|date',
                'emergencyContact' => 'nullable|string|max:255',
                'emergencyPhone' => 'nullable|string|max:20'
            ]);

            // Créer l'utilisateur
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'role' => 'patient',
                'password' => bcrypt(str_random(12)) // Mot de passe temporaire
            ]);

            // Créer le patient
            $patient = Patient::create([
                'user_id' => $user->id,
                'nom' => $validated['name'],
                'telephone' => $validated['phone']
            ]);

            return response()->json([
                'id' => $patient->id,
                'name' => $patient->nom,
                'email' => $user->email,
                'phone' => $patient->telephone,
                'lastVisit' => now()->format('d M Y')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la création du patient: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTodayAgenda() {
        return response()->json(
            Appointment::with('user')
                     ->whereDate('date', today())
                     ->orderBy('time')
                     ->get()
                     ->map(function($appointment) {
                         return [
                             'time' => $appointment->time,
                             'patient' => $appointment->user->name ?? 'N/A',
                             'treatment' => $appointment->type_soin ?? $appointment->service ?? 'Consultation',
                             'status' => $appointment->status
                         ];
                     })
        );
    }

    public function getWeekAppointments() {
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();

        return response()->json(
            Appointment::with('user')
                     ->whereBetween('date', [$startOfWeek, $endOfWeek])
                     ->orderBy('date')
                     ->orderBy('time')
                     ->get()
                     ->map(function($appointment) {
                         $dateTime = $appointment->date . ' ' . $appointment->time;
                         $carbonDateTime = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $dateTime . ':00');
                         
                         return [
                             'day' => strtoupper($carbonDateTime->locale('fr')->format('D d')),
                             'time' => $carbonDateTime->format('H:i'),
                             'patient' => $appointment->user->name ?? 'N/A',
                             'type' => $appointment->type_soin ?? $appointment->service ?? 'Consultation',
                             'status' => $appointment->status
                         ];
                     })
        );
    }

    public function getFinancialData() {
        return response()->json(
            Invoice::with(['patient', 'appointment'])
                   ->orderBy('created_at', 'desc')
                   ->limit(50)
                   ->get()
                   ->map(function($invoice) {
                       return [
                           'id' => $invoice->id,
                           'patient' => $invoice->patient ? $invoice->patient->name : 'N/A',
                           'date' => $invoice->created_at->format('d M Y'),
                           'amount' => $invoice->amount,
                           'status' => $invoice->status,
                           'type' => $invoice->type
                       ];
                   })
        );
    }

    public function updateInvoice(Request $request, $id) {
        try {
            $invoice = Invoice::findOrFail($id);
            
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0',
                'status' => 'required|in:draft,sent,paid,overdue,cancelled',
                'type' => 'required|in:devis,facture',
                'due_date' => 'nullable|date',
                'notes' => 'nullable|string'
            ]);

            $invoice->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Facture mise à jour avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getFinancialPerformance() {
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyData[] = [
                'month' => $month->locale('fr')->format('M'),
                'revenue' => Invoice::whereMonth('created_at', $month)
                                  ->where('status', 'paid')
                                  ->sum('amount')
            ];
        }

        return response()->json([
            'labels' => array_column($monthlyData, 'month'),
            'data' => array_column($monthlyData, 'revenue')
        ]);
    }
}
