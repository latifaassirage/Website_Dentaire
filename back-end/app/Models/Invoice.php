<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'patient_id',
        'appointment_id',
        'type',
        'amount',
        'status',
        'due_date',
        'paid_at',
        'notes',
        'payment_method'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function getStatusLabelAttribute()
    {
        return [
            'draft' => 'Brouillon',
            'sent' => 'Envoyé',
            'paid' => 'Payé',
            'overdue' => 'En retard',
            'cancelled' => 'Annulé'
        ][$this->status] ?? $this->status;
    }

    public function getTypeLabelAttribute()
    {
        return [
            'devis' => 'Devis',
            'facture' => 'Facture'
        ][$this->type] ?? $this->type;
    }

    public function getFormattedAmountAttribute()
    {
        return number_format((float)$this->amount, 2, ',', ' ') . ' DH';
    }

    public function isOverdue()
    {
        return $this->status !== 'paid' && 
               $this->due_date && 
               $this->due_date < now();
    }

    public function scopeUnpaid($query)
    {
        return $query->where('status', '!=', 'paid');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', '!=', 'paid')
                   ->where('due_date', '<', now());
    }
}
