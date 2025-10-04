<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceivablesAging extends Model
{
    protected $fillable = [
        'order_invoice_no',
        'customer_name',
        'product_name',
        'qty',
        'amount',
        'invoice_date',
        'invoice_age',
        'aging_0_15_days',
        'aging_16_30_days',
        'aging_31_45_days',
        'aging_over_45_days',
        'days',
        'total',
        'notes',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'amount' => 'decimal:2',
        'aging_0_15_days' => 'decimal:2',
        'aging_16_30_days' => 'decimal:2',
        'aging_31_45_days' => 'decimal:2',
        'aging_over_45_days' => 'decimal:2',
        'total' => 'decimal:2',
    ];
}
