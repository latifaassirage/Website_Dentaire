<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'user_id', 
        'nom', 
        'telephone', 
        'email', 
        'address', 
        'birth_date', 
        'emergency_contact', 
        'emergency_phone',
        'blood_type',
        'allergies',
        'medications',
        'medical_history',
        'payment_method'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function appointments() {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function invoices() {
        return $this->hasMany(Invoice::class, 'patient_id');
    }

    public function getFullNameAttribute() {
        return $this->nom;
    }

    public function getLastVisitAttribute() {
        return $this->appointments()
                    ->latest('date_heure')
                    ->first()
                    ?->date_heure
                    ?->format('d M Y') ?? 'N/A';
    }
}
