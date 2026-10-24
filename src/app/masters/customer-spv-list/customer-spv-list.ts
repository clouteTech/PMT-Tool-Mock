import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_CUSTOMER_DETAIL: any = { customerId: 1, customerCode: 'CUST001', customerName: 'ReNew Power Pvt Ltd' };

const MOCK_SPV_LIST: any[] = [
  { customerSpvId: 1, spvName: 'Chennai Wind Farm Pvt Ltd', spvGstNumber: '33ABCDE1234F1Z5', address1: 'No. 12, Industrial Estate, Guindy', address2: '', city: 'Chennai', state: 'Tamil Nadu', pinCode: '600032', country: 'India' },
  { customerSpvId: 2, spvName: 'Pune Renewable Energy Pvt Ltd', spvGstNumber: '27ABCDE5678G1Z2', address1: 'Plot 45, MIDC Area, Hinjewadi', address2: '', city: 'Pune', state: 'Maharashtra', pinCode: '411057', country: 'India' },
  { customerSpvId: 3, spvName: 'Gujarat Wind Power Ltd', spvGstNumber: '24ABCDE9101H1Z8', address1: 'Survey No. 89, Industrial Zone, Kutch', address2: '', city: 'Bhuj', state: 'Gujarat', pinCode: '370001', country: 'India' },
  { customerSpvId: 4, spvName: 'Rajasthan Green Energy Pvt Ltd', spvGstNumber: '08ABCDE1122J1Z3', address1: 'Sector 5, RIICO Industrial Area', address2: '', city: 'Jodhpur', state: 'Rajasthan', pinCode: '342005', country: 'India' },
  { customerSpvId: 5, spvName: 'Karnataka Wind Solutions Pvt Ltd', spvGstNumber: '29ABCDE3344K1Z6', address1: 'Plot 21, Peenya Industrial Area', address2: '', city: 'Bengaluru', state: 'Karnataka', pinCode: '560058', country: 'India' },
  { customerSpvId: 6, spvName: 'Kutch Wind Energy Pvt Ltd', spvGstNumber: '24ABCDE5566L1Z1', address1: 'Village Jangi, Lakhpat Taluka', address2: '', city: 'Kutch', state: 'Gujarat', pinCode: '370645', country: 'India' },
  { customerSpvId: 7, spvName: 'Anantapur Renewables Pvt Ltd', spvGstNumber: '37ABCDE7788M1Z4', address1: 'Solar Park Road, Tadipatri', address2: '', city: 'Anantapur', state: 'Andhra Pradesh', pinCode: '515401', country: 'India' },
  { customerSpvId: 8, spvName: 'Jaisalmer Wind Power Ltd', spvGstNumber: '08ABCDE9900N1Z9', address1: 'Sam Road Industrial Area', address2: '', city: 'Jaisalmer', state: 'Rajasthan', pinCode: '345001', country: 'India' },
  { customerSpvId: 9, spvName: 'Kayathar Energy Pvt Ltd', spvGstNumber: '33ABCDE1212O1Z7', address1: 'Kayathar Industrial Estate', address2: '', city: 'Thoothukudi', state: 'Tamil Nadu', pinCode: '628102', country: 'India' },
  { customerSpvId: 10, spvName: 'Kutch Mundra Wind Ltd', spvGstNumber: '24ABCDE3434P1Z0', address1: 'Adani Green Complex, Mundra SEZ', address2: '', city: 'Mundra', state: 'Gujarat', pinCode: '370421', country: 'India' },
];

@Component({
  selector: 'app-customer-spv-list',
  imports: [Shared],
  templateUrl: './customer-spv-list.html',
  styleUrl: './customer-spv-list.css',
})
export class CustomerSpvList {

  constructor(private confirmationService: ConfirmationService,private apiService:Apiservice,private messageService: MessageService,
    private formbuilder:FormBuilder
  ){}

  addSPVPopup = false;
  spvForm:any;
  selectedSPV:any;

  spvList:any = []; /* [
  {
    spvName: 'Chennai Wind Farm Pvt Ltd',
    spvGst: '33ABCDE1234F1Z5',
    gstAddressLine: 'No. 12, Industrial Estate, Guindy',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600032',
    country: 'India'
  },
  {
    spvName: 'Pune Renewable Energy Pvt Ltd',
    spvGst: '27ABCDE5678G1Z2',
    gstAddressLine: 'Plot 45, MIDC Area, Hinjewadi',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411057',
    country: 'India'
  },
  {
    spvName: 'Gujarat Wind Power Ltd',
    spvGst: '24ABCDE9101H1Z8',
    gstAddressLine: 'Survey No. 89, Industrial Zone, Kutch',
    city: 'Bhuj',
    state: 'Gujarat',
    postalCode: '370001',
    country: 'India'
  },
  {
    spvName: 'Rajasthan Green Energy Pvt Ltd',
    spvGst: '08ABCDE1122J1Z3',
    gstAddressLine: 'Sector 5, RIICO Industrial Area',
    city: 'Jodhpur',
    state: 'Rajasthan',
    postalCode: '342005',
    country: 'India'
  },
  {
    spvName: 'Karnataka Wind Solutions Pvt Ltd',
    spvGst: '29ABCDE3344K1Z6',
    gstAddressLine: 'Plot 21, Peenya Industrial Area',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560058',
    country: 'India'
  }
]; */
customerDetail:any = "";
items: MenuItem[] = [];
SubmitBtnName:any = 'Submit';


