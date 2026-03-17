<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function getDossier($id) {
        $patient = Patient::with('appointments')->findOrFail($id);
        return response()->json($patient);
    }

    public function getMyAppointments($id) {
        $appointments = Appointment::where('patient_id', $id)
                                   ->orderBy('date_heure', 'desc')
                                   ->get();
        return response()->json($appointments);
    }
}
