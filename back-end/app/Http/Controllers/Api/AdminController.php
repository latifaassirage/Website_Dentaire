<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AdminController extends Controller {
    public function getStats() {
        return response()->json([
            'total_patients' => Patient::count(),
            'rdv_today' => Appointment::whereDate('date_heure', today())->count()
        ]);
    }

    public function getPatients() {
        return response()->json(Patient::all());
    }

    public function storePatient(Request $request) {
        $patient = Patient::create($request->all());
        return response()->json($patient, 201);
    }
}
