<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesReport extends Model
{
    protected $fillable = [
        'date',
        'order_no',
        'customer_name',
        'product',
        'quantity',
        'unit_price',
        'subtotal',
        'total',
        'notes',
        'product_category',
    ];

    protected $casts = [
        'date' => 'date',
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'total' => 'decimal:2',
    ];
}
