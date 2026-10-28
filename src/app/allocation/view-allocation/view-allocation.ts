
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Shared } from 'src/app/shared/services/shared';

interface Allocation {
  id: number;
  initiatedBy: string;
  plantName: string;
  plantManager: string;
  status: string;
  reviewedBy: string;
  reviewedOn: string;
  approvedBy: string;
  approvedOn: string;
}

const MOCK_ALLOCATIONS: Allocation[] = [];

@Component({
  selector: 'app-view-allocation',
  standalone: true,
  imports: [Shared],
  templateUrl: './view-allocation.html',
  styleUrl: './view-allocation.css'
})
export class ViewAllocation implements OnInit {

  allocationList: Allocation[] = [];

  showAllocationModal = false;
  showDeleteModal = false;

  editingAllocationId: number | null = null;
  selectedAllocation: Allocation | null = null;

  private fb = new FormBuilder();

  allocationForm = this.fb.group({
    initiatedBy: ['', Validators.required],
    plantName: ['', Validators.required],
    plantManager: ['', Validators.required],
    status: ['Pending', Validators.required],
    reviewedBy: [''],
    reviewedOn: [''],
    approvedBy: [''],
    approvedOn: ['']
  });

  statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Under Review', value: 'Under Review' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  ngOnInit(): void {
    this.fetchAllocationList();
  }

  fetchAllocationList(): void {
    this.allocationList = [...MOCK_ALLOCATIONS];
  }

  // Open the dialog for creating a new allocation
  openCreateModal(): void {
    this.editingAllocationId = null;
    this.resetAllocationForm();
    this.showAllocationModal = true;
  }

  // Open the dialog with the selected allocation's details
  editAllocation(allocation: Allocation): void {
    this.editingAllocationId = allocation.id;

    this.allocationForm.reset({
      initiatedBy: allocation.initiatedBy,
      plantName: allocation.plantName,
      plantManager: allocation.plantManager,
      status: allocation.status,
      reviewedBy: allocation.reviewedBy,
      reviewedOn: allocation.reviewedOn,
      approvedBy: allocation.approvedBy,
      approvedOn: allocation.approvedOn
    });

    this.showAllocationModal = true;
  }

  // Create a new allocation or update the selected allocation
  submitAllocation(): void {
    if (this.allocationForm.invalid) {
      this.allocationForm.markAllAsTouched();
      return;
    }

    const formValue = this.allocationForm.getRawValue();

    const allocationData: Omit<Allocation, 'id'> = {
      initiatedBy: formValue.initiatedBy ?? '',
      plantName: formValue.plantName ?? '',
      plantManager: formValue.plantManager ?? '',
      status: formValue.status ?? 'Pending',
      reviewedBy: formValue.reviewedBy ?? '',
      reviewedOn: formValue.reviewedOn ?? '',
      approvedBy: formValue.approvedBy ?? '',
      approvedOn: formValue.approvedOn ?? ''
    };

    if (this.editingAllocationId !== null) {
      this.allocationList = this.allocationList.map(allocation =>
        allocation.id === this.editingAllocationId
          ? { ...allocation, ...allocationData }
          : allocation
      );
    } else {
      const newAllocation: Allocation = {
        id: Math.max(0, ...this.allocationList.map(a => a.id)) + 1,
        ...allocationData
      };

      this.allocationList = [
        newAllocation,
        ...this.allocationList
      ];
    }

    this.showAllocationModal = false;
    this.editingAllocationId = null;
    this.resetAllocationForm();
  }

  // Reset the form when the allocation dialog closes
  resetAllocationForm(): void {
    this.allocationForm.reset({
      initiatedBy: '',
      plantName: '',
      plantManager: '',
      status: 'Pending',
      reviewedBy: '',
      reviewedOn: '',
      approvedBy: '',
      approvedOn: ''
    });

    this.editingAllocationId = null;
  }

  // Open delete confirmation
  confirmDelete(allocation: Allocation): void {
    this.selectedAllocation = allocation;
    this.showDeleteModal = true;
  }

  // Cancel deletion
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedAllocation = null;
  }

  // Delete the selected allocation
  deleteAllocation(): void {
    if (this.selectedAllocation === null) {
      return;
    }

    const idToDelete = this.selectedAllocation.id;

    this.allocationList = this.allocationList.filter(
      allocation => allocation.id !== idToDelete
    );

    this.cancelDelete();
  }

  // Set the status tag color
  getStatusSeverity(
    status: string
  ): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    switch (status) {
      case 'Approved':
        return 'success';

      case 'Pending':
        return 'warn';

      case 'Under Review':
        return 'info';

      case 'Rejected':
        return 'danger';

      default:
        return 'secondary';
    }
  }
}
