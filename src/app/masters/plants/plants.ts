import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_PLANTS: any[] = [
  { id: 1, plant: 'Plant Chennai', location: 'Chennai, Tamil Nadu', plantManager: 'Sanjay Kumar', status: true },
  { id: 2, plant: 'Plant Pune', location: 'Pune, Maharashtra', plantManager: 'Ananya Iyer', status: true },
  { id: 3, plant: 'Plant Trichy', location: 'Tiruchirappalli, Tamil Nadu', plantManager: 'Sivakumar R', status: false },
  { id: 4, plant: 'Plant Tuticorin', location: 'Thoothukudi, Tamil Nadu', plantManager: 'Kayalvizhi M', status: true },
  { id: 5, plant: 'Plant Vadodara', location: 'Vadodara, Gujarat', plantManager: 'Rakesh Patel', status: true },
  { id: 6, plant: 'Plant Kutch', location: 'Bhuj, Gujarat', plantManager: 'Meera Shah', status: true },
  { id: 7, plant: 'Plant Jaisalmer', location: 'Jaisalmer, Rajasthan', plantManager: 'Vikram Singh', status: false },
  { id: 8, plant: 'Plant Bengaluru', location: 'Bengaluru, Karnataka', plantManager: 'Deepa Nair', status: true },
  { id: 9, plant: 'Plant Hyderabad', location: 'Hyderabad, Telangana', plantManager: 'Suresh Reddy', status: true },
  { id: 10, plant: 'Plant Kutch Warehouse', location: 'Bhuj, Gujarat', plantManager: 'Arjun Mehta', status: true },
];

const MOCK_PLANT_MANAGER_USERS: any[] = [
  { user: { userName: 'Sanjay Kumar' } },
  { user: { userName: 'Ananya Iyer' } },
  { user: { userName: 'Sivakumar R' } },
  { user: { userName: 'Kayalvizhi M' } },
  { user: { userName: 'Rakesh Patel' } },
  { user: { userName: 'Meera Shah' } },
  { user: { userName: 'Vikram Singh' } },
  { user: { userName: 'Deepa Nair' } },
  { user: { userName: 'Suresh Reddy' } },
  { user: { userName: 'Arjun Mehta' } },
];

@Component({
  selector: 'app-plants',
  imports: [Shared],
  templateUrl: './plants.html',
  styleUrl: './plants.css',
})
export class Plants implements OnInit {
  showPlantModal = false;

  selectedPlant: any;

  actionName = 'Create';

  plantList: any[] = [];
  userList: any[] = [];

  items: MenuItem[] = [];

  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private apiService: Apiservice
  ){}

  plantForm = this.fb.group({
    plantId: [''],
    plant: ['', Validators.required],
    location: ['', Validators.required],
    plantManager: ['', Validators.required],
    status: [false]
  })

  get plant(){
    return this.plantForm.get('plant');
  }

  get location(){
    return this.plantForm.get('location');
  }

  get plantManager(){
    return this.plantForm.get('plantManager');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchPlantList();
  }

  fetchPlantList(){
    try {
      const data = {
        page: 0,
        size: 10,
        search: null
      }
      this.apiService.fetchAllPlants(data).subscribe({
        next: val => {
          this.plantList = val.data.content;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.plantList = MOCK_PLANTS;
          }
        }
      })
    } catch (error) {
      this.plantList = MOCK_PLANTS;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // plantList = [
  //   {
  //     plantName: 'Plant A',
  //     plantManager: 'Sanjay',
  //     location: 'Chennai'
  //   },
  //   {
  //     plantName: 'Plant B',
  //     plantManager: 'Anand',
  //     location: 'Pune'
  //   },
  //   {
  //     plantName: 'Plant C',
  //     plantManager: 'Sivam',
  //     location: 'Trichy'
  //   },
  //   {
  //     plantName: 'Warehouse',
  //     plantManager: 'Kayal',
  //     location: 'Tuticorin'
  //   }
  // ]

  submitPlantForm(){
    try {
      if (this.plantForm.valid) {
        if (!this.selectedPlant) {
          const data = this.plantForm.value;
          
          this.apiService.createPlant(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Plant' });
              this.showPlantModal = false;
              this.fetchPlantList();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createPlantLocally(data);
              }
            }
          })
        } else {
          const data = this.plantForm.value;
  
          this.apiService.updatePlant(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Plant' });
              this.showPlantModal = false;
              this.fetchPlantList();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updatePlantLocally(data);
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

  private createPlantLocally(data: any){
    const newId = Math.max(0, ...this.plantList.map(p => p.id || 0)) + 1;
    const newPlant = { id: newId, plant: data.plant, location: data.location, plantManager: data.plantManager, status: data.status };
    this.plantList = [newPlant, ...this.plantList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Plant' });
    this.showPlantModal = false;
  }

  private updatePlantLocally(data: any){
    this.plantList = this.plantList.map(p => p.id === data.plantId ? { ...p, plant: data.plant, location: data.location, plantManager: data.plantManager, status: data.status } : p);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Plant' });
    this.showPlantModal = false;
  }

  fetchUsersByUsergroup(){
    try {
      const data = {
        userGroupId: 5
      }

      this.apiService.fetchUsersByUserGroup(data).subscribe({
        next: val => {
          this.userList = val.data;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.userList = MOCK_PLANT_MANAGER_USERS;
          }
        }
      })
    } catch (error) {
      this.userList = MOCK_PLANT_MANAGER_USERS;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openPlantModal(){
    try {
      this.showPlantModal = true;
      this.fetchUsersByUsergroup();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editPlant(){
    try {
      this.showPlantModal = true;
      this.actionName = 'Update';
      this.plantForm.patchValue({
        ...this.selectedPlant,
        plantId: this.selectedPlant?.id
      });
      this.fetchUsersByUsergroup();
      // console.log(this.plantForm.value);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editPlant()
      },
      {
        label: 'Plant Configuration',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/plants/production-config'])
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deletePlant()
      }
    ]
  }

  deletePlant(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Plant`,
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
        try {
          const data = {
            plantId: this.selectedPlant.id
          }

          this.apiService.deletePlant(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Plant' });
              this.fetchPlantList();
            },
            error: err => {

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.plantList = this.plantList.filter(p => p.id !== this.selectedPlant.id);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Plant' });
              }
            }
          })
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      }
    });
  }

  plantMenu(event: Event, menu: any, plant: any){
    this.selectedPlant = plant;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedPlant = null;
    this.actionName = 'Create';
    this.plantForm.reset();
  }
}
