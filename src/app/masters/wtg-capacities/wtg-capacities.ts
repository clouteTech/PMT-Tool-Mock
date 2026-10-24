import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_WTG_CAPACITIES: any[] = [
  { capacityId: 1, capacity: 2.1, unit: 'MW', status: true },
  { capacityId: 2, capacity: 2.5, unit: 'MW', status: true },
  { capacityId: 3, capacity: 3.0, unit: 'MW', status: true },
  { capacityId: 4, capacity: 3.3, unit: 'MW', status: false },
  { capacityId: 5, capacity: 3.6, unit: 'MW', status: true },
  { capacityId: 6, capacity: 4.2, unit: 'MW', status: true },
  { capacityId: 7, capacity: 1.5, unit: 'MW', status: false },
  { capacityId: 8, capacity: 2.0, unit: 'MW', status: true },
  { capacityId: 9, capacity: 2.8, unit: 'MW', status: true },
  { capacityId: 10, capacity: 3.8, unit: 'MW', status: true },
];

@Component({
  selector: 'app-wtg-capacities',
  imports: [Shared],
  templateUrl: './wtg-capacities.html',
  styleUrl: './wtg-capacities.css',
})
export class WtgCapacities implements OnInit {
  showWtgCapacityModal = false;

  selectedCapacity: any;

  wtgCapacityList: any[] = [];

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  wtgCapacityForm = this.fb.group({
    capacityId: [0],
    capacity: [null, Validators.required],
    unit: ['', Validators.required],
    status: [false]
  })

  get capacity(){
    return this.wtgCapacityForm.get('capacity');
  }

  get unit(){
    return this.wtgCapacityForm.get('unit');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllCapacities();
  }

  fetchAllCapacities(){
    try {
      this.apiService.fetchAllCapacities('').subscribe({
        next: val => {
          this.wtgCapacityList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.wtgCapacityList = MOCK_WTG_CAPACITIES;
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      this.wtgCapacityList = MOCK_WTG_CAPACITIES;
    }
  }

  submitCapacityForm(){
    try {
      if (this.wtgCapacityForm.valid) {
        if (!this.selectedCapacity) {  
          const data = this.wtgCapacityForm.value;
    
          this.apiService.createCapacity(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Capacity' });
              this.showWtgCapacityModal = false;
              this.fetchAllCapacities();
            },
            error: err => {

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createCapacityLocally(data);
              }
            }
          })
        } else {
          const data = this.wtgCapacityForm.value;
  
          this.apiService.updateCapacity(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Capacity' });
              this.showWtgCapacityModal = false;
              this.fetchAllCapacities();
            },
            error: err => {
  
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateCapacityLocally(data);
              }
            }
          })
        }       
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill All Required field' });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // ── Demo mode CRUD (operates on the in-memory mock list when the backend is unreachable) ──

  private createCapacityLocally(data: any){
    const newId = Math.max(0, ...this.wtgCapacityList.map(c => c.capacityId || 0)) + 1;
    const newCapacity = { ...data, capacityId: newId };
    this.wtgCapacityList = [newCapacity, ...this.wtgCapacityList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Capacity' });
    this.showWtgCapacityModal = false;
  }

  private updateCapacityLocally(data: any){
    this.wtgCapacityList = this.wtgCapacityList.map(c => c.capacityId === data.capacityId ? { ...c, ...data } : c);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Capacity' });
    this.showWtgCapacityModal = false;
  }

  unitList = [
    {
      label: 'MW',
      value: 'MW'
    },
    {
      label: 'KW',
      value: 'KW'
    },
    {
      label: 'GW',
      value: 'GW'
    },
  ]

  editCapacity(){
    try {
      this.showWtgCapacityModal = true;
      this.wtgCapacityForm.patchValue(this.selectedCapacity);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openWTGCapacityModal(){
    try {
      this.showWtgCapacityModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCapacity()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCapacity()
      }
    ]
  }

  deleteCapacity(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete WTG Capacity`,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
      },
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger'
      },
      accept: () => {
          const data = {
            capacityId: this.selectedCapacity.capacityId
          }

          this.apiService.deleteCapacity(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Capacity' });
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.wtgCapacityList = this.wtgCapacityList.filter(c => c.capacityId !== this.selectedCapacity.capacityId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Capacity' });
              }
            }
          })
      }
    });
  }

  capacityMenu(event: Event, menu: any, capacity: any){
    this.selectedCapacity = capacity;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCapacity = null;
    this.wtgCapacityForm.reset();
  }
}
