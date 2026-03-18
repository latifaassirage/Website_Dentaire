<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\Patient;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if (!$user || $user->role !== 'patient') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $documents = [];
        
        // Récupérer les rendez-vous passés comme documents
        $appointments = Appointment::where('patient_id', $user->id)
            ->where('date', '<', now())
            ->orderBy('date', 'desc')
            ->get();

        foreach ($appointments as $appointment) {
            $documents[] = [
                'id' => 'apt_' . $appointment->id,
                'type' => 'ordonnance',
                'date' => $appointment->date->format('d/m/Y'),
                'doctor' => 'Cabinet Dentaire',
                'description' => 'Consultation - ' . ($appointment->service ?? 'Rendez-vous'),
                'appointment_id' => $appointment->id,
                'created_at' => $appointment->created_at
            ];
        }
        
        // Récupérer les factures
        $invoices = Invoice::where('patient_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($invoices as $invoice) {
            $documents[] = [
                'id' => 'inv_' . $invoice->id,
                'type' => $invoice->type,
                'date' => $invoice->created_at->format('d/m/Y'),
                'amount' => $invoice->amount . ' DH',
                'status' => $invoice->status,
                'description' => $invoice->notes ?? 'Facture #' . $invoice->id,
                'invoice_id' => $invoice->id,
                'created_at' => $invoice->created_at
            ];
        }

        // Trier par date
        usort($documents, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        return response()->json($documents);
    }

    public function download($documentId)
    {
        $user = auth()->user();
        
        if (!$user || $user->role !== 'patient') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Extraire le type et l'ID du document
        $parts = explode('_', $documentId, 2);
        $type = $parts[0] ?? '';
        $id = $parts[1] ?? null;

        if (!$id) {
            return response()->json(['error' => 'Invalid document ID'], 400);
        }

        try {
            if ($type === 'apt') {
                $appointment = Appointment::where('id', $id)
                    ->where('patient_id', $user->id)
                    ->firstOrFail();

                // Générer un PDF pour le rendez-vous
                $filename = 'ordonnance_' . $appointment->id . '.pdf';
                $content = $this->generateAppointmentPDF($appointment);
                
                return response($content)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
                    
            } elseif ($type === 'inv') {
                $invoice = Invoice::where('id', $id)
                    ->where('patient_id', $user->id)
                    ->firstOrFail();

                // Générer un PDF pour la facture
                $filename = 'facture_' . $invoice->id . '.pdf';
                $content = $this->generateInvoicePDF($invoice);
                
                return response($content)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
            }

            return response()->json(['error' => 'Document not found'], 404);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error downloading document'], 500);
        }
    }

    private function generateAppointmentPDF($appointment)
    {
        // Logique de génération PDF pour rendez-vous
        // Pour l'instant, retourner un contenu simple
        $html = '<html><body><h1>Ordonnance</h1><p>Rendez-vous du ' . $appointment->date->format('d/m/Y') . '</p></body></html>';
        return $html;
    }

    private function generateInvoicePDF($invoice)
    {
        // Logique de génération PDF pour facture
        // Pour l'instant, retourner un contenu simple
        $html = '<html><body><h1>Facture</h1><p>Montant: ' . $invoice->amount . ' DH</p></body></html>';
        return $html;
    }
}
