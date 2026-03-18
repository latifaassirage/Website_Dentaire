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
        Schema::table('appointments', function (Blueprint $table) {
            // Ajouter les champs de compatibilité avec le frontend
            if (!Schema::hasColumn('appointments', 'date_appointment')) {
                $table->date('date_appointment')->nullable()->after('date');
            }
            if (!Schema::hasColumn('appointments', 'time_appointment')) {
                $table->time('time_appointment')->nullable()->after('date_appointment');
            }
            if (!Schema::hasColumn('appointments', 'type_soin')) {
                $table->string('type_soin')->nullable()->after('service');
            }
            if (!Schema::hasColumn('appointments', 'date_heure')) {
                $table->dateTime('date_heure')->nullable()->after('time_appointment');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'date_appointment', 
                'time_appointment', 
                'type_soin', 
                'date_heure'
            ]);
        });
    }
};
