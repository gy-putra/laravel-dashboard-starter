import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface FormData {
    date: string;
    order_no: string;
    customer_name: string;
    product: string;
    quantity: string;
    unit_price: number;
    subtotal: number;
    total: number;
    notes: string;
    product_category: string;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Omzet', href: '/sales-reports' },
    { title: 'Tambah Data', href: '/sales-reports/create' },
];

const productCategories = [
    'PB',
    'PK',
    'BB',
    'Lainnya',
];

export default function SalesReportCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        date: new Date().toISOString().split('T')[0],
        order_no: '',
        customer_name: '',
        product: '',
        quantity: '',
        unit_price: 0,
        subtotal: 0,
        total: 0,
        notes: '',
        product_category: '',
    });

    const calculateAmounts = (quantity: string, unitPrice: number) => {
        const numericQuantity = parseFloat(quantity) || 0;
        const subtotal = numericQuantity * unitPrice;
        const total = subtotal; // Bisa ditambahkan pajak atau diskon di sini
        
        setData(prev => ({
            ...prev,
            subtotal,
            total,
        }));
    };

    const handleQuantityChange = (value: string) => {
        setData('quantity', value);
        calculateAmounts(value, data.unit_price);
    };

    const handleUnitPriceChange = (value: string) => {
        const unitPrice = parseFloat(value) || 0;
        setData('unit_price', unitPrice);
        calculateAmounts(data.quantity, unitPrice);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales-reports');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Laporan Omzet" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/sales-reports">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            Tambah Data Laporan Omzet
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tanggal */}
                                <div className="space-y-2">
                                    <Label htmlFor="date">Tanggal *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className={errors.date ? 'border-destructive' : ''}
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-destructive">{errors.date}</p>
                                    )}
                                </div>

                                {/* Nomor SP */}
                                <div className="space-y-2">
                                    <Label htmlFor="order_no">Nomor SP *</Label>
                                    <Input
                                        id="order_no"
                                        type="text"
                                        placeholder="Masukkan nomor SP"
                                        value={data.order_no}
                                        onChange={(e) => setData('order_no', e.target.value)}
                                        className={errors.order_no ? 'border-destructive' : ''}
                                    />
                                    {errors.order_no && (
                                        <p className="text-sm text-destructive">{errors.order_no}</p>
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

                                {/* Produk */}
                                <div className="space-y-2">
                                    <Label htmlFor="product">Produk *</Label>
                                    <Input
                                        id="product"
                                        type="text"
                                        placeholder="Masukkan nama produk"
                                        value={data.product}
                                        onChange={(e) => setData('product', e.target.value)}
                                        className={errors.product ? 'border-destructive' : ''}
                                    />
                                    {errors.product && (
                                        <p className="text-sm text-destructive">{errors.product}</p>
                                    )}
                                </div>

                                {/* Kategori Produk */}
                                <div className="space-y-2">
                                    <Label htmlFor="product_category">Kategori Produk *</Label>
                                    <Select
                                        value={data.product_category}
                                        onValueChange={(value) => setData('product_category', value)}
                                    >
                                        <SelectTrigger className={errors.product_category ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Pilih kategori produk" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productCategories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.product_category && (
                                        <p className="text-sm text-destructive">{errors.product_category}</p>
                                    )}
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity *</Label>
                                    <Input
                                        id="quantity"
                                        type="text"
                                        placeholder="example: 2kg/ltr"
                                        value={data.quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        className={errors.quantity ? 'border-destructive' : ''}
                                    />
                                    {errors.quantity && (
                                        <p className="text-sm text-destructive">{errors.quantity}</p>
                                    )}
                                </div>

                                {/* Harga Satuan */}
                                <div className="space-y-2">
                                    <Label htmlFor="unit_price">Harga Satuan *</Label>
                                    <Input
                                        id="unit_price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Masukkan harga satuan"
                                        value={data.unit_price}
                                        onChange={(e) => handleUnitPriceChange(e.target.value)}
                                        className={errors.unit_price ? 'border-destructive' : ''}
                                    />
                                    {errors.unit_price && (
                                        <p className="text-sm text-destructive">{errors.unit_price}</p>
                                    )}
                                </div>

                                {/* Subtotal (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="subtotal">Subtotal</Label>
                                    <Input
                                        id="subtotal"
                                        type="text"
                                        value={formatCurrency(data.subtotal)}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Total (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="total">Total</Label>
                                    <Input
                                        id="total"
                                        type="text"
                                        value={formatCurrency(data.total)}
                                        readOnly
                                        className="bg-muted font-medium"
                                    />
                                </div>
                            </div>

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
                                    <Link href="/sales-reports">
                                        Batal
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}