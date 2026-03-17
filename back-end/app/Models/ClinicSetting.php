<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClinicSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'description'
    ];

    protected $casts = [
        'value' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set(string $key, $value)
    {
        $setting = static::where('key', $key)->first();
        if ($setting) {
            $setting->value = $value;
            $setting->save();
        } else {
            static::create([
                'key' => $key,
                'value' => $value,
                'type' => 'text'
            ]);
        }
    }

    public static function getWorkingHours()
    {
        return [
            'monday' => static::get('monday_hours', '09:00-18:00'),
            'tuesday' => static::get('tuesday_hours', '09:00-18:00'),
            'wednesday' => static::get('wednesday_hours', '09:00-18:00'),
            'thursday' => static::get('thursday_hours', '09:00-18:00'),
            'friday' => static::get('friday_hours', '09:00-18:00'),
            'saturday' => static::get('saturday_hours', '09:00-14:00'),
            'sunday' => static::get('sunday_hours', 'Fermé')
        ];
    }

    public static function getServices()
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
        ];
    }
}
