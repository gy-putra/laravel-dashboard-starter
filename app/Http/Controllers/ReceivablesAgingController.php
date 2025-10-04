<?php

namespace App\Http\Controllers;

use App\Models\ReceivablesAging;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReceivablesAgingExport;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceivablesAgingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ReceivablesAging::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_invoice_no', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $receivablesAgings = $query->paginate(10)->withQueryString();

        return Inertia::render('ReceivablesAging/Index', [
            'receivablesAgings' => $receivablesAgings,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ReceivablesAging/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_invoice_no' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'product_name' => 'required|string|max:255',
            'qty' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'invoice_date' => 'required|date',
            'invoice_age' => 'required|integer|min:0',
            'aging_0_15_days' => 'nullable|numeric|min:0',
            'aging_16_30_days' => 'nullable|numeric|min:0',
            'aging_31_45_days' => 'nullable|numeric|min:0',
            'aging_over_45_days' => 'nullable|numeric|min:0',
            'days' => 'required|integer|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        ReceivablesAging::create($validated);

        return redirect()->route('receivables-agings.index')
            ->with('success', 'Data umur piutang berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ReceivablesAging $receivablesAging)
    {
        return Inertia::render('ReceivablesAging/Show', [
            'receivablesAging' => $receivablesAging,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReceivablesAging $receivablesAging)
    {
        return Inertia::render('ReceivablesAging/Edit', [
            'receivablesAging' => $receivablesAging,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReceivablesAging $receivablesAging)
    {
        $validated = $request->validate([
            'order_invoice_no' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'product_name' => 'required|string|max:255',
            'qty' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'invoice_date' => 'required|date',
            'invoice_age' => 'required|integer|min:0',
            'aging_0_15_days' => 'nullable|numeric|min:0',
            'aging_16_30_days' => 'nullable|numeric|min:0',
            'aging_31_45_days' => 'nullable|numeric|min:0',
            'aging_over_45_days' => 'nullable|numeric|min:0',
            'days' => 'required|integer|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $receivablesAging->update($validated);

        return redirect()->route('receivables-agings.index')
            ->with('success', 'Data umur piutang berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReceivablesAging $receivablesAging)
    {
        $receivablesAging->delete();

        return redirect()->route('receivables-agings.index')
            ->with('success', 'Data umur piutang berhasil dihapus.');
    }

    /**
     * Export to Excel
     */
    public function exportExcel()
    {
        return Excel::download(new ReceivablesAgingExport, 'umur-piutang.xlsx');
    }

    /**
     * Export to PDF
     */
    public function exportPdf()
    {
        $receivablesAgings = ReceivablesAging::all();
        $pdf = Pdf::loadView('exports.receivables-aging-pdf', compact('receivablesAgings'));
        
        return $pdf->download('umur-piutang.pdf');
    }

    /**
     * Bulk delete
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:receivables_agings,id'
        ])['ids'];

        ReceivablesAging::whereIn('id', $ids)->delete();

        return redirect()->route('receivables-agings.index')
            ->with('success', count($ids) . ' data umur piutang berhasil dihapus.');
    }
}
