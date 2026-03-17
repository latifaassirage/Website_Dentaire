<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\WaitingListController;
use App\Http\Controllers\Api\DashboardController;

// Apply CORS middleware to all routes
Route::middleware(['cors'])->group(function () {
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
    Route::get('/appointments', [DashboardController::class, 'getAppointments']);
    Route::get('/invoices', [DashboardController::class, 'getInvoices']);
    Route::get('/patient/data', [DashboardController::class, 'getPatientData']);

    // Appointment Routes
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
    Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);

    // Waiting List Routes (require authentication)
    Route::middleware(['web'])->group(function () {
        Route::get('/waiting-lists', [WaitingListController::class, 'index']);
        Route::post('/waiting-lists', [WaitingListController::class, 'store']);
        Route::put('/waiting-lists/{waitingList}', [WaitingListController::class, 'update']);
        Route::delete('/waiting-lists/{waitingList}', [WaitingListController::class, 'destroy']);
        Route::post('/waiting-lists/{waitingList}/convert', [WaitingListController::class, 'convertToAppointment']);
    });

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/patients', [AdminController::class, 'getPatients']);
        Route::post('/patients', [AdminController::class, 'storePatient']);
    });

    // Patient Routes
    Route::prefix('patient')->group(function () {
        Route::get('/dossier/{id}', [PatientController::class, 'getDossier']);
        Route::get('/appointments/{id}', [PatientController::class, 'getMyAppointments']);
    });
});