<?php

namespace App\Exports;

use App\Models\SalesReport;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SalesReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return SalesReport::orderBy('date', 'desc')->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Tanggal',
            'No. SP',
            'Nama Customer',
            'Produk',
            'Quantity',
            'Harga Satuan',
            'Subtotal',
            'Total',
            'Catatan',
            'Kategori Produk',
        ];
    }

    /**
     * @param SalesReport $salesReport
     * @return array
     */
    public function map($salesReport): array
    {
        return [
            $salesReport->date->format('d/m/Y'),
            $salesReport->order_no,
            $salesReport->customer_name,
            $salesReport->product,
            $salesReport->quantity,
            'Rp ' . number_format($salesReport->unit_price, 0, ',', '.'),
            'Rp ' . number_format($salesReport->subtotal, 0, ',', '.'),
            'Rp ' . number_format($salesReport->total, 0, ',', '.'),
            $salesReport->notes ?? '-',
            $salesReport->product_category,
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],
        ];
    }
}
