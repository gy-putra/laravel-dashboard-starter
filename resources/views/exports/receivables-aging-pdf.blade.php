<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Umur Piutang</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
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
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
            text-align: center;
            font-size: 10px;
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
        .aging-0-15 {
            background-color: #d4edda;
        }
        .aging-16-30 {
            background-color: #fff3cd;
        }
        .aging-31-45 {
            background-color: #f8d7da;
        }
        .aging-over-45 {
            background-color: #f5c6cb;
        }
        .summary-table {
            margin-top: 30px;
            width: 60%;
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
        <h1>LAPORAN UMUR PIUTANG</h1>
        <p>Periode: {{ now()->format('d F Y') }}</p>
        <p>Total Data: {{ count($receivablesAgings) }} invoice</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>No. Invoice</th>
                <th>Customer</th>
                <th>Produk</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Tgl Invoice</th>
                <th>Umur</th>
                <th>0-15 Hari</th>
                <th>16-30 Hari</th>
                <th>31-45 Hari</th>
                <th>>45 Hari</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @php
                $grandTotal = 0;
                $total_0_15 = 0;
                $total_16_30 = 0;
                $total_31_45 = 0;
                $total_over_45 = 0;
            @endphp
            @foreach($receivablesAgings as $index => $aging)
                @php
                    $grandTotal += $aging->total;
                    $total_0_15 += $aging->aging_0_15_days;
                    $total_16_30 += $aging->aging_16_30_days;
                    $total_31_45 += $aging->aging_31_45_days;
                    $total_over_45 += $aging->aging_over_45_days;
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $aging->order_invoice_no }}</td>
                    <td>{{ $aging->customer_name }}</td>
                    <td>{{ $aging->product_name }}</td>
                    <td class="text-center">{{ $aging->qty }}</td>
                    <td class="text-right">Rp {{ number_format($aging->amount, 0, ',', '.') }}</td>
                    <td class="text-center">{{ $aging->invoice_date->format('d/m/Y') }}</td>
                    <td class="text-center">{{ $aging->days }} hari</td>
                    <td class="text-right aging-0-15">
                        @if($aging->aging_0_15_days > 0)
                            Rp {{ number_format($aging->aging_0_15_days, 0, ',', '.') }}
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-right aging-16-30">
                        @if($aging->aging_16_30_days > 0)
                            Rp {{ number_format($aging->aging_16_30_days, 0, ',', '.') }}
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-right aging-31-45">
                        @if($aging->aging_31_45_days > 0)
                            Rp {{ number_format($aging->aging_31_45_days, 0, ',', '.') }}
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-right aging-over-45">
                        @if($aging->aging_over_45_days > 0)
                            Rp {{ number_format($aging->aging_over_45_days, 0, ',', '.') }}
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-right">Rp {{ number_format($aging->total, 0, ',', '.') }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="8" class="text-right"><strong>TOTAL:</strong></td>
                <td class="text-right aging-0-15"><strong>Rp {{ number_format($total_0_15, 0, ',', '.') }}</strong></td>
                <td class="text-right aging-16-30"><strong>Rp {{ number_format($total_16_30, 0, ',', '.') }}</strong></td>
                <td class="text-right aging-31-45"><strong>Rp {{ number_format($total_31_45, 0, ',', '.') }}</strong></td>
                <td class="text-right aging-over-45"><strong>Rp {{ number_format($total_over_45, 0, ',', '.') }}</strong></td>
                <td class="text-right"><strong>Rp {{ number_format($grandTotal, 0, ',', '.') }}</strong></td>
            </tr>
        </tbody>
    </table>

    <!-- Summary Table -->
    <table class="summary-table">
        <thead>
            <tr>
                <th colspan="2">RINGKASAN UMUR PIUTANG</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="aging-0-15"><strong>0-15 Hari</strong></td>
                <td class="text-right aging-0-15"><strong>Rp {{ number_format($total_0_15, 0, ',', '.') }}</strong></td>
            </tr>
            <tr>
                <td class="aging-16-30"><strong>16-30 Hari</strong></td>
                <td class="text-right aging-16-30"><strong>Rp {{ number_format($total_16_30, 0, ',', '.') }}</strong></td>
            </tr>
            <tr>
                <td class="aging-31-45"><strong>31-45 Hari</strong></td>
                <td class="text-right aging-31-45"><strong>Rp {{ number_format($total_31_45, 0, ',', '.') }}</strong></td>
            </tr>
            <tr>
                <td class="aging-over-45"><strong>>45 Hari</strong></td>
                <td class="text-right aging-over-45"><strong>Rp {{ number_format($total_over_45, 0, ',', '.') }}</strong></td>
            </tr>
            <tr class="total-row">
                <td><strong>GRAND TOTAL</strong></td>
                <td class="text-right"><strong>Rp {{ number_format($grandTotal, 0, ',', '.') }}</strong></td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d F Y H:i:s') }}</p>
        <p>Sistem Manajemen Admin</p>
    </div>
</body>
</html>