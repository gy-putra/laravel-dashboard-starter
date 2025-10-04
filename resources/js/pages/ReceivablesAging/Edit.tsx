import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Calculator } from 'lucide-react';

interface ReceivablesAging {
    id: number;
    order_invoice_no: string;
    customer_name: string;
    product_name: string;
    qty: string;
    amount: number;
    invoice_date: string;
    invoice_age: number;
    aging_0_15_days: number;
    aging_16_30_days: number;
    aging_31_45_days: number;
    aging_over_45_days: number;
    days: number;
    total: number;
    notes?: string;
}

interface FormData {
    order_invoice_no: string;
    customer_name: string;
    product_name: string;
    qty: string;
    amount: number;
    invoice_date: string;
    invoice_age: number;
    aging_0_15_days: number;
    aging_16_30_days: number;
    aging_31_45_days: number;
    aging_over_45_days: number;
    days: number;
    total: number;
    notes: string;
}

interface Props {
    receivablesAging: ReceivablesAging;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Umur Piutang', href: '/receivables-agings' },
    { title: 'Edit Data', href: '#' },
];

export default function ReceivablesAgingEdit({ receivablesAging }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        order_invoice_no: receivablesAging.order_invoice_no,
        customer_name: receivablesAging.customer_name,
        product_name: receivablesAging.product_name,
        qty: receivablesAging.qty,
        amount: receivablesAging.amount,
        invoice_date: receivablesAging.invoice_date,
        invoice_age: receivablesAging.invoice_age,
        aging_0_15_days: receivablesAging.aging_0_15_days,
        aging_16_30_days: receivablesAging.aging_16_30_days,
        aging_31_45_days: receivablesAging.aging_31_45_days,
        aging_over_45_days: receivablesAging.aging_over_45_days,
        days: receivablesAging.days,
        total: receivablesAging.total,
        notes: receivablesAging.notes || '',
    });

    const calculateAging = (invoiceDate: string, amount: number) => {
        if (!invoiceDate || amount <= 0) return;

        const today = new Date();
        const invoice = new Date(invoiceDate);
        const diffTime = Math.abs(today.getTime() - invoice.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let aging_0_15_days = 0;
        let aging_16_30_days = 0;
        let aging_31_45_days = 0;
        let aging_over_45_days = 0;

        if (diffDays <= 15) {
            aging_0_15_days = amount;
        } else if (diffDays <= 30) {
            aging_16_30_days = amount;
        } else if (diffDays <= 45) {
            aging_31_45_days = amount;
        } else {
            aging_over_45_days = amount;
        }

        setData(prev => ({
            ...prev,
            invoice_age: diffDays,
            days: diffDays,
            aging_0_15_days,
            aging_16_30_days,
            aging_31_45_days,
            aging_over_45_days,
            total: amount,
        }));
    };

    const handleInvoiceDateChange = (value: string) => {
        setData('invoice_date', value);
        calculateAging(value, data.amount);
    };

    const handleAmountChange = (value: string) => {
        const amount = parseFloat(value) || 0;
        setData('amount', amount);
        calculateAging(data.invoice_date, amount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/receivables-agings/${receivablesAging.id}`);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const getAgingBadge = (days: number) => {
        if (days <= 15) {
            return <Badge variant="default" className="bg-green-500">0-15 Hari</Badge>;
        } else if (days <= 30) {
            return <Badge variant="secondary" className="bg-yellow-500">16-30 Hari</Badge>;
        } else if (days <= 45) {
            return <Badge variant="secondary" className="bg-orange-500">31-45 Hari</Badge>;
        } else {
            return <Badge variant="destructive">&gt;45 Hari</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Umur Piutang - ${receivablesAging.order_invoice_no}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/receivables-agings">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            Edit Data Umur Piutang - {receivablesAging.order_invoice_no}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nomor Invoice */}
                                <div className="space-y-2">
                                    <Label htmlFor="order_invoice_no">Nomor Invoice *</Label>
                                    <Input
                                        id="order_invoice_no"
                                        type="text"
                                        placeholder="Masukkan nomor invoice"
                                        value={data.order_invoice_no}
                                        onChange={(e) => setData('order_invoice_no', e.target.value)}
                                        className={errors.order_invoice_no ? 'border-destructive' : ''}
                                    />
                                    {errors.order_invoice_no && (
                                        <p className="text-sm text-destructive">{errors.order_invoice_no}</p>
                                    )}
                                </div>

                                {/* Nama Customer */}
                                <div className="space-y-2">
                                    <Label htmlFor="customer_name">Nama Customer *</Label>
                                    <Input
                                        id="customer_name"
                                        type="text"
                                        placeholder="Masukkan nama customer"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className={errors.customer_name ? 'border-destructive' : ''}
                                    />
                                    {errors.customer_name && (
                                        <p className="text-sm text-destructive">{errors.customer_name}</p>
                                    )}
                                </div>

                                {/* Nama Produk */}
                                <div className="space-y-2">
                                    <Label htmlFor="product_name">Nama Produk *</Label>
                                    <Input
                                        id="product_name"
                                        type="text"
                                        placeholder="Masukkan nama produk"
                                        value={data.product_name}
                                        onChange={(e) => setData('product_name', e.target.value)}
                                        className={errors.product_name ? 'border-destructive' : ''}
                                    />
                                    {errors.product_name && (
                                        <p className="text-sm text-destructive">{errors.product_name}</p>
                                    )}
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <Label htmlFor="qty">Quantity *</Label>
                                    <Input
                                        id="qty"
                                        type="text"
                                        placeholder="example: 2kg/ltr"
                                        value={data.qty}
                                        onChange={(e) => setData('qty', e.target.value)}
                                        className={errors.qty ? 'border-destructive' : ''}
                                    />
                                    {errors.qty && (
                                        <p className="text-sm text-destructive">{errors.qty}</p>
                                    )}
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (IDR) *</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Masukkan jumlah amount"
                                        value={data.amount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        className={errors.amount ? 'border-destructive' : ''}
                                    />
                                    {errors.amount && (
                                        <p className="text-sm text-destructive">{errors.amount}</p>
                                    )}
                                </div>

                                {/* Tanggal Invoice */}
                                <div className="space-y-2">
                                    <Label htmlFor="invoice_date">Tanggal Invoice *</Label>
                                    <Input
                                        id="invoice_date"
                                        type="date"
                                        value={data.invoice_date}
                                        onChange={(e) => handleInvoiceDateChange(e.target.value)}
                                        className={errors.invoice_date ? 'border-destructive' : ''}
                                    />
                                    {errors.invoice_date && (
                                        <p className="text-sm text-destructive">{errors.invoice_date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Aging Calculation Results */}
                            {data.invoice_date && data.amount > 0 && (
                                <Card className="bg-muted/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Calculator className="h-5 w-5" />
                                            Hasil Perhitungan Aging
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Umur Invoice</Label>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{data.days} hari</Badge>
                                                    {getAgingBadge(data.days)}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Total Amount</Label>
                                                <div className="text-lg font-semibold">
                                                    {formatCurrency(data.total)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                            <div className="space-y-2">
                                                <Label>0-15 Hari</Label>
                                                <div className="text-sm font-medium text-green-600">
                                                    {formatCurrency(data.aging_0_15_days)}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>16-30 Hari</Label>
                                                <div className="text-sm font-medium text-yellow-600">
                                                    {formatCurrency(data.aging_16_30_days)}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>31-45 Hari</Label>
                                                <div className="text-sm font-medium text-orange-600">
                                                    {formatCurrency(data.aging_31_45_days)}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>&gt;45 Hari</Label>
                                                <div className="text-sm font-medium text-red-600">
                                                    {formatCurrency(data.aging_over_45_days)}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Catatan */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Catatan</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Masukkan catatan (opsional)"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className={errors.notes ? 'border-destructive' : ''}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-destructive">{errors.notes}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Button variant="outline" asChild>
                                    <Link href="/receivables-agings">
                                        Batal
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}