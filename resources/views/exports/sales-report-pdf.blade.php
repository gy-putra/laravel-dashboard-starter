<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Omzet</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-row {
            font-weight: bold;
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN OMZET</h1>
        <p>Periode: {{ now()->format('d F Y') }}</p>
        <p>Total Data: {{ count($salesReports) }} transaksi</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>No. SP</th>
                <th>Customer</th>
                <th>Produk</th>
                <th>Qty</th>
                <th>Harga Satuan</th>
                <th>Subtotal</th>
                <th>Total</th>
                <th>Kategori</th>
            </tr>
        </thead>
        <tbody>
            @php
                $grandTotal = 0;
            @endphp
            @foreach($salesReports as $index => $report)
                @php
                    $grandTotal += $report->total;
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $report->date->format('d/m/Y') }}</td>
                    <td>{{ $report->order_no }}</td>
                    <td>{{ $report->customer_name }}</td>
                    <td>{{ $report->product }}</td>
                    <td class="text-center">{{ $report->quantity }}</td>
                    <td class="text-right">Rp {{ number_format($report->unit_price, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($report->subtotal, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($report->total, 0, ',', '.') }}</td>
                    <td>{{ $report->product_category }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="8" class="text-right"><strong>GRAND TOTAL:</strong></td>
                <td class="text-right"><strong>Rp {{ number_format($grandTotal, 0, ',', '.') }}</strong></td>
                <td></td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d F Y H:i:s') }}</p>
        <p>Sistem Manajemen Admin</p>
    </div>
</body>
</html>