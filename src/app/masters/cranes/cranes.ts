import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
// assignedSupplierIds drives the Assign/Remove Suppliers modal in demo mode.
const MOCK_CRANES: any[] = [
  { craneId: 1, craneType: 'Crawler Crane', craneModel: 'LR 1750/2', craneMake: 'Liebherr', status: true, assignedSupplierIds: [1, 3] },
  { craneId: 2, craneType: 'Crawler Crane', craneModel: 'CC 2800-1', craneMake: 'Terex', status: true, assignedSupplierIds: [2] },
  { craneId: 3, craneType: 'Mobile Crane', craneModel: 'GMK 6400', craneMake: 'Grove', status: true, assignedSupplierIds: [] },
  { craneId: 4, craneType: 'Tower Crane', craneModel: 'MD 485', craneMake: 'Potain', status: false, assignedSupplierIds: [4] },
  { craneId: 5, craneType: 'Crawler Crane', craneModel: 'SCC8300', craneMake: 'Sany', status: true, assignedSupplierIds: [] },
  { craneId: 6, craneType: 'Mobile Crane', craneModel: 'AC 500-2', craneMake: 'Demag', status: true, assignedSupplierIds: [5, 6] },
  { craneId: 7, craneType: 'Crawler Crane', craneModel: 'QUY260', craneMake: 'XCMG', status: false, assignedSupplierIds: [] },
  { craneId: 8, craneType: 'Mobile Crane', craneModel: 'LTM 1750-9.1', craneMake: 'Liebherr', status: true, assignedSupplierIds: [1] },
  { craneId: 9, craneType: 'Crawler Crane', craneModel: 'CKE2500', craneMake: 'Kobelco', status: true, assignedSupplierIds: [] },
  { craneId: 10, craneType: 'Mobile Crane', craneModel: 'RT9130E-4', craneMake: 'Terex', status: true, assignedSupplierIds: [7, 8] },
];

const MOCK_SUPPLIERS: any[] = [
  { supplierId: 1, supplierName: 'Sarens Heavy Lift India' },
  { supplierId: 2, supplierName: 'ALE Heavylift' },
  { supplierId: 3, supplierName: 'Mammoet India' },
  { supplierId: 4, supplierName: 'Sanghvi Movers Ltd' },
  { supplierId: 5, supplierName: 'Tiger Crane Services' },
  { supplierId: 6, supplierName: 'Bothra Shipping & Logistics' },
  { supplierId: 7, supplierName: 'ACME Crane Rentals' },
  { supplierId: 8, supplierName: 'GMMCO Cranes' },
  { supplierId: 9, supplierName: 'Perfect Lifting Solutions' },
  { supplierId: 10, supplierName: 'National Crane Corporation' },
];

@Component({
  selector: 'app-cranes',
  imports: [Shared],
  templateUrl: './cranes.html',
  styleUrl: './cranes.css',
})
export class Cranes implements OnInit {
  items: MenuItem[] = [];

  craneList: any[] = [];
  supplierList: any[] = [];
  assignedSuppliers: any[] = [];
  supplierSearchQuery = '';
  supplierModalLoading = false;

  actionName = 'Create';

  selectedCrane: any;

  showCraneModal = false;
  showSupplierModal = false;

  private fb = inject(FormBuilder);
  
  constructor(private messageService: MessageService, private apiService: Apiservice,
    private confirmationService: ConfirmationService
  ){}

  craneForm = this.fb.group({
    craneId: [0],
    craneType: ['', [Validators.required, Validators.maxLength(100)]],
    craneModel: ['', [Validators.required, Validators.maxLength(100)]],
    craneMake: ['', [Validators.required, Validators.maxLength(100)]],
    status: [false]
  })

  get craneType(){
    return this.craneForm.get('craneType');
  }

  get craneModel(){
    return this.craneForm.get('craneModel');
  }

  get craneMake(){
    return this.craneForm.get('craneMake');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllCranes();
  }

