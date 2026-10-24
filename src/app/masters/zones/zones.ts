import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_ZONES: any[] = [
  { zoneId: 1, zone: 'North', status: true },
  { zoneId: 2, zone: 'South', status: true },
  { zoneId: 3, zone: 'East', status: true },
  { zoneId: 4, zone: 'West', status: false },
  { zoneId: 5, zone: 'Central', status: true },
  { zoneId: 6, zone: 'Gujarat', status: true },
  { zoneId: 7, zone: 'Tamil Nadu', status: true },
  { zoneId: 8, zone: 'Rajasthan', status: false },
  { zoneId: 9, zone: 'Karnataka', status: true },
  { zoneId: 10, zone: 'Andhra', status: true },
];

@Component({
  selector: 'app-zones',
  imports: [Shared],
  templateUrl: './zones.html',
  styleUrl: './zones.css',
})
export class Zones implements OnInit {
  showZoneModal = false;

  zoneList: any[] = [];

  selectedZone: any;

  actionName = 'Create';

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private apiService: Apiservice, 
    private messageService: MessageService, private confirmationService: ConfirmationService){} 

  zoneForm = this.fb.group({
    zoneId: [0],
    zone: ['', [Validators.required, Validators.maxLength(12)]],
    status: [false]
  })

  get zone(){
    return this.zoneForm.get('zone');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllZones();
  }

  fetchAllZones(){
    try {
      this.apiService.fetchAllZones('').subscribe({
        next: val => {
          this.zoneList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.zoneList = MOCK_ZONES;
          }
        }
      })
    } catch (error) {
      this.zoneList = MOCK_ZONES;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitZoneForm(){
    try {
      if (this.zoneForm.valid) {   
        if (!this.selectedZone) {
          const data = this.zoneForm.value;

          this.apiService.createZone(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Zone' });
              this.showZoneModal = false;
              this.fetchAllZones();
            },
            error: err => {
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createZoneLocally(data);
              }
            }
          })
        } else {
          const data = this.zoneForm.value;
  
          this.apiService.updateZone(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Zone' });
              this.showZoneModal = false;
              this.fetchAllZones();
            },
            error: err => {
  
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateZoneLocally(data);
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

  private createZoneLocally(data: any){
    const newId = Math.max(0, ...this.zoneList.map(z => z.zoneId || 0)) + 1;
    const newZone = { ...data, zoneId: newId };
    this.zoneList = [newZone, ...this.zoneList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Zone' });
    this.showZoneModal = false;
  }

  private updateZoneLocally(data: any){
    this.zoneList = this.zoneList.map(z => z.zoneId === data.zoneId ? { ...z, ...data } : z);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Zone' });
    this.showZoneModal = false;
  }

  editZone(){
    try {
      this.showZoneModal = true;
      this.actionName = 'Update';
      this.zoneForm.patchValue(this.selectedZone);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteZone(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Zone`,
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
            zoneId: this.selectedZone.zoneId
          }
          this.apiService.deleteZone(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Zone' });
              this.fetchAllZones();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.zoneList = this.zoneList.filter(z => z.zoneId !== this.selectedZone.zoneId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Zone' });
              }
            }
          })
      }
    });
  }

  openZoneModal(){
    try {
      this.showZoneModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editZone()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteZone()
      }
    ]
  }

  zoneMenu(event: Event, menu: any, zone: any){
    this.selectedZone = zone;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedZone = null;
    this.actionName = 'Create';
    this.zoneForm.reset();
  }
}
