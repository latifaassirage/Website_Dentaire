<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\WaitingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = Appointment::with(['patient', 'assignedTo'])
            ->when($request->date, function($query, $date) {
                return $query->whereDate('date', $date);
            })
            ->when($request->status, function($query, $status) {
                return $query->where('status', $status);
            })
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        \Log::info('Appointment creation attempt:', $request->all());
        
        try {
            $request->validate([
                'patient_id' => 'required|exists:users,id',
                'service' => 'required|in:consultation,detartrage,orthodontie,implantologie,blanchiment,conservation,prothese,depistage,urgence',
                'date' => 'required|date|after_or_equal:today',
                'time' => 'required|date_format:H:i',
                'price' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string|max:500'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            $appointment = Appointment::create([
                'patient_id' => $request->patient_id,
                'assigned_to' => Auth::id(),
                'service' => $request->service,
                'date' => $request->date,
                'time' => $request->time,
                'price' => $request->price,
                'status' => 'confirmed',
                'notes' => $request->notes
            ]);

            \Log::info('Appointment created successfully:', ['appointment_id' => $appointment->id]);

            return response()->json($appointment, 201);
        } catch (\Exception $e) {
            \Log::error('Appointment creation failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du rendez-vous: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Appointment $appointment)
    {
        $request->validate([
            'status' => 'required|in:confirmed,pending,cancelled,completed',
            'notes' => 'nullable|string|max:500'
        ]);

        $appointment->update($request->only(['status', 'notes']));

        return response()->json($appointment);
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return response()->json(null, 204);
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $request->validate([
            'cancellation_reason' => 'required|string|max:500'
        ]);

        if (!$appointment->canBeCancelled()) {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut plus être annulé (moins de 24h avant)'
            ], 422);
        }

        $appointment->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $request->cancellation_reason
        ]);

        return response()->json($appointment);
    }

    public function getCalendar(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        $appointments = Appointment::with(['patient'])
            ->whereBetween('date', [$request->start_date, $request->end_date])
            ->where('status', '!=', 'cancelled')
            ->get()
            ->map(function($appointment) {
                return [
                    'id' => $appointment->id,
                    'title' => $appointment->patient->name . ' - ' . $appointment->service_label,
                    'start' => $appointment->date . 'T' . $appointment->time,
                    'backgroundColor' => $appointment->status === 'confirmed' ? '#00a896' : '#fab1a0',
                    'textColor' => '#ffffff',
                    'extendedProps' => [
                        'patient' => $appointment->patient,
                        'service' => $appointment->service,
                        'status' => $appointment->status
                    ]
                ];
            });

        return response()->json($appointments);
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
        $existingAppointments = Appointment::whereDate('date', $date)
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
}
