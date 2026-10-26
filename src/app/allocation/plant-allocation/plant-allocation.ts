
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators} from '@angular/forms';
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

  constructor(private fb: FormBuilder,private messageService: MessageService) {
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
        allocation.plantManager.value === managerName
      )
      .reduce(
        (total, allocation) => total + Number(allocation.qty),
        0
      );
  }


  updateManagerLimits(): void {
   
    this.plantManagerList = this.plantManagerList.map(manager => {
      const allocatedQty = this.getManagerAllocatedQty(manager.value);
      const remainingLimit = Math.max(0, manager.limit - allocatedQty);

      return {
        ...manager,
        label: `${manager.value} (remaining limit ${remainingLimit})`,
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
      alert('Quantity cannot be greater than the remaining quantity.');
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

    
    this.plantManagerList = this.plantManagerList.map(manager => {
      if (managerNames.includes(manager.value)) {
        return {
          ...manager,
          limit: manager.limit + extraQty
        };
      }

      return manager;
    });

    
    this.updateManagerLimits();

    
    this.successMessage =
      `Successfully added ${extraQty} to ${managerNames.join(', ')}.`;

    this.showLimitForm = false;

   
    this.showSuccessDialog = true;

    this.limitForm.reset({
      plantManager: [],
      qty: null
    });
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

  
    if (this.selectedQty > 0) {
      this.remainingQty = Math.min(
        this.selectedQty,
        this.remainingQty + Number(deletedAllocation.qty)
      );
    }

   
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
      detail: 'Please add at least one allocation before submitting.',
      life: 3000
    });
    return;
  }

  this.messageService.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Allocations are ready to submit.',
    life: 3000
  });
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
