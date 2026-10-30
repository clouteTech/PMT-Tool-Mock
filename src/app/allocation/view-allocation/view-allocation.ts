
import { Component, OnInit, OnDestroy } from '@angular/core';
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

interface StoredManager {
  id: number;
  name: string;
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
export class ViewAllocation implements OnInit, OnDestroy {

  // SAME STORAGE KEY AS PLANT ALLOCATION.
  private readonly storageKey = 'sharedPlantManagerLimits_v1';

  private readonly updateEvent = 'sharedPlantManagerLimitsUpdated';

  allocationList: PlantManager[] = [];

  selectedIds = new Set<number>();

  dialogVisible = false;
  currentAction: LimitAction = 'add';

  qty: number | null = null;

  // Refresh when another browser tab updates manager limits.
  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === this.storageKey) {
      this.loadAllocationData();
    }
  };

  // Refresh when another component updates limits in the same tab.
  private handleSameTabUpdate = (): void => {
    this.loadAllocationData();
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {

    this.loadAllocationData();

    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener(this.updateEvent, this.handleSameTabUpdate);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener(this.updateEvent, this.handleSameTabUpdate);
  }

  // Default 10 Plant Managers.
  private getDefaultManagers(): StoredManager[] {
    return [
      { id: 1, name: 'Suresh Reddy', limit: 10 },
      { id: 2, name: 'Laxmi Devi', limit: 20 },
      { id: 3, name: 'Anitha Rao', limit: 40 },
      { id: 4, name: 'Kayalvizhi M', limit: 30 },
      { id: 5, name: 'Rakesh Patel', limit: 50 },
      { id: 6, name: 'Meera Shah', limit: 60 },
      { id: 7, name: 'Vikram Singh', limit: 70 },
      { id: 8, name: 'Deepa Nair', limit: 80 },
      { id: 9, name: 'Sanjay kumar', limit: 90 },
      { id: 10, name: 'Arjun Mehta', limit: 100 }
    ];
  }

  // Load shared manager data.
  loadAllocationData(): void {

    try {
      const savedData = localStorage.getItem(this.storageKey);
      const defaults = this.getDefaultManagers();

      if (!savedData) {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify(defaults)
        );
      }

      const stored: StoredManager[] = JSON.parse(
        localStorage.getItem(this.storageKey) || '[]'
      );

      // Keep saved limits and add missing default managers.
      const managers = defaults.map(defaultManager => {

        const existing = stored.find(
          manager => manager.name === defaultManager.name
        );

        return existing
          ? {
              ...defaultManager,
              limit: Number(existing.limit)
            }
          : defaultManager;
      });

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(managers)
      );

      this.allocationList = managers.map(manager => ({
        id: manager.id,
        plantManager: manager.name,
        limit: manager.limit
      }));

    } catch (error) {
      console.error('Error loading shared manager data:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to load Plant Manager limits.'
      });
    }
  }

  // Save shared manager data.
  saveAllocationData(): void {

    try {
      const managers: StoredManager[] = this.allocationList.map(
        manager => ({
          id: manager.id,
          name: manager.plantManager,
          limit: manager.limit
        })
      );

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(managers)
      );

      // Notify other components in the same browser tab.
      window.dispatchEvent(new Event(this.updateEvent));

    } catch (error) {
      console.error('Error saving shared manager data:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to save Plant Manager limits.'
      });
    }
  }

  // Total managers.
  get totalManagers(): number {
    return this.allocationList.length;
  }

  // Selected managers count.
  get selectedCount(): number {
    return this.selectedIds.size;
  }

  // Check all selected.
  get allSelected(): boolean {
    return this.allocationList.length > 0 &&
      this.selectedIds.size === this.allocationList.length;
  }

  // Check partially selected.
  get someSelected(): boolean {
    return this.selectedIds.size > 0 && !this.allSelected;
  }

  // Check individual manager.
  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  // Individual checkbox selection.
  toggleSelection(id: number, event: Event): void {

    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  // Select All checkbox.
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

  // Open Add Limit / Reduce Limit popup.
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

  // Quantity input change.
  onQtyChange(event: Event): void {

    const value = (event.target as HTMLInputElement).value;

    this.qty = value === '' ? null : Number(value);
  }

  // Submit Add Limit / Reduce Limit.
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

    // Read the latest shared data before updating.
    this.loadAllocationData();

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

    // Validate all managers before reducing.
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

    // Update selected managers.
    selectedManagers.forEach(manager => {

      if (this.currentAction === 'add') {
        manager.limit += this.qty!;
      } else {
        manager.limit -= this.qty!;
      }

    });

    // Save changes to the common localStorage key.
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

  // Close popup.
  closeDialog(): void {
    this.dialogVisible = false;
    this.qty = null;
  }
}