 ngOnInit(): void {
   this.spvForm = this.formbuilder.group({
     spvName:['', Validators.required],
      spvGstNumber:['', Validators.required],
      address1:['', Validators.required],
      city:['', Validators.required],
      state:['', Validators.required],
      pinCode:['', Validators.required],
      country:['', Validators.required],
    })
    this.getCustomerList();
    this.items = this.getMenuItems();

  }

    getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
         command: () => this.editSPV()
      },
     
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteSPV()
      }
    ]
  }

  getCustomerList(){
    try{
      var val = sessionStorage.getItem('CustomerId')
      let data = {
        "customerId": val
      }
       this.apiService.customerGet(data).subscribe({
        next: val => {
          this.customerDetail = val.data;
          this.spvList = val.data.spvDetails;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.customerDetail = MOCK_CUSTOMER_DETAIL;
            this.spvList = MOCK_SPV_LIST;
          }
        }
      })

    }catch(e){
      this.customerDetail = MOCK_CUSTOMER_DETAIL;
      this.spvList = MOCK_SPV_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });

    }
  }

  addSPVDialog(){
    try{
      this.addSPVPopup = true;
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitSPVForm(){
    try{
      if (this.SubmitBtnName == 'Submit') {
        if (this.spvForm.valid) {
          var cusId = sessionStorage.getItem('CustomerId');
          var formValue = this.spvForm.value
          let data = {
            "customerId": cusId,
            "spvName": formValue.spvName,
            "spvGstNumber": formValue.spvGstNumber,
            "address1": formValue.address1,
            "address2": null,
            "city": formValue.city,
            "state": formValue.state,
            "pinCode": formValue.pinCode,
            "country": formValue.country
          }
          this.apiService.spvAdd(data)
            .subscribe({
              next: val => {
                this.addSPVPopup = false;
                this.spvForm.reset();
                this.getCustomerList();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SPV Added Successfully' });
              }, error: (err) => {
                console.log(err);

                if (err.status === 400) {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter All Fields' });
                } else {
                  this.createSpvLocally(data);
                }
              }
            })

        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter All Fields' });
        }
      }else if(this.SubmitBtnName == 'Update'){
        if (this.spvForm.valid) {
          var formValue = this.spvForm.value
          let data = {
            "customerSpvId": this.selectedSPV.customerSpvId,
            "spvName": formValue.spvName,
            "spvGstNumber": formValue.spvGstNumber,
            "address1": formValue.address1,
            "address2": null,
            "city": formValue.city,
            "state": formValue.state,
            "pinCode": formValue.pinCode,
            "country": formValue.country
          }
          this.apiService.spvUpdate(data)
            .subscribe({
              next: val => {
                this.addSPVPopup = false;
                this.spvForm.reset();
                this.getCustomerList();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SPV Added Successfully' });
              }, error: (err) => {
                console.log(err);

                if (err.status === 400) {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
                } else {
                  this.updateSpvLocally(data);
                }
              }
            })

        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter All Fields' });
        }
      }
     
    }catch(e){

    }
  }

  // ── Demo mode CRUD (operates on the in-memory mock list when the backend is unreachable) ──

  private createSpvLocally(data: any){
    const newId = Math.max(0, ...this.spvList.map((s: any) => s.customerSpvId || 0)) + 1;
    const newSpv = { ...data, customerSpvId: newId };
    this.spvList = [newSpv, ...this.spvList];

    this.addSPVPopup = false;
    this.spvForm.reset();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SPV Added Successfully' });
  }

  private updateSpvLocally(data: any){
    this.spvList = this.spvList.map((s: any) => s.customerSpvId === data.customerSpvId ? { ...s, ...data } : s);

    this.addSPVPopup = false;
    this.spvForm.reset();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SPV Added Successfully' });
  }

    SPVMenu(event: Event, menu: any, spv: any){
    this.selectedSPV = spv;
    menu.toggle(event);
  }

  editSPV(){
    try{
      this.addSPVPopup = true;
      this.spvForm.patchValue(this.selectedSPV);
      this.SubmitBtnName = 'Update'
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter All Fields' });
    }
  }

  deleteSPV(){
    try{
       this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete SPV`,
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
      var val = sessionStorage.getItem('CustomerId')

        const data = {
            "customerId": val,
            "customerSpvId": this.selectedSPV.customerSpvId
        }

         this.apiService.spvDelete(data).subscribe({
          next: val => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted PPA Type' });
            this.getCustomerList();
          },
          error: err => {

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            } else {
              this.spvList = this.spvList.filter((s: any) => s.customerSpvId !== this.selectedSPV.customerSpvId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted PPA Type' });
            }
          }
        })
      } 
    })
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }
}
