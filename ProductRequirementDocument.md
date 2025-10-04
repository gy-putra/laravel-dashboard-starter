# 📑 Product Requirement Document (PRD)
**New Feature: Sales Report (Laporan Omzet) & Receivables Aging (Umur Piutang)**

---

## 1. Background
The existing admin panel project (based on Laravel starter + Mazer theme) requires two new menus for **financial monitoring and reporting**.  
The new menus are:  
- **Sales Report (Laporan Omzet)**  
- **Receivables Aging (Umur Piutang)**  

The main focus of these features is **CRUD tables + Export (Excel/PDF)** with fields as defined, and using a **modern design with shadcn/ui**.

---

## 2. Objectives
- Provide dedicated pages for **Sales Report** and **Receivables Aging**.  
- Support full **CRUD operations** (Create, Read, Update, Delete).  
- Provide **data export to Excel & PDF**.  
- Present data in a **modern, interactive table** with sorting, filtering, search, and pagination.  
- Maintain design consistency with **modern UI using shadcn/ui**.

---

## 3. Scope of Features

### 3.1. Navigation Menu
- Add 2 new menu items in the admin sidebar:
  - **Sales Report**
  - **Receivables Aging**

### 3.2. Sales Report Page
Table fields:
1. Date  
2. Order No. (SP)  
3. Customer Name  
4. Product  
5. Quantity  
6. Unit Price  
7. Subtotal  
8. Total  
9. Notes  
10. Product Category  

Features:
- CRUD data (form input & edit).
- Table with search, filter, sort, and pagination.
- Export to **Excel & PDF**.
- Row-level actions: **Edit/Delete**.
- Multi-delete (checkbox per row).

### 3.3. Receivables Aging Page
Table fields (combined summary + detail):
1. Order/Invoice No.  
2. Customer Name  
3. Product Name  
4. QTY  
5. Amount (IDR)  
6. Invoice Age  
7. Aging Buckets → 0–15 Days, 16–30 Days, 31–45 Days, >45 Days  
8. Days  
9. Total  
10. Notes  

Features:
- CRUD data (form input & edit).
- Table with search, filter, sort, and pagination.
- Export to **Excel & PDF**.
- Row-level actions: **Edit/Delete**.
- Multi-delete (checkbox per row).

---

## 4. UI & Design
- Use **shadcn/ui components**: Table, Button, Modal, Dropdown, Input, Pagination, Checkbox, Dialog, Toast.  
- Layout consistent with the existing admin panel.  
- **Toolbar above table** includes:
  - Add Data button
  - Export Excel button
  - Export PDF button
  - Search input
- **Action column (right side of table)**:
  - **Edit** (✏️)
  - **Delete** (🗑️)

---

## 5. Technical Implementation

### 5.1. Backend (Laravel)
- Create 2 models & migrations:
  - `SalesReport`  
  - `ReceivablesAging`  
- Add Controllers & CRUD API resources.  
- Add routes in `web.php` (prefix: `/sales-report`, `/receivables-aging`).  
- Export:
  - Use **Maatwebsite/Laravel-Excel** for Excel export.  
  - Use **barryvdh/laravel-dompdf** for PDF export.  

### 5.2. Frontend (Blade + shadcn/ui)
- Use Blade templates to render tables.  
- shadcn/ui table components:  
  - Sticky headers  
  - Responsive layout  
  - Sorting icons  
- Modal forms for input & edit.  
- Toast notifications for success/error.  

---

## 6. Acceptance Criteria
- [ ] Sales Report table displays all required fields.  
- [ ] Receivables Aging table displays all required fields.  
- [ ] Full CRUD functionality (Add, Edit, Delete, Multi-delete).  
- [ ] Data can be exported to **Excel & PDF**.  
- [ ] UI consistent with shadcn/ui.  
- [ ] Search, filter, sort, and pagination working correctly.  
