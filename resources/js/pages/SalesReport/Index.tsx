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
} from 'lucide-react';

interface SalesReport {
    id: number;
    date: string;
    order_no: string;
    customer_name: string;
    product: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    total: number;
    notes?: string;
    product_category: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    salesReports: {
        data: SalesReport[];
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
    { title: 'Laporan Omzet', href: '/sales-reports' },
];

export default function SalesReportIndex({ salesReports, filters }: Props) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/sales-reports', { search: searchTerm }, { preserveState: true });
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentOrder = filters.sort_order;
        const newOrder = currentSort === column && currentOrder === 'asc' ? 'desc' : 'asc';
        
        router.get('/sales-reports', {
            ...filters,
            sort_by: column,
            sort_order: newOrder,
        }, { preserveState: true });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(salesReports.data.map(item => item.id));
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
            router.post('/sales-reports/bulk-delete', {
                ids: selectedItems,
            }, {
                onSuccess: () => {
                    setSelectedItems([]);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/sales-reports/${id}`, {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Omzet" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Laporan Omzet</span>
                            <div className="flex items-center gap-2">
                                <Button asChild>
                                    <Link href="/sales-reports/create">
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
                                        placeholder="Cari berdasarkan nomor SP, customer, produk..."
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
                                            <a href="/sales-reports/export/excel">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Export Excel
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href="/sales-reports/export/pdf">
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
                                                checked={selectedItems.length === salesReports.data.length}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort('date')}
                                        >
                                            Tanggal
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort('order_no')}
                                        >
                                            No. SP
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort('customer_name')}
                                        >
                                            Customer
                                        </TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Harga Satuan</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="w-12">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesReports.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                                                Tidak ada data yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        salesReports.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={(checked) => 
                                                            handleSelectItem(item.id, checked as boolean)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>{formatDate(item.date)}</TableCell>
                                                <TableCell className="font-medium">{item.order_no}</TableCell>
                                                <TableCell>{item.customer_name}</TableCell>
                                                <TableCell>{item.product}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{item.product_category}</Badge>
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
                                                                <Link href={`/sales-reports/${item.id}/edit`}>
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
                        {salesReports.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {salesReports.from} - {salesReports.to} dari {salesReports.total} data
                                </div>
                                <div className="flex items-center gap-2">
                                    {salesReports.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`/sales-reports?page=${salesReports.current_page - 1}`)}
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {salesReports.current_page < salesReports.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`/sales-reports?page=${salesReports.current_page + 1}`)}
                                        >
                                            Selanjutnya
                                        </Button>
                                    )}
                                </div>
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