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
        Schema::table('patients', function (Blueprint $table) {
            if (!Schema::hasColumn('patients', 'email')) {
                $table->string('email')->nullable()->after('telephone');
            }
            if (!Schema::hasColumn('patients', 'address')) {
                $table->text('address')->nullable()->after('email');
            }
            if (!Schema::hasColumn('patients', 'birth_date')) {
                $table->date('birth_date')->nullable()->after('address');
            }
            if (!Schema::hasColumn('patients', 'emergency_contact')) {
                $table->string('emergency_contact')->nullable()->after('birth_date');
            }
            if (!Schema::hasColumn('patients', 'emergency_phone')) {
                $table->string('emergency_phone')->nullable()->after('emergency_contact');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn([
                'email', 
                'address', 
                'birth_date', 
                'emergency_contact', 
                'emergency_phone'
            ]);
        });
    }
};
