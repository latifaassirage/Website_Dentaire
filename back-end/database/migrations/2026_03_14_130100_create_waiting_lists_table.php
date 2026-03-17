<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('waiting_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->enum('service', ['consultation', 'detartrage', 'orthodontie', 'implantologie', 'blanchiment', 'conservation', 'prothese', 'depistage', 'urgence']);
            $table->date('preferred_date')->nullable();
            $table->time('preferred_time')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'contacted', 'scheduled', 'cancelled'])->default('pending');
            $table->timestamps();

            $table->index(['patient_id', 'status']);
            $table->index(['priority', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waiting_lists');
    }
};
