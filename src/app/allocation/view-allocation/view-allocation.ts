
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface PlantManager {
  id: number;
  plantManager: string;
  limit: number;
}

type LimitAction = 'add' | 'reduce';

@Component({
  selector: 'app-view-allocation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './view-allocation.html',
  styleUrl: './view-allocation.css'
})
export class ViewAllocation implements OnInit {

  // New key prevents loading old incorrect records.
  private readonly storageKey = 'viewAllocationData_v3';

  allocationList: PlantManager[] = [];

  selectedIds = new Set<number>();

  dialogVisible = false;
  currentAction: LimitAction = 'add';

  qty: number | null = null;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadAllocationData();
  }

  // Default 10 Plant Managers
  private getDefaultManagers(): PlantManager[] {
    return [
      { id: 1, plantManager: 'Sanjay Kumar', limit: 10 },
      { id: 2, plantManager: 'Ananya Iyer', limit: 20 },
      { id: 3, plantManager: 'Sivakumar R', limit: 30 },
      { id: 4, plantManager: 'Kayalvizhi M', limit: 40 },
      { id: 5, plantManager: 'Rakesh Patel', limit: 50 },
      { id: 6, plantManager: 'Meera Shah', limit: 60 },
      { id: 7, plantManager: 'Vikram Singh', limit: 70 },
      { id: 8, plantManager: 'Deepa Nair', limit: 80 },
      { id: 9, plantManager: 'Suresh Reddy', limit: 90 },
      { id: 10, plantManager: 'Arjun Mehta', limit: 100 }
    ];
  }

  // Load only View Allocation data
  loadAllocationData(): void {
    const savedData = localStorage.getItem(this.storageKey);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        const isValid =
          Array.isArray(parsedData) &&
          parsedData.length === 10 &&
          parsedData.every((item: any) =>
            typeof item.id === 'number' &&
            typeof item.plantManager === 'string' &&
            typeof item.limit === 'number'
          );

        if (isValid) {
          this.allocationList = parsedData;
          return;
        }

      } catch (error) {
        console.error('Error loading View Allocation data:', error);
      }
    }

    // Load default 10 managers if data is missing or invalid.
    this.allocationList = this.getDefaultManagers();
    this.saveAllocationData();
  }

  // Save View Allocation data
  saveAllocationData(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.allocationList)
    );
  }

  // Total managers
  get totalManagers(): number {
    return this.allocationList.length;
  }

  // Selected managers count
  get selectedCount(): number {
    return this.selectedIds.size;
  }

  // Check all selected
  get allSelected(): boolean {
    return this.allocationList.length > 0 &&
      this.selectedIds.size === this.allocationList.length;
  }

  // Check partially selected
  get someSelected(): boolean {
    return this.selectedIds.size > 0 && !this.allSelected;
  }

  // Check individual manager
  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  // Individual checkbox selection
  toggleSelection(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  // Select All checkbox
  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.allocationList.forEach(manager => {
        this.selectedIds.add(manager.id);
      });
    } else {
      this.selectedIds.clear();
    }
  }

  // Open Add Limit / Reduce Limit popup
  openLimitDialog(action: LimitAction): void {

    if (this.selectedIds.size === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select Manager',
        detail: 'Please select at least one Plant Manager.'
      });
      return;
    }

    this.currentAction = action;
    this.qty = null;
    this.dialogVisible = true;
  }

  // Quantity input change
  onQtyChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.qty = value === '' ? null : Number(value);
  }

  // Submit Add Limit / Reduce Limit
  submitLimit(): void {

    if (
      this.qty === null ||
      !Number.isInteger(this.qty) ||
      this.qty <= 0
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Quantity',
        detail: 'Please enter a quantity greater than zero.'
      });
      return;
    }

    const selectedManagers = this.allocationList.filter(manager =>
      this.selectedIds.has(manager.id)
    );

    if (selectedManagers.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select Manager',
        detail: 'Please select at least one Plant Manager.'
      });
      return;
    }

    // Validate all managers before reducing limits.
    if (this.currentAction === 'reduce') {

      const insufficientManagers = selectedManagers.filter(
        manager => manager.limit < this.qty!
      );

      if (insufficientManagers.length > 0) {

        const names = insufficientManagers
          .map(manager => manager.plantManager)
          .join(', ');

        this.messageService.add({
          severity: 'error',
          summary: 'Insufficient Limit',
          detail: `Cannot reduce the entered quantity for: ${names}`
        });

        return;
      }
    }

    // Update every selected manager.
    selectedManagers.forEach(manager => {

      if (this.currentAction === 'add') {
        manager.limit += this.qty!;
      } else {
        manager.limit -= this.qty!;
      }

    });

    this.saveAllocationData();

    const actionText =
      this.currentAction === 'add' ? 'increased' : 'reduced';

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Limit ${actionText} successfully for ${selectedManagers.length} selected manager(s).`
    });

    // Close popup and clear selections.
    this.dialogVisible = false;
    this.qty = null;
    this.selectedIds.clear();
  }

  // Close popup
  closeDialog(): void {
    this.dialogVisible = false;
    this.qty = null;
  }
}
