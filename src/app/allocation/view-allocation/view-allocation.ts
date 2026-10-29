import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService,MenuItem, MessageService} from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';
import { MultiSelectModule } from 'primeng/multiselect';
interface Allocation {
  id: number;
  plantManager: string[];
  plant: string;
  qty: number;
}

@Component({
  selector: 'app-view-allocation',
  standalone: true,
  imports: [Shared, MultiSelectModule],
  templateUrl: './view-allocation.html',
  styleUrl: './view-allocation.css',
  providers: [ConfirmationService, MessageService]
})
export class ViewAllocation implements OnInit {

  // Allocation table data
  plantList: Allocation[] = [];

  // Plant Manager dropdown options
  userList = [
 { label: 'Suresh Reddy', value: 'Suresh Reddy' },
    { label: 'Laxmi Devi', value: 'Laxmi Devi' },
    { label: 'Anitha Rao', value: 'Anitha Rao' }

  ];

  // Plant dropdown options
  plantOptions = [
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Trichy', value: 'Trichy' },
    { label: 'Pune', value: 'Pune' }
  ];

  items: MenuItem[] = [];

  showPlantModal = false;
  selectedPlant: Allocation | null = null;
  actionName = 'Create';  

  Number = Number;

  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // Allocation form
  plantForm = this.fb.group({
    plantManager: this.fb.control<string[]>([], {
      validators: [Validators.required]
    }),
    plant: this.fb.control('', {
      validators: [Validators.required]
    }),
    qty: this.fb.control(0, {
      validators: [Validators.required, Validators.min(1)]
    })
  });

  // Form control getters
  get plant() {
    return this.plantForm.get('plant');
  }

  get plantManager() {
    return this.plantForm.get('plantManager');
  }

  get qty() {
    return this.plantForm.get('qty');
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editPlant()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deletePlant()
      }
    ];

    // Load allocations submitted from Plant Allocation
    this.loadAllocations();
  }

  // Load saved allocation data
  loadAllocations(): void {
    try {
      const savedData = localStorage.getItem('plantAllocations');
      const parsedData: any[] = savedData
        ? JSON.parse(savedData)
        : [];

      this.plantList = parsedData.map((item, index) => ({
        id: item.id ?? index + 1,

        // Support both single and multiple managers
        plantManager: Array.isArray(item.plantManager)
          ? item.plantManager
          : item.plantManager
            ? [item.plantManager]
            : [],

        // Support both plantName and plant property names
        plant: typeof item.plant === 'string'
          ? item.plant
          : item.plantName?.label ?? item.plantName ?? '',

        qty: Number(item.qty) || 0
      }));

      // Save normalized records with IDs
      this.saveAllocations();

      console.log('Loaded Plant Allocations:', this.plantList);

    } catch (error) {
      console.error('Unable to load allocations:', error);
      this.plantList = [];
    }
  }

  // Save allocation data in browser storage
  saveAllocations(): void {
    localStorage.setItem(
      'plantAllocations',
      JSON.stringify(this.plantList)
    );
  }

  // Open Create Allocation dialog
  openPlantModal(): void {
    this.selectedPlant = null;
    this.actionName = 'Create';

    this.plantForm.reset({
      plantManager: [],
      plant: '',
      qty: 0
    });

    this.showPlantModal = true;
  }

  // Open row action menu
  plantMenu(event: Event, menu: any, plant: Allocation): void {
    this.selectedPlant = plant;
    menu.toggle(event);
  }

  // Edit existing allocation
  editPlant(): void {
    if (!this.selectedPlant) {
      return;
    }

    this.actionName = 'Update';

    this.plantForm.patchValue({
      plantManager: [...this.selectedPlant.plantManager],
      plant: this.selectedPlant.plant,
      qty: this.selectedPlant.qty
    });

    this.showPlantModal = true;
  }

  // Create or update allocation
  submitPlantForm(): void {
    if (this.plantForm.invalid) {
      this.plantForm.markAllAsTouched();
      return;
    }

    const formValue = this.plantForm.getRawValue();

    const allocationData = {
      plantManager: formValue.plantManager ?? [],
      plant: formValue.plant?.trim() ?? '',
      qty: Number(formValue.qty)
    };

    if (this.selectedPlant) {
      // Update existing record
      this.plantList = this.plantList.map(item =>
        item.id === this.selectedPlant!.id
          ? { ...item, ...allocationData }
          : item
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Allocation updated successfully'
      });

    } else {
      // Create a new record
      const newId =
        Math.max(0, ...this.plantList.map(item => item.id)) + 1;

      const newAllocation: Allocation = {
        id: newId,
        ...allocationData
      };

      this.plantList = [newAllocation, ...this.plantList];

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Allocation created successfully'
      });
    }

    // Persist Create and Update operations
    this.saveAllocations();

    this.showPlantModal = false;
    this.onDialogClose();
  }

  // Delete confirmation
  deletePlant(): void {
    if (!this.selectedPlant) {
      return;
    }

    const allocation = this.selectedPlant;

    this.confirmationService.confirm({
      header: 'Delete Allocation',
      message: 'Are you sure you want to delete this allocation?',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',

      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },

      acceptButtonProps: {
        severity: 'danger'
      },

      accept: () => {
        this.plantList = this.plantList.filter(
          item => item.id !== allocation.id
        );

        // Persist the deletion
        this.saveAllocations();

        this.selectedPlant = null;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Allocation deleted successfully'
        });
      }
    });
  }

  // Close and reset dialog
  onDialogClose(): void {
    this.showPlantModal = false;
    this.selectedPlant = null;
    this.actionName = 'Create';

    this.plantForm.reset({
      plantManager: [],
      plant: '',
      qty: 0
    });
  }

  // Display multiple managers in a single table cell
  getManagerNames(plant: Allocation): string {
    return plant.plantManager.join(', ');
  }

  // Increase quantity
  incrementQty(): void {
    const currentQty =
      Number(this.plantForm.get('qty')?.value) || 0;

    this.plantForm.get('qty')?.setValue(currentQty + 1);
  }

  // Decrease quantity without going below 1
  decrementQty(): void {
    const currentQty =
      Number(this.plantForm.get('qty')?.value) || 1;

    if (currentQty > 1) {
      this.plantForm.get('qty')?.setValue(currentQty - 1);
    }
  }
}
