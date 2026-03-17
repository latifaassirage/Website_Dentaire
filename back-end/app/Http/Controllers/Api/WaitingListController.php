<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaitingList;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WaitingListController extends Controller
{
    public function index(Request $request)
    {
        $waitingLists = WaitingList::with('patient')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($waitingLists);
    }

    public function store(Request $request)
    {
        \Log::info('Waiting list creation attempt:', $request->all());
        
        try {
            $request->validate([
                'patient_id' => 'required|exists:users,id',
                'service' => 'required|in:consultation,detartrage,orthodontie,implantologie,blanchiment,conservation,prothese,depistage,urgence',
                'preferred_date' => 'nullable|date|after_or_equal:today',
                'preferred_time' => 'nullable|date_format:H:i',
                'priority' => 'required|in:low,medium,high,urgent',
                'notes' => 'nullable|string|max:500'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Waiting list validation failed:', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            $patientId = $request->patient_id;
            \Log::info('Creating waiting list entry with patient_id:', ['patient_id' => $patientId]);
            
            $waitingList = WaitingList::create([
                'patient_id' => $patientId,
                'service' => $request->service,
                'preferred_date' => $request->preferred_date,
                'preferred_time' => $request->preferred_time,
                'priority' => $request->priority,
                'notes' => $request->notes,
                'status' => 'pending'
            ]);

            \Log::info('Waiting list entry created successfully:', ['id' => $waitingList->id]);

            return response()->json($waitingList, 201);
        } catch (\Exception $e) {
            \Log::error('Waiting list creation failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création dans la liste d\'attente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, WaitingList $waitingList)
    {
        $request->validate([
            'status' => 'required|in:pending,contacted,scheduled,cancelled'
        ]);

        $waitingList->update([
            'status' => $request->status
        ]);

        return response()->json($waitingList);
    }

    public function destroy(WaitingList $waitingList)
    {
        $waitingList->delete();
        return response()->json(null, 204);
    }

    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'service' => 'required|in:consultation,detartrage,orthodontie,implantologie,blanchiment,conservation,prothese,depistage,urgence'
        ]);

        $date = $request->date;
        $service = $request->service;

        // Get existing appointments for the date
        $existingAppointments = Appointment::where('date', $date)
            ->where('status', '!=', 'cancelled')
            ->get(['time']);

        // Define available time slots
        $allSlots = [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00'
        ];

        // Remove occupied slots
        $occupiedSlots = $existingAppointments->pluck('time')->toArray();
        $availableSlots = array_diff($allSlots, $occupiedSlots);

        return response()->json(array_values($availableSlots));
    }

    public function convertToAppointment(Request $request, WaitingList $waitingList)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i'
        ]);

        $appointment = Appointment::create([
            'patient_id' => $waitingList->patient_id,
            'service' => $waitingList->service,
            'date' => $request->date,
            'time' => $request->time,
            'status' => 'confirmed',
            'notes' => $waitingList->notes
        ]);

        $waitingList->update(['status' => 'scheduled']);

        return response()->json($appointment, 201);
    }
}
