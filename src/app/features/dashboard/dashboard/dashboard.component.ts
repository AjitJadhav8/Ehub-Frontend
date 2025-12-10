import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  customers: any[] = [];
  loading = false; // only for initial page load
  error = '';

  // modal/form state
  showModal = false;
  isEditing = false;
  editingCustomerId: any = null;
  modalLoading = false;

  // form fields
  name = '';
  industry = '';
  employees: any = '';
  location = '';
  overview = '';

  // search
  query = '';

  // row-level delete state
  deletingId: string | null = null;

  constructor(private ds: DashboardService) {}

  ngOnInit(): void {
    // only first time show big loader
    this.loadCustomers(true);
  }

  // ---------- SweetAlert helpers ----------

  private showLoadingToast(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      title: message,
      showConfirmButton: false,
      allowOutsideClick: false,
      timer: undefined,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#ffffff',
      customClass: {
        container: 'swal-toast-container',
      },
    });
  }

  showSuccessToast(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#f0f9ff',
      iconColor: '#10b981',
      customClass: {
        container: 'swal-toast-container',
      },
    });
  }

  showErrorToast(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: '#fef2f2',
      iconColor: '#ef4444',
      customClass: {
        container: 'swal-toast-container',
      },
    });
  }

  showInfoToast(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#eff6ff',
      iconColor: '#3b82f6',
      customClass: {
        container: 'swal-toast-container',
      },
    });
  }

  // ---------- Data loading ----------

  // showLoader: true only for first time (big loader)
  loadCustomers(showLoader: boolean = false): void {
    if (showLoader) {
      this.loading = true;
    }
    this.error = '';

    this.ds.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load customers';
        this.showErrorToast('Failed to load customers');
        this.loading = false;
      },
    });
  }

  // ---------- Modal handling ----------

  openAddModal(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingCustomerId = null;
    this.showModal = true;
  }

  openEditModal(c: any): void {
    this.isEditing = true;
    this.editingCustomerId = c.customer_id;
    this.name = c.name || '';
    this.industry = c.industry || '';
    this.employees = c.employees ?? '';
    this.location = c.location || '';
    this.overview = c.overview || '';
    this.showModal = true;
  }

  closeModal(): void {
    if (!this.modalLoading) {
      this.showModal = false;
      this.resetForm();
    }
  }

  resetForm(): void {
    this.name = '';
    this.industry = '';
    this.employees = '';
    this.location = '';
    this.overview = '';
    this.editingCustomerId = null;
    this.isEditing = false;
    this.modalLoading = false;
  }

  // ---------- Create / Update ----------

  submit(): void {
    // Basic validation
    if (!this.name.trim() || !this.industry.trim()) {
      this.showErrorToast('Please enter company name and industry');
      return;
    }

    this.modalLoading = true;
    const loadingMsg = this.isEditing ? 'Updating customer...' : 'Saving customer...';
    this.showLoadingToast(loadingMsg);

    if (this.isEditing && this.editingCustomerId) {
      // Update customer
      this.ds
        .updateCustomer(this.editingCustomerId, {
          name: this.name.trim(),
          industry: this.industry.trim(),
          employees: Number(this.employees) || 0,
          location: this.location.trim(),
          overview: this.overview.trim(),
          current_stage_id: '2261ca84-d8ef-4909-898b-d204cc2355ee',
        })
        .subscribe({
          next: () => {
            Swal.close(); // close loading toast
            this.showSuccessToast('Customer updated successfully!');
            this.modalLoading = false;
            this.showModal = false;
            this.resetForm();
            // reload without full-screen loader
            this.loadCustomers();
          },
          error: (err) => {
            console.error(err);
            Swal.close(); // close loading toast
            this.showErrorToast(
              err?.error?.detail || 'Failed to update customer'
            );
            this.modalLoading = false;
          },
        });
    } else {
      // Create new customer
      const payload: any = {
        name: this.name.trim(),
        industry: this.industry.trim(),
        employees: Number(this.employees) || 0,
        location: this.location.trim(),
        overview: this.overview.trim(),
        created_by_user_id: '0e13df42-8145-4bc5-85b8-44ce6755ad35',
      };

      this.ds.addCustomer(payload).subscribe({
        next: () => {
          Swal.close(); // close loading toast
          this.showSuccessToast('Customer added successfully!');
          this.modalLoading = false;
          this.showModal = false;
          this.resetForm();
          // reload without full-screen loader
          this.loadCustomers();
        },
        error: (err) => {
          console.error(err);
          Swal.close(); // close loading toast
          this.showErrorToast(err?.error?.detail || 'Failed to add customer');
          this.modalLoading = false;
        },
      });
    }
  }

  // ---------- Delete ----------

deleteCustomer(id: string): void {
  Swal.fire({
    title: 'Delete customer?',
    text: 'Are you sure you want to proceed?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626', // red
    cancelButtonColor: '#2563eb',  // blue
    background: '#ffffff',
    iconColor: '#f59e0b',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-xl',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      this.deletingId = id;
      this.showLoadingToast('Deleting...');

      this.ds.deleteCustomer(id).subscribe({
        next: () => {
          Swal.close();
          this.showSuccessToast('Customer deleted');
          this.customers = this.customers.filter(
            (c) => c.customer_id !== id
          );
          this.deletingId = null;
        },
        error: (err) => {
          console.error(err);
          Swal.close();
          this.showErrorToast('Delete failed');
          this.deletingId = null;
        },
      });
    }
  });
}

  // ---------- Search ----------

  onSearch(): void {
    if (this.query.trim()) {
      this.showInfoToast(`Searching for: ${this.query}`);
    }
  }

  // quick filter for UI only
  filteredCustomers(): any[] {
    if (!this.query) return this.customers;
    const q = this.query.trim().toLowerCase();
    return this.customers.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.industry || '').toLowerCase().includes(q) ||
        (c.location || '').toLowerCase().includes(q)
    );
  }

  // small helper for display
  prettyDate(iso: string): string {
    if (!iso) return '';
    try {
      return formatDate(iso, 'dd MMM yyyy, hh:mm a', 'en-US');
    } catch {
      return iso;
    }
  }
}