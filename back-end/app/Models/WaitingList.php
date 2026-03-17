<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaitingList extends Model
{
    protected $fillable = [
        'patient_id',
        'service',
        'preferred_date',
        'preferred_time',
        'priority',
        'notes',
        'status'
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'preferred_time' => 'datetime:H:i',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function getPriorityLabelAttribute()
    {
        return [
            'low' => 'Faible',
            'medium' => 'Moyen',
            'high' => 'Élevé',
            'urgent' => 'Urgent'
        ][$this->priority] ?? $this->priority;
    }

    public function getStatusLabelAttribute()
    {
        return [
            'pending' => 'En attente',
            'contacted' => 'Contacté',
            'scheduled' => 'Planifié',
            'cancelled' => 'Annulé'
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
}
