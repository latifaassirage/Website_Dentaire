<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('service', ['consultation', 'detartrage', 'orthodontie', 'implantologie', 'blanchiment', 'conservation', 'prothese', 'depistage', 'urgence']);
            $table->date('date')->nullable(); // Ajout de nullable pour éviter l'erreur
            $table->time('time')->nullable(); // Ajout de nullable pour éviter l'erreur
            $table->decimal('price', 8, 2)->nullable();
            $table->enum('status', ['confirmed', 'pending', 'cancelled', 'completed'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();

            $table->index(['date', 'status']);
            $table->index(['patient_id', 'status']);
            $table->index(['assigned_to', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
