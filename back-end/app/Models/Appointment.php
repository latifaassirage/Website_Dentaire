<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'assigned_to',
        'service',
        'date', // Champ original de la migration
        'time', // Champ original de la migration
        'date_heure', // Champ combiné date+time
        'type_soin', // Pour compatibilité avec frontend
        'date_appointment', // Pour compatibilité avec frontend
        'time_appointment', // Pour compatibilité avec frontend
        'price',
        'status',
        'notes',
        'cancelled_at',
        'cancellation_reason'
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'string',
        'date_heure' => 'datetime',
        'date_appointment' => 'date',
        'price' => 'decimal:8,2',
        'status' => 'string',
        'cancelled_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function getDateAttribute()
    {
        return $this->attributes['date'] ?? null;
    }

    public function getStatusLabelAttribute()
    {
        return [
            'confirmed' => 'Confirmé',
            'pending' => 'En attente',
            'cancelled' => 'Annulé',
            'completed' => 'Terminé'
        ][$this->status] ?? $this->status;
    }

    public function getServiceLabelAttribute()
    {
        return [
            'consultation' => 'Consultation',
            'detartrage' => 'Détartrage',
            'orthodontie' => 'Orthodontie',
            'implantologie' => 'Implantologie',
            'blanchiment' => 'Blanchiment',
            'conservation' => 'Conservation',
            'prothese' => 'Prothèse',
            'depistage' => 'Dépistage',
            'urgence' => 'Urgence'
        ][$this->service] ?? $this->service;
    }

    public function getFormattedDateTimeAttribute()
    {
        try {
            $date = $this->date;
            $time = $this->time;
            
            if ($date instanceof \Carbon\Carbon) {
                $formattedDate = $date->format('d/m/Y');
            } elseif (is_string($date)) {
                $formattedDate = \Carbon\Carbon::parse($date)->format('d/m/Y');
            } else {
                $formattedDate = 'N/A';
            }
            
            return $formattedDate . ' à ' . ($time ?? 'N/A');
        } catch (\Exception $e) {
            return 'Date invalide';
        }
    }

    public function canBeCancelled()
    {
        try {
            return $this->status !== 'cancelled' && 
                   $this->date > now()->addDay();
        } catch (\Exception $e) {
            return false;
        }
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeForStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now())
                   ->where('status', '!=', 'cancelled')
                   ->orderByRaw('DATE(date) ASC, TIME(time) ASC');
    }
}
