<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class FinanceController extends Controller {
    public function index() {
        return response()->json(
            Invoice::with(['patient', 'appointment'])
                   ->orderBy('created_at', 'desc')
                   ->get()
                   ->map(function($invoice) {
                       return [
                           'id' => $invoice->id,
                           'patient' => $invoice->patient ? $invoice->patient->name : 'N/A',
                           'date' => $invoice->created_at->format('d M Y'),
                           'amount' => $invoice->amount,
                           'status' => $invoice->status,
                           'type' => $invoice->type,
                           'due_date' => $invoice->due_date ? $invoice->due_date->format('d M Y') : null,
                           'notes' => $invoice->notes
                       ];
                   })
        );
    }

    public function update(Request $request, $id) {
        try {
            $invoice = Invoice::findOrFail($id);
            
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0',
                'status' => 'required|in:draft,sent,paid,overdue,cancelled',
                'type' => 'required|in:devis,facture',
                'due_date' => 'nullable|date',
                'notes' => 'nullable|string'
            ]);

            $invoice->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Facture mise à jour avec succès',
                'invoice' => [
                    'id' => $invoice->id,
                    'amount' => $invoice->amount,
                    'status' => $invoice->status,
                    'type' => $invoice->type,
                    'due_date' => $invoice->due_date ? $invoice->due_date->format('d M Y') : null,
                    'notes' => $invoice->notes
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }

    public function performance() {
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyData[] = [
                'month' => $month->locale('fr')->format('M'),
                'revenue' => Invoice::whereMonth('created_at', $month)
                                  ->where('status', 'paid')
                                  ->sum('amount')
            ];
        }

        return response()->json([
            'labels' => array_column($monthlyData, 'month'),
            'data' => array_column($monthlyData, 'revenue')
        ]);
    }

    public function stats() {
        return response()->json([
            'totalRevenue' => Invoice::where('status', 'paid')->sum('amount'),
            'unpaidAmount' => Invoice::where('status', '!=', 'paid')->sum('amount'),
            'paidCount' => Invoice::where('status', 'paid')->count(),
            'unpaidCount' => Invoice::where('status', '!=', 'paid')->count(),
            'overdueCount' => Invoice::where('status', '!=', 'paid')
                                  ->where('due_date', '<', now())
                                  ->count()
        ]);
    }
}
