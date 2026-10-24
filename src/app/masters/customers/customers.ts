import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_CUSTOMERS: any[] = [
  { customerId: 1, customerCode: 'CUST001', customerName: 'ReNew Power Pvt Ltd', totalSpvs: 2 },
  { customerId: 2, customerCode: 'CUST002', customerName: 'Adani Green Energy Ltd', totalSpvs: 2 },
  { customerId: 3, customerCode: 'CUST003', customerName: 'Suzlon Energy Ltd', totalSpvs: 3 },
  { customerId: 4, customerCode: 'CUST004', customerName: 'Greenko Energies Pvt Ltd', totalSpvs: 2 },
  { customerId: 5, customerCode: 'CUST005', customerName: 'Tata Power Renewable Energy Ltd', totalSpvs: 2 },
  { customerId: 6, customerCode: 'CUST006', customerName: 'CleanMax Enviro Energy Solutions', totalSpvs: 3 },
  { customerId: 7, customerCode: 'CUST007', customerName: 'Continuum Green Energy Ltd', totalSpvs: 2 },
  { customerId: 8, customerCode: 'CUST008', customerName: 'Hero Future Energies Pvt Ltd', totalSpvs: 3 },
  { customerId: 9, customerCode: 'CUST009', customerName: 'Ayana Renewable Power Pvt Ltd', totalSpvs: 2 },
  { customerId: 10, customerCode: 'CUST010', customerName: 'JSW Energy Ltd', totalSpvs: 2 },
];

@Component({
  selector: 'app-customers',
  imports: [Shared],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {
  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  showCustomerModal = false;

  items: MenuItem[] = [];

  customerList:any;
  selectedCustomer: any;

  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService,private apiService:Apiservice,private messageService: MessageService){}

  editCustomerForm = this.fb.group({
    customerId: [0],
    customerCode: ['', [Validators.required, Validators.maxLength(10)]],
    customerName: ['', [Validators.required, Validators.maxLength(150)]],
    status: [false]
  })

  get customerCode(){
    return this.editCustomerForm.get('customerCode');
  }

  get customerName(){
    return this.editCustomerForm.get('customerName');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems("");
    this.getCustomerList();
  }

  getCustomerList(){
    try{
      let data = {
        "search": null,
        "status": null,
        "page": 0,
        "size": 10,
        "sortBy": "createdOn",
        "sortDirection": "asc"
      }
       this.apiService.customerSearch(data).subscribe({
        next: val => {
          this.customerList = val.data.content;

          this.totalRecords = val.data.totalElements ?? 0;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.customerList = MOCK_CUSTOMERS;
            this.totalRecords = MOCK_CUSTOMERS.length;
          }
        }
      })

    }catch(e){
      this.customerList = MOCK_CUSTOMERS;
      this.totalRecords = MOCK_CUSTOMERS.length;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitCustomerForm(){
    try {
      const data = this.editCustomerForm.value;

      this.apiService.updateCustomer(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Customer' });
          this.showCustomerModal = false;
          this.getCustomerList();
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else if (err.status === 0 || err.status >= 500) {
            this.messageService.add({
              severity: 'error',
              summary: 'Service Unavailable',
              detail: 'Unable to update the customer at the moment. Please try again later.'
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to update the customer. Please try again.'
            });
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editCustomer(){
    try {
      this.showCustomerModal = true;
      this.editCustomerForm.patchValue(this.selectedCustomer);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }
  
  getMenuItems(row: any){
    return [
      {
        label: 'Edit Customer',
        icon: 'pi pi-pencil',
        command: () => this.editCustomer()
      },
      {
        label: 'View Customer SPV Details',
        icon: 'pi pi-eye',
        command: () => this.viewSPV(row)
        
      },
      {
        label: 'Quality Configuration',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/customers/quality-config'])
      },
      {
        label: 'Delete Customer',
        icon: 'pi pi-trash',
        // command: () => this.deletePpaType()
      }
    ]
  }

  viewSPV(val:any){
    try{
    this.router.navigate(['/customers/spv']);
    sessionStorage.setItem("CustomerId",val.customerId)
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  loadCustomer(event: any){
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.getCustomerList();
  }

  customerMenu(event: Event, menu: any, customer: any){
    this.selectedCustomer = customer;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCustomer = null;
    this.editCustomerForm.reset();
  }
}
