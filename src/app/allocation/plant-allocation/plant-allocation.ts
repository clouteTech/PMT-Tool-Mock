
import { Component, OnInit, ViewChild } from '@angular/core';

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
    MultiSelectModule
  ],
  templateUrl: './plant-allocation.html',
  styleUrl: './plant-allocation.css'
})
export class PlantAllocation implements OnInit {

  selectedQty = 0;
  remainingQty = 0;

  allocations: Allocation[] = [];
  selectedComponents: any[] = [];

  qtyLimitError = false;
  showPlantManager = false;
  showLimitForm = false;
  showDeleteDialog = false;

  availableManagerCount = 0;

  pendingDeleteIndex = -1;
showSuccessDialog = false;
successMessage = '';
  @ViewChild('op') op!: Popover;

  selectedPlantManager: PlantManager | null = null;

  // Configured limits. Do not reduce these when allocations are added.
  plantManagerList: PlantManager[] = [
    {
      label: 'Suresh Reddy (limit 10)',
      value: 'Suresh Reddy',
      limit: 10,
      disabled: false
    },
    {
      label: 'Laxmi Devi (limit 20)',
      value: 'Laxmi Devi',
      limit: 20,
      disabled: false
    },
    {
      label: 'Anitha Rao (limit 40)',
      value: 'Anitha Rao',
      limit: 40,
      disabled: false
    }
  ];

  // Add Limit popup dropdown
  plantManagerList1: PlantManagerLimit[] = [
    {
      name: 'Suresh Reddy',
      limit: 10,
      label: 'Suresh Reddy (limit 10)'
    },
    {
      name: 'Laxmi Devi',
      limit: 20,
      label: 'Laxmi Devi (limit 20)'
    },
    {
      name: 'Anitha Rao',
      limit: 40,
      label: 'Anitha Rao (limit 40)'
    }
  ];

  plantNameList: PlantOption[] = [
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Trichy', value: 'Trichy' },
    { label: 'Pune', value: 'Pune' }
  ];

  allocationForm: FormGroup;
  limitForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
  }

  // Group components by name
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

  // Update total and remaining quantity
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

  // Calculate how much a manager has allocated
  getManagerAllocatedQty(managerName: string): number {
    return this.allocations
      .filter(allocation =>
        allocation.plantManager.value === managerName
      )
      .reduce(
        (total, allocation) => total + Number(allocation.qty),
        0
      );
  }

  // Refresh BOTH dropdowns after adding, deleting or changing a limit
updateManagerLimits(): void {
  // Update the main Plant Manager dropdown
  this.plantManagerList = this.plantManagerList.map(manager => {
    const allocatedQty = this.getManagerAllocatedQty(manager.value);
    const remainingLimit = Math.max(0, manager.limit - allocatedQty);

    return {
      ...manager,
      label: `${manager.value} (remaining limit ${remainingLimit})`,
      disabled: remainingLimit === 0
    };
  });

  // Update the Add Limit multi-select dropdown
  this.plantManagerList1 = this.plantManagerList1.map(manager => {
    const mainManager = this.plantManagerList.find(
      item => item.value === manager.name
    );

    if (!mainManager) {
      return manager;
    }

    const allocatedQty = this.getManagerAllocatedQty(manager.name);
    const remainingLimit = Math.max(0, mainManager.limit - allocatedQty);

    return {
      ...manager,
      limit: remainingLimit,
      label: `${manager.name} (remaining limit ${remainingLimit})`
    };
  });

  this.availableManagerCount = this.plantManagerList.filter(
    manager => !manager.disabled
  ).length;
}
  // Check the entered quantity against the selected manager's capacity
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

  // Add an allocation
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
      alert('Quantity cannot be greater than the remaining quantity.');
      return;
    }

    // Save a copy of the manager and plant details with the allocation
    this.allocations = [
      ...this.allocations,
      {
        qty,
        plantName: { ...plant },
        plantManager: { ...manager }
      }
    ];

    if (this.selectedQty > 0) {
      this.remainingQty -= qty;
    }

    // Refresh both dropdowns
    this.updateManagerLimits();

    this.allocationForm.reset({
      qty: 0,
      plantName: '',
      plantManager: ''
    });

    this.qtyLimitError = false;
    this.selectedPlantManager = null;
  }

  // Open the quantity limit popup
  viewPlantManagers(event: Event): void {
    this.checkQtyLimit();

    if (this.selectedPlantManager) {
      this.op.toggle(event);
    }
  }

  // Suggest other managers who have enough remaining capacity
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

  // Increase a manager's configured limit
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
    !Number.isFinite(extraQty) ||
    extraQty <= 0
  ) {
    return;
  }

  // Update the selected managers' limits
  this.plantManagerList = this.plantManagerList.map(manager => {
    if (managerNames.includes(manager.value)) {
      return {
        ...manager,
        limit: manager.limit + extraQty
      };
    }

    return manager;
  });

  // Refresh both dropdowns
  this.updateManagerLimits();

  // Prepare success confirmation
  this.successMessage =
    `Successfully added ${extraQty} to ${managerNames.join(', ')}.`;

  // Close Add Limit dialog
  this.showLimitForm = false;

  // Open success popup
  this.showSuccessDialog = true;

  this.limitForm.reset({
    plantManager: [],
    qty: null
  });
}
  // Cancel Add Limit popup
cancelLimit(): void {
  this.showLimitForm = false;

  this.limitForm.reset({
    plantManager: [],
    qty: null
  });
}
  // Open delete confirmation popup
  removeAllocation(index: number, allocation: Allocation): void {
    if (!this.allocations[index]) {
      return;
    }

    this.pendingDeleteIndex = index;
    this.showDeleteDialog = true;
  }

  // Delete allocation after confirmation
  confirmDelete(): void {
    if (
      this.pendingDeleteIndex < 0 ||
      this.pendingDeleteIndex >= this.allocations.length
    ) {
      return;
    }

    const index = this.pendingDeleteIndex;
    const deletedAllocation = this.allocations[index];

    // Remove allocation from the table
    this.allocations = this.allocations.filter(
      (_, currentIndex) => currentIndex !== index
    );

    // Restore the quantity
    if (this.selectedQty > 0) {
      this.remainingQty = Math.min(
        this.selectedQty,
        this.remainingQty + Number(deletedAllocation.qty)
      );
    }

    // IMPORTANT: Refresh both dropdowns after deleting
    this.updateManagerLimits();

    // Close confirmation popup
    this.cancelDelete();
  }

  // Cancel delete confirmation
  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.pendingDeleteIndex = -1;
  }

  // Submit all allocations
  submitAll(): void {
    if (this.allocations.length === 0) {
      alert('Please add at least one allocation before submitting.');
      return;
    }

    // Connect your backend API here when it is ready.
    alert('Allocations are ready. Connect the backend API to save them.');
  }


  canAddAllocation(): boolean {
  const managerName = this.allocationForm.get('plantManager')?.value;
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

  return qty <= availableLimit;
}
}
