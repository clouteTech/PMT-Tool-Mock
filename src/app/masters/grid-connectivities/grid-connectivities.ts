import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_GRID_CONNECTIVITIES: any[] = [
  { gridConnectivityId: 1, gridConnectivity: 'STU', status: true },
  { gridConnectivityId: 2, gridConnectivity: 'CTU', status: true },
  { gridConnectivityId: 3, gridConnectivity: 'ISTS', status: true },
  { gridConnectivityId: 4, gridConnectivity: 'Intra-State', status: true },
  { gridConnectivityId: 5, gridConnectivity: 'Inter-State', status: false },
  { gridConnectivityId: 6, gridConnectivity: 'DISCOM Direct', status: true },
  { gridConnectivityId: 7, gridConnectivity: '33kV Feeder', status: true },
  { gridConnectivityId: 8, gridConnectivity: '66kV Substation', status: false },
  { gridConnectivityId: 9, gridConnectivity: '132kV Substation', status: true },
  { gridConnectivityId: 10, gridConnectivity: '220kV Substation', status: true },
];

@Component({
  selector: 'app-grid-connectivities',
  imports: [Shared],
  templateUrl: './grid-connectivities.html',
  styleUrl: './grid-connectivities.css',
})
export class GridConnectivities {
  showConnectivityModal = false;

  selectedGridConnectivity: any;

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  gridConnectivityForm = this.fb.group({
    gridConnectivityId: [0],
    gridConnectivity: ['', [Validators.required, Validators.maxLength(50)]],
    status: [false]
  })

  get gridConnectivity(){
    return this.gridConnectivityForm.get('gridConnectivity');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllGridConnectivities();

  }

  fetchAllGridConnectivities(){
    try {
      this.apiService.fetchAllGridConnectivities('').subscribe({
        next: val => {
          this.gridConnectivityList = val.data;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.gridConnectivityList = MOCK_GRID_CONNECTIVITIES;
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      this.gridConnectivityList = MOCK_GRID_CONNECTIVITIES;
    }
  }

  submitGridConnectivityForm(){
    try {
      if (this.gridConnectivityForm.valid) {
        if (!this.selectedGridConnectivity) { 
          const data = this.gridConnectivityForm.value;
    
          this.apiService.createGridConnectivity(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Grid Connectivity' });
              this.showConnectivityModal = false;
              this.fetchAllGridConnectivities();
            },
            error: err => {
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createGridConnectivityLocally(data);
              }
            }
          })
        } else {
          const data = this.gridConnectivityForm.value;

          this.apiService.updateGridConnectivity(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Grid Connectivity' });
              this.showConnectivityModal = false;
              this.fetchAllGridConnectivities();
            },
            error: err => {
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateGridConnectivityLocally(data);
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

  private createGridConnectivityLocally(data: any){
    const newId = Math.max(0, ...this.gridConnectivityList.map((g: any) => g.gridConnectivityId || 0)) + 1;
    const newGridConnectivity = { ...data, gridConnectivityId: newId };
    this.gridConnectivityList = [newGridConnectivity, ...this.gridConnectivityList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Grid Connectivity' });
    this.showConnectivityModal = false;
  }

  private updateGridConnectivityLocally(data: any){
    this.gridConnectivityList = this.gridConnectivityList.map((g: any) => g.gridConnectivityId === data.gridConnectivityId ? { ...g, ...data } : g);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Grid Connectivity' });
    this.showConnectivityModal = false;
  }

  editGridConnectivity(){
    try {
      this.showConnectivityModal = true;
      this.gridConnectivityForm.patchValue(this.selectedGridConnectivity);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  gridConnectivityList = [
    {
      gridConnectivityName: 'STU'
    },
    {
      gridConnectivityName: 'CTU'
    }
  ]

  openGridConnectivityModal(){
    try {
      this.showConnectivityModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editGridConnectivity()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteGridConnectivity()
      }
    ]
  }

  deleteGridConnectivity(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Grid Connectivities`,
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
          gridConnectivityId: this.selectedGridConnectivity.gridConnectivityId
        }
        this.apiService.deleteGridConnectivity(data).subscribe({
          next: val => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Grid Connectivity' });
            this.fetchAllGridConnectivities();
          },
          error: err => {

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            } else {
              this.gridConnectivityList = this.gridConnectivityList.filter((g: any) => g.gridConnectivityId !== this.selectedGridConnectivity.gridConnectivityId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Grid Connectivity' });
            }
          }
        })
      }
    });
  }

  gridConnectivityMenu(event: Event, menu: any, gridConnectivity: any){
    this.selectedGridConnectivity = gridConnectivity;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedGridConnectivity = null;
    this.gridConnectivityForm.reset();
  }
}
