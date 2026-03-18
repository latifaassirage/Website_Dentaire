<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\WaitingListController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\MessageController;

// Apply CORS middleware to all routes
Route::middleware(['cors', 'api'])->group(function () {
    // Public routes
    Route::get('/csrf-token', function () {
        return response()->json(['csrfToken' => csrf_token()]);
    });

    // Authentication Routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Public Routes
    Route::get('/appointments/calendar', [AppointmentController::class, 'getCalendar']);
    Route::get('/appointments/available-slots', [AppointmentController::class, 'getAvailableSlots']);
    Route::get('/waiting-lists/available-slots', [WaitingListController::class, 'getAvailableSlots']);

    // Dashboard Routes
    Route::get('/stats', [AdminController::class, 'getStats']);
    Route::get('/patients-list', [DashboardController::class, 'getPatients']);
    Route::get('/invoices', [DashboardController::class, 'getInvoices']);
    
    // Routes requiring authentication
    Route::middleware(['auth:api'])->group(function () {
        Route::get('/patient/data', [DashboardController::class, 'getPatientData']);
        
        // Appointment Routes
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
        Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
        Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);

        // Waiting List Routes
        Route::get('/waiting-lists', [WaitingListController::class, 'index']);
        Route::post('/waiting-lists', [WaitingListController::class, 'store']);
        Route::put('/waiting-lists/{waitingList}', [WaitingListController::class, 'update']);
        Route::delete('/waiting-lists/{waitingList}', [WaitingListController::class, 'destroy']);
        Route::post('/waiting-lists/{waitingList}/convert', [WaitingListController::class, 'conv']);
    });

    // Admin Routes (require authentication)
    Route::middleware(['auth:api'])->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/patients', [AdminController::class, 'getPatients']);
        Route::post('/patients', [AdminController::class, 'storePatient']);
        
        // Agenda
        Route::get('/agenda/today', [AdminController::class, 'getTodayAgenda']);
        Route::get('/agenda/week', [AdminController::class, 'getWeekAppointments']);
        
        // Finance
        Route::get('/finance', [FinanceController::class, 'index']);
        Route::get('/finance/performance', [FinanceController::class, 'performance']);
        Route::put('/finance/{id}', [FinanceController::class, 'update']);
        
        // Settings
        Route::get('/settings', [SettingsController::class, 'getSettings']);
        Route::post('/settings', [SettingsController::class, 'updateSettings']);
        Route::get('/services', [SettingsController::class, 'getServices']);
    });

    // Patient Routes (require authentication)
    Route::middleware(['auth:api'])->prefix('patient')->group(function () {
        Route::get('/dossier/{id}', [PatientController::class, 'getDossier']);
        
        // Appointments
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
        Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
        Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
        
        // Messages
        Route::get('/messages', [MessageController::class, 'index']);
        Route::post('/messages', [MessageController::class, 'store']);
        Route::put('/messages/{message}/read', [MessageController::class, 'markAsRead']);
        Route::get('/messages/unread-count', [MessageController::class, 'getUnreadCount']);
        Route::get('/messages/system', [MessageController::class, 'getSystemMessages']);
        
        // Documents
        Route::get('/documents', [DocumentController::class, 'index']);
        Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
        
        // Payments
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::post('/payments/{payment}/pay', [PaymentController::class, 'processPayment']);
        
        // Profile
        Route::get('/profile', [UserController::class, 'getProfile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
    });

    // User Routes (require authentication)
    Route::middleware(['auth:api'])->group(function () {
        Route::get('/user/profile', [UserController::class, 'getProfile']);
        Route::put('/user/profile', [UserController::class, 'updateProfile']);
        
        // Messages Routes
        Route::get('/messages', [MessageController::class, 'index']);
        Route::post('/messages', [MessageController::class, 'store']);
        Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);
        Route::get('/messages/unread-count', [MessageController::class, 'getUnreadCount']);
        Route::get('/messages/system', [MessageController::class, 'getSystemMessages']);
        Route::post('/messages/appointment-reminder', [MessageController::class, 'sendAppointmentReminder']);
    });
});