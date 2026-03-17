<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'assigned_to',
        'service',
        'date',
        'time',
        'price',
        'status',
        'notes',
        'cancelled_at',
        'cancellation_reason'
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
        'price' => 'decimal:2',
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

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
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
        return $this->date->format('d/m/Y') . ' à ' . $this->time->format('H:i');
    }

    public function canBeCancelled()
    {
        return $this->status !== 'cancelled' && 
               $this->date > now()->addDay();
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
                   ->orderBy('date')
                   ->orderBy('time');
    }
}
