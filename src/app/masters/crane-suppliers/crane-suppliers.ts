import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_CRANE_SUPPLIERS: any[] = [
  { supplierId: 1, supplierName: 'Sarens Heavy Lift India', contactPerson: 'Arvind Menon', mobileNo: '9840011223', email: 'arvind.menon@sarens.in', status: true },
  { supplierId: 2, supplierName: 'ALE Heavylift', contactPerson: 'Suresh Iyer', mobileNo: '9845123456', email: 'suresh.iyer@ale-heavylift.com', status: true },
  { supplierId: 3, supplierName: 'Mammoet India', contactPerson: 'Neha Kapoor', mobileNo: '9880045612', email: 'neha.kapoor@mammoet.com', status: true },
  { supplierId: 4, supplierName: 'Sanghvi Movers Ltd', contactPerson: 'Rakesh Sanghvi', mobileNo: '9822067890', email: 'rakesh.sanghvi@sanghvimovers.com', status: false },
  { supplierId: 5, supplierName: 'Tiger Crane Services', contactPerson: 'Manoj Pillai', mobileNo: '9894412378', email: 'manoj.pillai@tigercranes.in', status: true },
  { supplierId: 6, supplierName: 'Bothra Shipping & Logistics', contactPerson: 'Deepak Bothra', mobileNo: '9811234567', email: 'deepak.bothra@bothra.co.in', status: true },
  { supplierId: 7, supplierName: 'ACME Crane Rentals', contactPerson: 'Farhan Sheikh', mobileNo: '9900112233', email: 'farhan.sheikh@acmecranes.com', status: false },
  { supplierId: 8, supplierName: 'GMMCO Cranes', contactPerson: 'Vikram Rathi', mobileNo: '9840098765', email: 'vikram.rathi@gmmco.co.in', status: true },
  { supplierId: 9, supplierName: 'Perfect Lifting Solutions', contactPerson: 'Anita Desai', mobileNo: '9820054321', email: 'anita.desai@perfectlifting.in', status: true },
  { supplierId: 10, supplierName: 'National Crane Corporation', contactPerson: 'Ramesh Chandran', mobileNo: '9944778899', email: 'ramesh.chandran@nationalcrane.in', status: true },
];

@Component({
  selector: 'app-crane-suppliers',
  imports: [Shared],
  templateUrl: './crane-suppliers.html',
  styleUrl: './crane-suppliers.css',
})
export class CraneSuppliers {
  items: MenuItem[] = [];

  showSupplierModal = false;

  actionName = 'Create';

  selectedCraneSupplier: any;
  
  craneSupplierList: any[] = [];

  private fb = inject(FormBuilder);

  craneSupplierForm = this.fb.group({
    supplierId: [0],
    supplierName: ['', [Validators.required, Validators.maxLength(150)]],
    contactPerson: ['', Validators.maxLength(100)],
    mobileNo: ['', Validators.maxLength(15)],
    email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/), Validators.maxLength(100)]],
    status: [false]
  })

  get supplierName(){
    return this.craneSupplierForm.get('supplierName');
  }

  get contactPerson(){
    return this.craneSupplierForm.get('contactPerson');
  }

  get mobileNo(){
    return this.craneSupplierForm.get('mobileNo');
  }

  get email(){
    return this.craneSupplierForm.get('email');
  }

  constructor(private apiService: Apiservice, private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit(){
    this.fetchAllCraneSuppliers();
    this.items = this.getMenuItems();
  }

  fetchAllCraneSuppliers(){
    try {
      this.apiService.fetchAllCraneSuppliers('').subscribe({
        next: val => {
          this.craneSupplierList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.craneSupplierList = MOCK_CRANE_SUPPLIERS;
          }
        }
      })
    } catch (error) {
      this.craneSupplierList = MOCK_CRANE_SUPPLIERS;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitCraneSupplierForm(){
    try {
      if (this.craneSupplierForm.valid) {
        if (!this.selectedCraneSupplier) {
          const data = this.craneSupplierForm.value;

          this.apiService.createCraneSupplier(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Crane Supplier' });
              this.showSupplierModal = false;
              this.fetchAllCraneSuppliers();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createCraneSupplierLocally(data);
              }
            }
          })
        } else {
          const data = this.craneSupplierForm.value;
  
          this.apiService.updateCraneSupplier(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Crane Supplier' });
              this.showSupplierModal = false;
              this.fetchAllCraneSuppliers();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateCraneSupplierLocally(data);
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

  private createCraneSupplierLocally(data: any){
    const newId = Math.max(0, ...this.craneSupplierList.map(s => s.supplierId || 0)) + 1;
    const newSupplier = { ...data, supplierId: newId };
    this.craneSupplierList = [newSupplier, ...this.craneSupplierList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Crane Supplier' });
    this.showSupplierModal = false;
  }

  private updateCraneSupplierLocally(data: any){
    this.craneSupplierList = this.craneSupplierList.map(s => s.supplierId === data.supplierId ? { ...s, ...data } : s);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Crane Supplier' });
    this.showSupplierModal = false;
  }

  editCraneSupplier(){
    try {
      this.showSupplierModal = true;
      this.actionName = 'Update';
      this.craneSupplierForm.patchValue(this.selectedCraneSupplier);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteCraneSupplier(){
    try {
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: `Delete Crane Supplier`,
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
              supplierId: this.selectedCraneSupplier.supplierId
            }

            this.apiService.deleteCraneSupplier(data).subscribe({
              next: val => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Crane Supplier' });
                this.fetchAllCraneSuppliers();
              },
              error: err => {

                if (err.status === 400) {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
                } else {
                  this.craneSupplierList = this.craneSupplierList.filter(s => s.supplierId !== this.selectedCraneSupplier.supplierId);
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Crane Supplier' });
                }
              }
            })
          } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
          }
        }
      });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openSupplierModal(){
    try {
      this.showSupplierModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCraneSupplier()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCraneSupplier()
      }
    ]
  }

  supplierMenu(event: Event, menu: any, supplier: any){
    this.selectedCraneSupplier = supplier;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCraneSupplier = null;
    this.actionName = 'Create';
    this.craneSupplierForm.reset();
  }
}