  fetchAllCranes(){
    try {
      this.apiService.fetchAllCranes('').subscribe({
        next: val => {
          this.craneList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.craneList = MOCK_CRANES;
          }
        }
      })
    } catch (error) {
      this.craneList = MOCK_CRANES;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitCraneForm(){
    try {
      if (this.craneForm.valid) {
        if (!this.selectedCrane) {
          const data = this.craneForm.value;
    
          this.apiService.createCrane(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Crane' });
              this.showCraneModal = false;
              this.fetchAllCranes();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createCraneLocally(data);
              }
            }
          })
        } else {
          const data = this.craneForm.value;
  
          this.apiService.updateCrane(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Crane' });
              this.showCraneModal = false;
              this.fetchAllCranes();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateCraneLocally(data);
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

  private createCraneLocally(data: any){
    const newId = Math.max(0, ...this.craneList.map(c => c.craneId || 0)) + 1;
    const newCrane = { ...data, craneId: newId, assignedSupplierIds: [] };
    this.craneList = [newCrane, ...this.craneList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Crane' });
    this.showCraneModal = false;
  }

  private updateCraneLocally(data: any){
    this.craneList = this.craneList.map(c => c.craneId === data.craneId ? { ...c, ...data } : c);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Crane' });
    this.showCraneModal = false;
  }


  isSupplierAssigned(supplierId: number){
    return this.assignedSuppliers.some(
      supplier => supplier.supplierId === supplierId
    )
  }

  toggleSupplier(supplier: any){
    try {
      if (this.isSupplierAssigned(supplier.supplierId)) {
        this.removeSuppliersFromCrane(supplier);
      } else {
        this.assignSuppliersToCrane(supplier);
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getSupplierMappingInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAssignedSuppliers(){
    const query = this.supplierSearchQuery.trim().toLowerCase();
    return this.supplierList.filter(s =>
      this.isSupplierAssigned(s.supplierId) &&
      (!query || s.supplierName?.toLowerCase().includes(query))
    );
  }

  filteredAvailableSuppliers(){
    const query = this.supplierSearchQuery.trim().toLowerCase();
    return this.supplierList.filter(s =>
      !this.isSupplierAssigned(s.supplierId) &&
      (!query || s.supplierName?.toLowerCase().includes(query))
    );
  }


  assignSuppliersToCrane(supplier: any){
     try {
      const data = {
        craneId: this.selectedCrane.craneId,
        supplierId: supplier.supplierId
      }

      this.apiService.assignSuppliersToCrane(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier Assigned Successfully' });
          this.fetchCraneSuppliers();
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleSupplierLocally(supplier.supplierId, true);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeSuppliersFromCrane(supplier: any){
    try {
      const data = {
        craneId: this.selectedCrane.craneId,
        supplierId: supplier.supplierId
      }

      this.apiService.removeSuppliersFromCrane(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier Removed Successfully' });
          this.fetchCraneSuppliers();
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleSupplierLocally(supplier.supplierId, false);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  private toggleSupplierLocally(supplierId: number, assign: boolean){
    this.craneList = this.craneList.map(c => {
      if (c.craneId !== this.selectedCrane.craneId) return c;
      const ids: number[] = c.assignedSupplierIds ?? [];
      const nextIds = assign
        ? (ids.includes(supplierId) ? ids : [...ids, supplierId])
        : ids.filter(id => id !== supplierId);
      return { ...c, assignedSupplierIds: nextIds };
    });
    this.selectedCrane = this.craneList.find(c => c.craneId === this.selectedCrane.craneId);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: assign ? 'Supplier Assigned Successfully' : 'Supplier Removed Successfully' });
    this.fetchCraneSuppliers();
  }

  fetchCraneSuppliers(){
    try {
      const data = {
        craneId: this.selectedCrane.craneId
      }
      this.apiService.fetchCraneSuppliers(data).subscribe({
        next: val => {
          this.assignedSuppliers = val.data.suppliers;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            const ids: number[] = this.selectedCrane?.assignedSupplierIds ?? [];
            this.assignedSuppliers = MOCK_SUPPLIERS.filter(s => ids.includes(s.supplierId));
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteCrane(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Crane`,
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
            craneId: this.selectedCrane.craneId
          }

          this.apiService.deleteCrane(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Crane' });
              this.fetchAllCranes();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.craneList = this.craneList.filter(c => c.craneId !== this.selectedCrane.craneId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Crane' });
              }
            }
          })
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      }
    });
  }

  fetchSupplierInfo(){
    try {
      this.supplierModalLoading = true;
      this.apiService.fetchSupplierInfo('').subscribe({
        next: val => {
          this.supplierList = val.data;
          this.supplierModalLoading = false;
        },
        error: err => {
          this.supplierModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.supplierList = MOCK_SUPPLIERS;
          }
        }
      })
    } catch (error) {
      this.supplierModalLoading = false;
      this.supplierList = MOCK_SUPPLIERS;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openCraneModal(){
    try {
      this.showCraneModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editCrane(){
    try {
      this.showCraneModal = true;
      this.actionName = 'Update';
      this.craneForm.patchValue(this.selectedCrane);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openSupplierModal(){
    try {
      this.showSupplierModal = true;
      this.supplierSearchQuery = '';
      this.fetchSupplierInfo();
      this.fetchCraneSuppliers();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign/Remove Suppliers',
        icon: 'pi pi-user-plus',
        command: () => this.openSupplierModal()
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCrane()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCrane()
      }
    ]
  }

  craneMenu(event: Event, menu: any, crane: any){
    this.selectedCrane = crane;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCrane = null;
    this.actionName = 'Create';
    this.craneForm.reset();
  }
}
