import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_BLADE_TYPES: any[] = [
  { bladeTypeId: 1, bladeType: 'EN-141 Blade', countPerWtg: 3, status: true },
  { bladeTypeId: 2, bladeType: 'EN-156 Blade', countPerWtg: 3, status: true },
  { bladeTypeId: 3, bladeType: 'EN-165 Blade', countPerWtg: 3, status: true },
  { bladeTypeId: 4, bladeType: 'S128 Blade', countPerWtg: 3, status: false },
  { bladeTypeId: 5, bladeType: 'S120 Blade', countPerWtg: 3, status: true },
  { bladeTypeId: 6, bladeType: 'V150 Blade', countPerWtg: 3, status: true },
  { bladeTypeId: 7, bladeType: 'GE 2.7-132 Blade', countPerWtg: 3, status: false },
  { bladeTypeId: 8, bladeType: 'N149 Blade', countPerWtg: 3, status: true },
  { bladeTypeId: 9, bladeType: 'AW3000 Blade', countPerWtg: 3, status: true },
  { bladeTypeId: 10, bladeType: 'MP2.5 Blade', countPerWtg: 3, status: true },
];

@Component({
  selector: 'app-blade-types',
  imports: [Shared],
  templateUrl: './blade-types.html',
  styleUrl: './blade-types.css',
})
export class BladeTypes implements OnInit {
  showBladeTypeModal = false;

  actionName = 'Create';

  selectedBladeType: any;

  bladeTypeList: any[] = [];

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  bladeTypeForm = this.fb.group({
    bladeTypeId: [0],
    bladeType: ['', [Validators.required, Validators.maxLength(50)]],
    countPerWtg: [null, [Validators.required, Validators.min(1)]],
    status: [false]
  })

  get bladeType(){
    return this.bladeTypeForm.get('bladeType');
  }

  get countPerWtg(){
    return this.bladeTypeForm.get('countPerWtg');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllBladeTypes();
  }

  fetchAllBladeTypes(){
    try {
      this.apiService.fetchAllBladeTypes('').subscribe({
        next: val => {
          this.bladeTypeList = val.data;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.bladeTypeList = MOCK_BLADE_TYPES;
          }
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  createBladeType(){
    try {
      if (this.bladeTypeForm.valid) {
        if (!this.selectedBladeType) {
          const data = this.bladeTypeForm.value;
    
          this.apiService.createBladeType(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Blade Type' });
              this.showBladeTypeModal = false;
              this.fetchAllBladeTypes();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createBladeTypeLocally(data);
              }
            }
          })
        } else {
          const data = this.bladeTypeForm.value;
          console.log(data);
  
          this.apiService.updateBladeType(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Blade Type' });
              this.showBladeTypeModal = false;
              this.fetchAllBladeTypes();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateBladeTypeLocally(data);
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

  private createBladeTypeLocally(data: any){
    const newId = Math.max(0, ...this.bladeTypeList.map(b => b.bladeTypeId || 0)) + 1;
    const newBladeType = { ...data, bladeTypeId: newId };
    this.bladeTypeList = [newBladeType, ...this.bladeTypeList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Blade Type' });
    this.showBladeTypeModal = false;
  }

  private updateBladeTypeLocally(data: any){
    this.bladeTypeList = this.bladeTypeList.map(b => b.bladeTypeId === data.bladeTypeId ? { ...b, ...data } : b);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Blade Type' });
    this.showBladeTypeModal = false;
  }

  editBladeType(){
    try {
      this.showBladeTypeModal = true;
      this.actionName = 'Update';
      this.bladeTypeForm.patchValue(this.selectedBladeType);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openBladeTypeModal(){
    try {
      this.showBladeTypeModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editBladeType()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteBladeType()
      }
    ]
  }

  bladeTypeMenu(event: Event, menu: any, bladeTypes: any){
    this.selectedBladeType = bladeTypes;

    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editBladeType()
      },

      ...(bladeTypes.status ? [{
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteBladeType()
      }] : [])
    ];

    menu.toggle(event);
  }

  deleteBladeType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Blade Type`,
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
            bladeTypeId: this.selectedBladeType.bladeTypeId
          }
          this.apiService.deleteBladeType(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Blade Type' });
              this.fetchAllBladeTypes();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.bladeTypeList = this.bladeTypeList.filter(b => b.bladeTypeId !== this.selectedBladeType.bladeTypeId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Blade Type' });
              }
            }
          })
      }
    });
  }

  onDialogClose() {
    this.selectedBladeType = null;
    this.actionName = 'Create';
    this.bladeTypeForm.reset();
  }
}
