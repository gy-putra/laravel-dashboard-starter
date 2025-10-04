<?php

use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\ReceivablesAgingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Sales Report Routes
    Route::resource('sales-reports', SalesReportController::class);
    Route::post('sales-reports/bulk-delete', [SalesReportController::class, 'bulkDelete'])->name('sales-reports.bulk-delete');
    Route::get('sales-reports/export/excel', [SalesReportController::class, 'exportExcel'])->name('sales-reports.export.excel');
    Route::get('sales-reports/export/pdf', [SalesReportController::class, 'exportPdf'])->name('sales-reports.export.pdf');

    // Receivables Aging Routes
    Route::resource('receivables-agings', ReceivablesAgingController::class);
    Route::post('receivables-agings/bulk-delete', [ReceivablesAgingController::class, 'bulkDelete'])->name('receivables-agings.bulk-delete');
    Route::get('receivables-agings/export/excel', [ReceivablesAgingController::class, 'exportExcel'])->name('receivables-agings.export.excel');
    Route::get('receivables-agings/export/pdf', [ReceivablesAgingController::class, 'exportPdf'])->name('receivables-agings.export.pdf');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
