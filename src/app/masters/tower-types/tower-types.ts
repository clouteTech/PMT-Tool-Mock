import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_TOWER_TYPES: any[] = [
  { towerTypeId: 1, towerType: '120HH-474T', sectionCount: 5, status: true },
  { towerTypeId: 2, towerType: '140HH-520T', sectionCount: 6, status: true },
  { towerTypeId: 3, towerType: '100HH-380T', sectionCount: 4, status: false },
  { towerTypeId: 4, towerType: '160HH-560T', sectionCount: 7, status: true },
  { towerTypeId: 5, towerType: '130HH-490T', sectionCount: 5, status: true },
  { towerTypeId: 6, towerType: '150HH-540T', sectionCount: 6, status: true },
  { towerTypeId: 7, towerType: '110HH-410T', sectionCount: 4, status: false },
  { towerTypeId: 8, towerType: '145HH-510T', sectionCount: 6, status: true },
  { towerTypeId: 9, towerType: '135HH-500T', sectionCount: 5, status: true },
  { towerTypeId: 10, towerType: '125HH-480T', sectionCount: 5, status: true },
];

@Component({
  selector: 'app-tower-types',
  imports: [Shared],
  templateUrl: './tower-types.html',
  styleUrl: './tower-types.css',
})
export class TowerTypes implements OnInit {
  showTowerTypeModal = false;

  items: MenuItem[] = [];

  selectedTowerType: any;

  actionName = 'Create';

  private fb = inject(FormBuilder);

  constructor(private apiService: Apiservice, 
    private messageService: MessageService, private confirmationService: ConfirmationService){} 

  towerTypeForm = this.fb.group({
    towerTypeId: [0],
    towerType: ['', [Validators.required, Validators.maxLength(50)]],
    sectionCount: [null, [Validators.required, Validators.min(1)]],
    status: [false]
  })

  get towerType(){
    return this.towerTypeForm.get('towerType');
  }

  get sectionCount(){
    return this.towerTypeForm.get('sectionCount');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllTowerType();
  }

  fetchAllTowerType(){
    try {
      this.apiService.fetchAllTowerTypes('').subscribe({
        next: val => {
          this.towerTypeList = val.data;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.towerTypeList = MOCK_TOWER_TYPES;
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      this.towerTypeList = MOCK_TOWER_TYPES;
    }
  }

  submitTowerTypeForm(){
    try {
      if (this.towerTypeForm.valid) {   
        if (!this.selectedTowerType) {     
          const data = this.towerTypeForm.value;
    
          this.apiService.createTowerType(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Tower Type' });
              this.showTowerTypeModal = false;
              this.fetchAllTowerType();
            },
            error: err => {
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createTowerTypeLocally(data);
              }
            }
          })
        } else {
          const data = this.towerTypeForm.value;

          this.apiService.updateTowerType(data).subscribe({
            next: val => { 
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Tower Type' });
              this.showTowerTypeModal = false;
              this.fetchAllTowerType();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateTowerTypeLocally(data);
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

  private createTowerTypeLocally(data: any){
    const newId = Math.max(0, ...this.towerTypeList.map((t: any) => t.towerTypeId || 0)) + 1;
    const newTowerType = { ...data, towerTypeId: newId };
    this.towerTypeList = [newTowerType, ...this.towerTypeList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Tower Type' });
    this.showTowerTypeModal = false;
  }

  private updateTowerTypeLocally(data: any){
    this.towerTypeList = this.towerTypeList.map((t: any) => t.towerTypeId === data.towerTypeId ? { ...t, ...data } : t);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Tower Type' });
    this.showTowerTypeModal = false;
  }

  editTowerType(){
    try {
      this.showTowerTypeModal = true;
      this.actionName = 'Update';
      this.towerTypeForm.patchValue(this.selectedTowerType);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  towerTypeList = [
    {
      towerType: '120HH-474T',
      sectionCount: '5'
    },
    {
      towerType: '140HH-520T',
      sectionCount: '6'
    }
  ]

  openTowerTypeModal(){
    try {
      this.showTowerTypeModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editTowerType()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteTowerType()
      }
    ]
  }

  deleteTowerType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Tower Type`,
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
            towerTypeId: this.selectedTowerType.towerTypeId
          }

          this.apiService.deleteTowerType(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Tower Type' });
              this.fetchAllTowerType();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.towerTypeList = this.towerTypeList.filter((t: any) => t.towerTypeId !== this.selectedTowerType.towerTypeId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Tower Type' });
              }
            }
          })
      }
    });
  }

  towerTypeMenu(event: Event, menu: any, towerTypes: any){
    this.selectedTowerType = towerTypes;
    menu.toggle(event);
  }

  onDialogClose() {
    this.selectedTowerType = null;
    this.actionName = 'Create';
    this.towerTypeForm.reset();
  }
}
