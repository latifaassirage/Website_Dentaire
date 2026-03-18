<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if (!$user || $user->role !== 'patient') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $payments = Invoice::where('patient_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($invoice) {
                return [
                    'id' => $invoice->id,
                    'type' => $invoice->type,
                    'amount' => $invoice->amount,
                    'status' => $invoice->status,
                    'created_at' => $invoice->created_at->toISOString(),
                    'due_date' => $invoice->due_date ? $invoice->due_date->toISOString() : null,
                    'description' => $invoice->notes,
                    'patient_id' => $invoice->patient_id
                ];
            });

        return response()->json($payments);
    }

    public function processPayment(Request $request, $paymentId)
    {
        $user = auth()->user();
        
        if (!$user || $user->role !== 'patient') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $invoice = Invoice::where('id', $paymentId)
                ->where('patient_id', $user->id)
                ->firstOrFail();

            if ($invoice->status === 'paid') {
                return response()->json(['error' => 'Invoice already paid'], 400);
            }

            // Simuler le traitement du paiement
            // Dans un vrai système, vous intégreriez Stripe, PayPal, etc.
            
            $invoice->update([
                'status' => 'paid',
                'paid_at' => now(),
                'notes' => ($invoice->notes ?? '') . ' - Paid online on ' . now()->format('d/m/Y H:i')
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'invoice' => [
                    'id' => $invoice->id,
                    'status' => $invoice->status,
                    'paid_at' => $invoice->paid_at
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error processing payment: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPaymentStats(Request $request)
    {
        $user = auth()->user();
        
        if (!$user || $user->role !== 'patient') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $invoices = Invoice::where('patient_id', $user->id);
        
        $stats = [
            'total_paid' => $invoices->where('status', 'paid')->sum('amount'),
            'total_pending' => $invoices->where('status', '!=', 'paid')->sum('amount'),
            'paid_count' => $invoices->where('status', 'paid')->count(),
            'pending_count' => $invoices->where('status', '!=', 'paid')->count(),
            'overdue_count' => $invoices->where('status', '!=', 'paid')
                                ->where('due_date', '<', now())
                                ->count()
        ];

        return response()->json($stats);
    }
}
