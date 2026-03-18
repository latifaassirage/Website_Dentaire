<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Message::with(['sender', 'receiver'])
                     ->where(function($query) use ($user) {
                         $query->where('sender_id', $user->id)
                               ->orWhere('receiver_id', $user->id);
                     });

        // Filtrage par type si spécifié
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Messages non lus en premier
        $query->orderBy('read', 'asc')->orderBy('created_at', 'desc');

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'content' => 'required|string|max:1000',
            'type' => 'required|in:system,appointment,patient,admin'
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'subject' => $request->subject,
            'content' => $request->content,
            'type' => $request->type,
            'read' => false
        ]);

        return response()->json($message, 201);
    }

    public function markAsRead(Request $request, $id)
    {
        $message = Message::findOrFail($id);
        
        // Vérifier que l'utilisateur peut marquer ce message comme lu
        if ($message->receiver_id !== Auth::id() && $message->sender_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->update(['read' => true]);

        return response()->json(['success' => true]);
    }

    public function getUnreadCount()
    {
        $user = Auth::user();
        
        return response()->json([
            'count' => Message::where('receiver_id', $user->id)
                         ->where('read', false)
                         ->count()
        ]);
    }

    public function getSystemMessages()
    {
        $user = Auth::user();
        
        $messages = Message::where('type', 'system')
                     ->where('receiver_id', $user->id)
                     ->orderBy('created_at', 'desc')
                     ->limit(10)
                     ->get();

        return response()->json($messages);
    }

    public function sendAppointmentReminder(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'patient_id' => 'required|exists:users,id',
            'message' => 'required|string|max:500'
        ]);

        $appointment = Appointment::findOrFail($request->appointment_id);
        $patient = User::findOrFail($request->patient_id);

        // Créer un message système pour le rappel
        $message = Message::create([
            'sender_id' => null, // Message système
            'receiver_id' => $patient->id,
            'subject' => 'Rappel de rendez-vous',
            'content' => $request->message,
            'type' => 'appointment'
        ]);

        return response()->json($message, 201);
    }
}
