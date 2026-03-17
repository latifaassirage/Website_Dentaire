<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Appointment;
use App\Models\Invoice;

class DashboardController extends Controller {
    public function getPatients() { return User::where('role', 'patient')->get(); }
    
    public function getAppointments() { 
        return Appointment::with('user')->get()->map(fn($app) => [
            'id' => $app->id,
            'title' => $app->user->name . ' (' . $app->type_soin . ')',
            'start' => $app->date_appointment . 'T' . $app->time_appointment,
            'status' => $app->status
        ]);
    }

    public function getInvoices() { return Invoice::with('user')->get(); }

    public function getPatientData() {
        $user = auth()->user();

        return response()->json([
            'history' => $user->appointments()->orderBy('date_appointment', 'desc')->get(),
            'payments' => $user->invoices()->orderBy('date_facture', 'desc')->get(),
            'info' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at->format('d/m/Y')
            ]
        ]);
    }
}
