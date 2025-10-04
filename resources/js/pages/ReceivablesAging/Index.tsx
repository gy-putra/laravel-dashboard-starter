import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Plus,
    Search,
    Download,
    FileText,
    MoreHorizontal,
    Edit,
    Trash2,
    Filter,
    Clock,
} from 'lucide-react';

interface ReceivablesAging {
    id: number;
    order_invoice_no: string;
    customer_name: string;
    product_name: string;
    qty: number;
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
    created_at: string;
    updated_at: string;
}

interface Props {
    receivablesAgings: {
        data: ReceivablesAging[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Umur Piutang', href: '/receivables-agings' },
];

export default function ReceivablesAgingIndex({ receivablesAgings, filters }: Props) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/receivables-agings', { search: searchTerm }, { preserveState: true });
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentOrder = filters.sort_order;
        const newOrder = currentSort === column && currentOrder === 'asc' ? 'desc' : 'asc';
        
        router.get('/receivables-agings', {
            ...filters,
            sort_by: column,
            sort_order: newOrder,
        }, { preserveState: true });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(receivablesAgings.data.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter(item => item !== id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length > 0) {
            router.post('/receivables-agings/bulk-delete', {
                ids: selectedItems,
            }, {
                onSuccess: () => {
                    setSelectedItems([]);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/receivables-agings/${id}`, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setItemToDelete(null);
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID');
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

    const getAgingAmount = (item: ReceivablesAging) => {
        if (item.days <= 15) return item.aging_0_15_days;
        if (item.days <= 30) return item.aging_16_30_days;
        if (item.days <= 45) return item.aging_31_45_days;
        return item.aging_over_45_days;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Umur Piutang" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Umur Piutang
                            </span>
                            <div className="flex items-center gap-2">
                                <Button asChild>
                                    <Link href="/receivables-agings/create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Data
                                    </Link>
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Toolbar */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari berdasarkan invoice, customer, produk..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="outline">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>

                            <div className="flex items-center gap-2">
                                {selectedItems.length > 0 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleBulkDelete}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Hapus ({selectedItems.length})
                                    </Button>
                                )}
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <a href="/receivables-agings/export/excel">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Export Excel
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href="/receivables-agings/export/pdf">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Export PDF
                                            </a>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedItems.length === receivablesAgings.data.length}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort('order_invoice_no')}
                                        >
                                            No. Invoice
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort('customer_name')}
                                        >
                                            Customer
                                        </TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort('invoice_date')}
                                        >
                                            Tgl Invoice
                                        </TableHead>
                                        <TableHead className="text-center">Umur (Hari)</TableHead>
                                        <TableHead className="text-center">Kategori Aging</TableHead>
                                        <TableHead className="text-right">Aging Amount</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-12">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {receivablesAgings.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                                                Tidak ada data yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        receivablesAgings.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={(checked) => 
                                                            handleSelectItem(item.id, checked as boolean)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{item.order_invoice_no}</TableCell>
                                                <TableCell>{item.customer_name}</TableCell>
                                                <TableCell>{item.product_name}</TableCell>
                                                <TableCell className="text-right">{item.qty}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                                <TableCell>{formatDate(item.invoice_date)}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">{item.days} hari</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {getAgingBadge(item.days)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(getAgingAmount(item))}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(item.total)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/receivables-agings/${item.id}/edit`}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => {
                                                                    setItemToDelete(item.id);
                                                                    setShowDeleteDialog(true);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {receivablesAgings.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {receivablesAgings.from} - {receivablesAgings.to} dari {receivablesAgings.total} data
                                </div>
                                <div className="flex items-center gap-2">
                                    {receivablesAgings.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`/receivables-agings?page=${receivablesAgings.current_page - 1}`)}
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {receivablesAgings.current_page < receivablesAgings.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`/receivables-agings?page=${receivablesAgings.current_page + 1}`)}
                                        >
                                            Selanjutnya
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Summary Cards */}
                        {receivablesAgings.data.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="text-sm font-medium text-muted-foreground">0-15 Hari</div>
                                        <div className="text-lg font-bold text-green-600">
                                            {formatCurrency(
                                                receivablesAgings.data.reduce((sum, item) => sum + item.aging_0_15_days, 0)
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="text-sm font-medium text-muted-foreground">16-30 Hari</div>
                                        <div className="text-lg font-bold text-yellow-600">
                                            {formatCurrency(
                                                receivablesAgings.data.reduce((sum, item) => sum + item.aging_16_30_days, 0)
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="text-sm font-medium text-muted-foreground">31-45 Hari</div>
                                        <div className="text-lg font-bold text-orange-600">
                                            {formatCurrency(
                                                receivablesAgings.data.reduce((sum, item) => sum + item.aging_31_45_days, 0)
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="text-sm font-medium text-muted-foreground">&gt;45 Hari</div>
                                        <div className="text-lg font-bold text-red-600">
                                            {formatCurrency(
                                                receivablesAgings.data.reduce((sum, item) => sum + item.aging_over_45_days, 0)
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Batal
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => itemToDelete && handleDelete(itemToDelete)}
                        >
                            Hapus
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}