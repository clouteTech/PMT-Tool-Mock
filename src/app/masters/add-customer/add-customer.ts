import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-add-customer',
  imports: [Shared],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.css',
})
export class AddCustomer {
  spvList: any[] = [];

  private fb = inject(FormBuilder);
  customerCode:any = "";
  customerName:any = "";


  constructor(private confirmationService: ConfirmationService,private apiService:Apiservice,private messageService: MessageService){}

   ngOnInit(): void {
    
  }
  
  spvForm = this.fb.group({
    spvName: [''],
    spvGst: [''],
    gstAddress: [''],
    city: [''],
    state: [''],
    country: [''],
    postalCode: ['']
  })

  addSpv() {
    this.spvList.push(this.spvForm.value);
  }

  removeSpv(index: number) {
    this.spvList.splice(index, 1);
  }

  submitCustomer() {
    try {
      var spvForm = this.spvForm.value;
      let data = {
        "customerCode": this.customerCode,
        "customerName": this.customerName,
        "spvDetails": [
          {
            "customerSpvId": "1",
            "spvName": spvForm.spvName,
            "spvGstNumber": spvForm.spvGst,
            "address1": spvForm.gstAddress,
            "address2": spvForm.gstAddress,
            "city": spvForm.city,
            "state": spvForm.state,
            "pinCode": spvForm.postalCode,
            "country": spvForm.country,
            "status": true
          }

        ]
      }
      this.apiService.createCustomer(data)
        .subscribe({
          next: val => {
            //this.customerDetail = val.data;
            //this.spvList = val.data.spvDetails;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: val.detail });

          },
          error: err => {
            if (err.error.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            } else {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Customer' });
              this.customerCode = '';
              this.customerName = '';
              this.spvList = [];
            }
          }
        })
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }
}
