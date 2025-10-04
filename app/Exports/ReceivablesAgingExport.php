<?php

namespace App\Exports;

use App\Models\ReceivablesAging;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReceivablesAgingExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return ReceivablesAging::orderBy('invoice_date', 'desc')->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'No. Invoice',
            'Nama Customer',
            'Nama Produk',
            'Qty',
            'Amount (IDR)',
            'Tanggal Invoice',
            'Umur Invoice (Hari)',
            '0-15 Hari',
            '16-30 Hari',
            '31-45 Hari',
            '>45 Hari',
            'Total',
            'Catatan',
        ];
    }

    /**
     * @param ReceivablesAging $receivablesAging
     * @return array
     */
    public function map($receivablesAging): array
    {
        return [
            $receivablesAging->order_invoice_no,
            $receivablesAging->customer_name,
            $receivablesAging->product_name,
            $receivablesAging->qty,
            'Rp ' . number_format($receivablesAging->amount, 0, ',', '.'),
            $receivablesAging->invoice_date->format('d/m/Y'),
            $receivablesAging->days . ' hari',
            'Rp ' . number_format($receivablesAging->aging_0_15_days, 0, ',', '.'),
            'Rp ' . number_format($receivablesAging->aging_16_30_days, 0, ',', '.'),
            'Rp ' . number_format($receivablesAging->aging_31_45_days, 0, ',', '.'),
            'Rp ' . number_format($receivablesAging->aging_over_45_days, 0, ',', '.'),
            'Rp ' . number_format($receivablesAging->total, 0, ',', '.'),
            $receivablesAging->notes ?? '-',
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
