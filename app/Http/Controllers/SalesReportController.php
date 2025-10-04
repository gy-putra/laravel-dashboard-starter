<?php

namespace App\Http\Controllers;

use App\Models\SalesReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SalesReportExport;
use Barryvdh\DomPDF\Facade\Pdf;

class SalesReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = SalesReport::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_no', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('product', 'like', "%{$search}%")
                  ->orWhere('product_category', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $salesReports = $query->paginate(10)->withQueryString();

        return Inertia::render('SalesReport/Index', [
            'salesReports' => $salesReports,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SalesReport/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'order_no' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'product' => 'required|string|max:255',
            'quantity' => 'required|string|max:255',
            'unit_price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'product_category' => 'required|string|max:255',
        ]);

        SalesReport::create($validated);

        return redirect()->route('sales-reports.index')
            ->with('success', 'Data laporan omzet berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesReport $salesReport)
    {
        return Inertia::render('SalesReport/Show', [
            'salesReport' => $salesReport,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SalesReport $salesReport)
    {
        return Inertia::render('SalesReport/Edit', [
            'salesReport' => $salesReport,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SalesReport $salesReport)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'order_no' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'product' => 'required|string|max:255',
            'quantity' => 'required|string|max:255',
            'unit_price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'product_category' => 'required|string|max:255',
        ]);

        $salesReport->update($validated);

        return redirect()->route('sales-reports.index')
            ->with('success', 'Data laporan omzet berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SalesReport $salesReport)
    {
        $salesReport->delete();

        return redirect()->route('sales-reports.index')
            ->with('success', 'Data laporan omzet berhasil dihapus.');
    }

    /**
     * Export to Excel
     */
    public function exportExcel()
    {
        return Excel::download(new SalesReportExport, 'laporan-omzet.xlsx');
    }

    /**
     * Export to PDF
     */
    public function exportPdf()
    {
        $salesReports = SalesReport::all();
        $pdf = Pdf::loadView('exports.sales-report-pdf', compact('salesReports'));
        
        return $pdf->download('laporan-omzet.pdf');
    }

    /**
     * Bulk delete
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:sales_reports,id'
        ])['ids'];

        SalesReport::whereIn('id', $ids)->delete();

        return redirect()->route('sales-reports.index')
            ->with('success', count($ids) . ' data laporan omzet berhasil dihapus.');
    }
}
