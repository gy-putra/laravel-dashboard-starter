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
        Schema::create('receivables_agings', function (Blueprint $table) {
            $table->id();
            $table->string('order_invoice_no');
            $table->string('customer_name');
            $table->string('product_name');
            $table->integer('qty');
            $table->decimal('amount', 15, 2);
            $table->date('invoice_date');
            $table->integer('invoice_age');
            $table->decimal('aging_0_15_days', 15, 2)->default(0);
            $table->decimal('aging_16_30_days', 15, 2)->default(0);
            $table->decimal('aging_31_45_days', 15, 2)->default(0);
            $table->decimal('aging_over_45_days', 15, 2)->default(0);
            $table->integer('days');
            $table->decimal('total', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receivables_agings');
    }
};
