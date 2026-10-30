
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Popover, PopoverModule } from 'primeng/popover';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface PlantManager {
  label: string;
  value: string;
  limit: number;
  disabled: boolean;
}

interface PlantManagerLimit {
  name: string;
  limit: number;
  label: string;
}

interface StoredManager {
  id: number;
  name: string;
  limit: number;
}

interface PlantOption {
  label: string;
  value: string;
}

interface Allocation {
  qty: number;
  plantName: PlantOption;
  plantManager: PlantManager;
}

@Component({
  selector: 'app-plant-allocation',
  standalone: true,
  imports: [
    FloatLabelModule,
    SelectModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    DialogModule,
    PopoverModule,
    RippleModule,
    MultiSelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './plant-allocation.html',
  styleUrl: './plant-allocation.css'
})
export class PlantAllocation implements OnInit, OnDestroy {

  private readonly draftStorageKey = 'plantAllocationDraft';
  private readonly submittedStorageKey = 'plantAllocations';

  private readonly storageKey = 'sharedPlantManagerLimits_v1';
  private readonly updateEvent = 'sharedPlantManagerLimitsUpdated';

  selectedQty = 0;
  remainingQty = 0;

  allocations: Allocation[] = [];
  selectedComponents: any[] = [];
  selectedComponents1: any[] = [];

  qtyLimitError = false;
  showPlantManager = false;
  showLimitForm = false;
  showDeleteDialog = false;
  showSuccessDialog = false;

  availableManagerCount = 0;
  pendingDeleteIndex = -1;
  successMessage = '';

  @ViewChild('op') op!: Popover;

  selectedPlantManager: PlantManager | null = null;

  plantManagerList: PlantManager[] = [];
  plantManagerList1: PlantManagerLimit[] = [];

  plantNameList: PlantOption[] = [
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Trichy', value: 'Trichy' },
    { label: 'Pune', value: 'Pune' }
  ];

  allocationForm: FormGroup;
  limitForm: FormGroup;

  // Refresh when another browser tab updates manager limits.
  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === this.storageKey) {
      this.loadSharedManagerLimits();
      this.updateManagerLimits();
    }
  };

  // Refresh when another component updates limits in the same tab.
  private handleSameTabUpdate = (): void => {
    this.loadSharedManagerLimits();
    this.updateManagerLimits();
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.allocationForm = this.fb.group({
      qty: [0, [Validators.required, Validators.min(1)]],
      plantName: ['', Validators.required],
      plantManager: ['', Validators.required]
    });

    this.limitForm = this.fb.group({
      plantManager: [[], Validators.required],
      qty: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {

    // Load the shared manager limits first.
    this.loadSharedManagerLimits();

    // Restore saved allocation list.
    this.loadAllocations();

    const state = history.state;

    if (state?.components) {
      this.groupComponents(state.components);
    }

    this.allocationForm.get('qty')?.valueChanges.subscribe(() => {
      this.checkQtyLimit();
    });

    this.allocationForm.get('plantManager')?.valueChanges.subscribe(() => {
      this.checkQtyLimit();
    });

    this.updateManagerLimits();

    // Listen for updates from other tabs and components.
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener(this.updateEvent, this.handleSameTabUpdate);

    this.selectedComponents1 = [
      { componentName: 'Topflange', qty: 1 },
      { componentName: 'Bottomflange', qty: 1 },
      { componentName: 'Blade', qty: 3 },
      { componentName: 'Nacelle', qty: 1 },
      { componentName: 'Hub', qty: 1 },
      { componentName: 'Tower', qty: 2 },
      { componentName: 'Converter Panel', qty: 1 },
      { componentName: 'Site Accessories', qty: 1 },
      { componentName: 'SCADA', qty: 1 }
    ];
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener(this.updateEvent, this.handleSameTabUpdate);
  }

  // Default manager list shared by both screens.
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

  // Load shared manager limits from localStorage.
  loadSharedManagerLimits(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const defaults = this.getDefaultManagers();

      if (!saved) {
        localStorage.setItem(this.storageKey, JSON.stringify(defaults));
      }

      const stored: StoredManager[] = JSON.parse(
        localStorage.getItem(this.storageKey) || '[]'
      );

      // Preserve saved limits and add any missing default managers.
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

      localStorage.setItem(this.storageKey, JSON.stringify(managers));

      this.plantManagerList = managers.map(manager => ({
        label: `${manager.name} (limit ${manager.limit})`,
        value: manager.name,
        limit: manager.limit,
        disabled: false
      }));

      this.plantManagerList1 = managers.map(manager => ({
        name: manager.name,
        limit: manager.limit,
        label: `${manager.name} (limit ${manager.limit})`
      }));

    } catch (error) {
      console.error('Error loading shared manager limits:', error);
    }
  }

  // Restore saved draft allocations.
  loadAllocations(): void {
    try {
      const savedData = localStorage.getItem(this.draftStorageKey);

      if (!savedData) {
        this.allocations = [];
        return;
      }

      const parsedData: unknown = JSON.parse(savedData);

      if (!Array.isArray(parsedData)) {
        this.allocations = [];
        return;
      }

      this.allocations = parsedData.filter(
        (item: any) =>
          item &&
          Number.isFinite(Number(item.qty)) &&
          item.plantManager &&
          item.plantName
      );

    } catch (error) {
      console.error('Error loading allocation draft:', error);
      this.allocations = [];
    }
  }

  // Save the current allocation list.
  saveAllocations(): void {
    try {
      localStorage.setItem(
        this.draftStorageKey,
        JSON.stringify(this.allocations)
      );
    } catch (error) {
      console.error('Error saving allocation draft:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to save allocations in this browser.'
      });
    }
  }

  groupComponents(components: any[]): void {
    const componentMap = new Map<string, any>();

    components.forEach(item => {
      const name = item.componentName;

      if (componentMap.has(name)) {
        componentMap.get(name).count += 1;
      } else {
        componentMap.set(name, {
          componentName: name,
          count: 1
        });
      }
    });

    this.selectedComponents = Array.from(componentMap.values());
  }

  componentChange(component: any): void {
    this.selectedQty = Number(component?.count ?? 0);

    const alreadyAllocated = this.allocations.reduce(
      (total, allocation) => total + Number(allocation.qty),
      0
    );

    this.remainingQty = Math.max(
      0,
      this.selectedQty - alreadyAllocated
    );
  }

  getManagerAllocatedQty(managerName: string): number {
    return this.allocations
      .filter(allocation =>
        allocation.plantManager?.value === managerName
      )
      .reduce(
        (total, allocation) => total + Number(allocation.qty),
        0
      );
  }

  // Show remaining quantity in Plant Allocation.
  updateManagerLimits(): void {

    this.plantManagerList = this.plantManagerList.map(manager => {

      const allocatedQty = this.getManagerAllocatedQty(manager.value);

      const remainingLimit = Math.max(
        0,
        manager.limit - allocatedQty
      );

      return {
        ...manager,
        label: `${manager.value} (limit ${remainingLimit})`,
        disabled: remainingLimit === 0
      };
    });

this.plantManagerList1 = this.plantManagerList1.map(manager => {
  const mainManager = this.plantManagerList.find(
    item => item.value === manager.name
  );

  if (!mainManager) {
    return manager;
  }

  const remainingLimit = Math.max(
    0,
    mainManager.limit - this.getManagerAllocatedQty(manager.name)
  );

  return {
    ...manager,
    limit: remainingLimit,
    label: `${manager.name} (limit ${remainingLimit})`
  };
});

    this.availableManagerCount = this.plantManagerList.filter(
      manager => !manager.disabled
    ).length;
  }

  checkQtyLimit(): void {
    const managerName =
      this.allocationForm.get('plantManager')?.value;

    const qty = Number(this.allocationForm.get('qty')?.value);

    const manager = this.plantManagerList.find(
      item => item.value === managerName
    );

    this.selectedPlantManager = manager ?? null;

    if (!manager || !Number.isFinite(qty) || qty <= 0) {
      this.qtyLimitError = false;
      return;
    }

    const allocatedQty = this.getManagerAllocatedQty(manager.value);

    this.qtyLimitError =
      allocatedQty + qty > manager.limit;
  }

  addAllocations(): void {

    if (this.allocationForm.invalid) {
      this.allocationForm.markAllAsTouched();
      return;
    }

    const formValue = this.allocationForm.getRawValue();
    const qty = Number(formValue.qty);

    const manager = this.plantManagerList.find(
      item => item.value === formValue.plantManager
    );

    const plant = this.plantNameList.find(
      item => item.value === formValue.plantName
    );

    if (!manager || !plant || !Number.isFinite(qty) || qty <= 0) {
      return;
    }

    const allocatedQty = this.getManagerAllocatedQty(manager.value);

    if (allocatedQty + qty > manager.limit) {
      this.selectedPlantManager = manager;
      this.qtyLimitError = true;
      return;
    }

    if (this.selectedQty > 0 && qty > this.remainingQty) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Quantity cannot be greater than the remaining quantity.'
      });
      return;
    }

    this.allocations = [
      ...this.allocations,
      {
        qty,
        plantName: { ...plant },
        plantManager: { ...manager }
      }
    ];

    this.saveAllocations();

    if (this.selectedQty > 0) {
      this.remainingQty -= qty;
    }

    this.updateManagerLimits();

    this.allocationForm.reset({
      qty: 0,
      plantName: '',
      plantManager: ''
    });

    this.qtyLimitError = false;
    this.selectedPlantManager = null;
  }

  viewPlantManagers(event: Event): void {
    this.checkQtyLimit();

    if (this.selectedPlantManager) {
      this.op.toggle(event);
    }
  }

  getSuggestedManagers(): PlantManager[] {
    if (!this.selectedPlantManager) {
      return [];
    }

    const qty = Number(this.allocationForm.get('qty')?.value);

    if (!Number.isFinite(qty) || qty <= 0) {
      return [];
    }

    return this.plantManagerList
      .filter(manager => {
        if (manager.value === this.selectedPlantManager?.value) {
          return false;
        }

        const availableLimit =
          manager.limit - this.getManagerAllocatedQty(manager.value);

        return availableLimit >= qty;
      })
      .sort((a, b) => a.limit - b.limit);
  }

  // Add limits to selected managers and save to shared storage.
  saveLimit(): void {

    if (this.limitForm.invalid) {
      this.limitForm.markAllAsTouched();
      return;
    }

    const formValue = this.limitForm.getRawValue();
    const managerNames: string[] = formValue.plantManager;
    const extraQty = Number(formValue.qty);

    if (
      !managerNames?.length ||
      !Number.isInteger(extraQty) ||
      extraQty <= 0
    ) {
      return;
    }

    try {
      const managers: StoredManager[] = JSON.parse(
        localStorage.getItem(this.storageKey) || '[]'
      );

      managerNames.forEach(name => {
        const manager = managers.find(item => item.name === name);

        if (manager) {
          manager.limit += extraQty;
        }
      });

      localStorage.setItem(this.storageKey, JSON.stringify(managers));

      // Refresh current screen.
      this.loadSharedManagerLimits();
      this.updateManagerLimits();

      // Notify other components in the same browser tab.
      window.dispatchEvent(new Event(this.updateEvent));

      this.successMessage =
        `Successfully added ${extraQty} to ${managerNames.join(', ')}.`;

      this.showLimitForm = false;
      this.showSuccessDialog = true;

      this.limitForm.reset({
        plantManager: [],
        qty: null
      });

    } catch (error) {
      console.error('Error updating manager limits:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to update manager limits.'
      });
    }
  }

  cancelLimit(): void {
    this.showLimitForm = false;

    this.limitForm.reset({
      plantManager: [],
      qty: null
    });
  }

  removeAllocation(index: number, allocation: Allocation): void {
    if (!this.allocations[index]) {
      return;
    }

    this.pendingDeleteIndex = index;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {

    if (
      this.pendingDeleteIndex < 0 ||
      this.pendingDeleteIndex >= this.allocations.length
    ) {
      return;
    }

    const index = this.pendingDeleteIndex;
    const deletedAllocation = this.allocations[index];

    this.allocations = this.allocations.filter(
      (_, currentIndex) => currentIndex !== index
    );

    this.saveAllocations();

    if (this.selectedQty > 0) {
      this.remainingQty = Math.min(
        this.selectedQty,
        this.remainingQty + Number(deletedAllocation.qty)
      );
    }

    // Deleting an allocation does not change the total manager limit.
    this.updateManagerLimits();

    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.pendingDeleteIndex = -1;
  }

  submitAll(): void {

    if (this.allocations.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please add allocations before submitting.'
      });
      return;
    }

    const submittedAllocations = this.allocations.map(item => ({
      plantManager: item.plantManager?.value ?? '',
      plant: item.plantName?.value ?? '',
      qty: Number(item.qty)
    }));

    try {
      localStorage.setItem(
        this.submittedStorageKey,
        JSON.stringify(submittedAllocations)
      );

      this.saveAllocations();

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Allocations submitted successfully.'
      });

    } catch (error) {
      console.error('Error submitting allocations:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to submit allocations.'
      });
    }
  }

  canAddAllocation(): boolean {

    const managerName =
      this.allocationForm.get('plantManager')?.value;

    const qty = Number(this.allocationForm.get('qty')?.value);
    const plantName = this.allocationForm.get('plantName')?.value;

    if (!managerName || !plantName || !qty || qty <= 0) {
      return false;
    }

    const manager = this.plantManagerList.find(
      item => item.value === managerName
    );

    if (!manager || manager.disabled) {
      return false;
    }

    const alreadyAllocated = this.getManagerAllocatedQty(managerName);
    const availableLimit = manager.limit - alreadyAllocated;

    return (
      qty <= availableLimit &&
      (this.selectedQty <= 0 || qty <= this.remainingQty)
    );
  }
}
