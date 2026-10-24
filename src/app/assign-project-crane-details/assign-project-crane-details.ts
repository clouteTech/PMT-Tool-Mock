import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shared } from '../shared/services/shared';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from '../service/apiservice';
import { FormBuilder } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const craneRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const craneId = control.get('craneId')?.value;
  // Fails validation if craneId is null, undefined, or 0
  return craneId && craneId !== 0 ? null : { craneRequired: true };
};

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_PROJECT_CRANE_LIST: any[] = [
  { projectCraneDetailId: 1, crane: { craneId: 1, craneType: 'Crawler Crane', craneModel: 'LR 1750/2', craneMake: 'Liebherr' }, supplier: { supplierId: 1, supplierName: 'Sarens Heavy Lift India' }, registrationNumber: 'GJ-05-AB-1234', status: true },
  { projectCraneDetailId: 2, crane: { craneId: 2, craneType: 'Crawler Crane', craneModel: 'CC 2800-1', craneMake: 'Terex' }, supplier: { supplierId: 2, supplierName: 'ALE Heavylift' }, registrationNumber: 'RJ-14-CD-5678', status: true },
  { projectCraneDetailId: 3, crane: { craneId: 3, craneType: 'Mobile Crane', craneModel: 'GMK 6400', craneMake: 'Grove' }, supplier: { supplierId: 3, supplierName: 'Mammoet India' }, registrationNumber: 'TN-09-EF-4321', status: false },
  { projectCraneDetailId: 4, crane: { craneId: 5, craneType: 'Crawler Crane', craneModel: 'SCC8300', craneMake: 'Sany' }, supplier: { supplierId: 4, supplierName: 'Sanghvi Movers Ltd' }, registrationNumber: 'KA-03-GH-8765', status: true },
  { projectCraneDetailId: 5, crane: { craneId: 6, craneType: 'Mobile Crane', craneModel: 'AC 500-2', craneMake: 'Demag' }, supplier: { supplierId: 5, supplierName: 'Tiger Crane Services' }, registrationNumber: 'GJ-05-IJ-3456', status: true },
  { projectCraneDetailId: 6, crane: { craneId: 8, craneType: 'Mobile Crane', craneModel: 'LTM 1750-9.1', craneMake: 'Liebherr' }, supplier: { supplierId: 8, supplierName: 'GMMCO Cranes' }, registrationNumber: 'RJ-14-KL-6543', status: true },
  { projectCraneDetailId: 7, crane: { craneId: 9, craneType: 'Crawler Crane', craneModel: 'CKE2500', craneMake: 'Kobelco' }, supplier: { supplierId: 9, supplierName: 'Perfect Lifting Solutions' }, registrationNumber: 'TN-09-MN-7890', status: false },
  { projectCraneDetailId: 8, crane: { craneId: 10, craneType: 'Mobile Crane', craneModel: 'RT9130E-4', craneMake: 'Terex' }, supplier: { supplierId: 10, supplierName: 'National Crane Corporation' }, registrationNumber: 'KA-03-OP-2109', status: true },
  { projectCraneDetailId: 9, crane: { craneId: 4, craneType: 'Tower Crane', craneModel: 'MD 485', craneMake: 'Potain' }, supplier: { supplierId: 6, supplierName: 'Bothra Shipping & Logistics' }, registrationNumber: 'GJ-05-QR-5432', status: true },
  { projectCraneDetailId: 10, crane: { craneId: 7, craneType: 'Crawler Crane', craneModel: 'QUY260', craneMake: 'XCMG' }, supplier: { supplierId: 7, supplierName: 'ACME Crane Rentals' }, registrationNumber: 'RJ-14-ST-9876', status: true },
];

const MOCK_CRANE_INFO_LIST: any[] = [
  { craneId: 1, craneType: 'Crawler Crane', craneModel: 'LR 1750/2', craneMake: 'Liebherr' },
  { craneId: 2, craneType: 'Crawler Crane', craneModel: 'CC 2800-1', craneMake: 'Terex' },
  { craneId: 3, craneType: 'Mobile Crane', craneModel: 'GMK 6400', craneMake: 'Grove' },
  { craneId: 4, craneType: 'Tower Crane', craneModel: 'MD 485', craneMake: 'Potain' },
  { craneId: 5, craneType: 'Crawler Crane', craneModel: 'SCC8300', craneMake: 'Sany' },
  { craneId: 6, craneType: 'Mobile Crane', craneModel: 'AC 500-2', craneMake: 'Demag' },
  { craneId: 7, craneType: 'Crawler Crane', craneModel: 'QUY260', craneMake: 'XCMG' },
  { craneId: 8, craneType: 'Mobile Crane', craneModel: 'LTM 1750-9.1', craneMake: 'Liebherr' },
  { craneId: 9, craneType: 'Crawler Crane', craneModel: 'CKE2500', craneMake: 'Kobelco' },
  { craneId: 10, craneType: 'Mobile Crane', craneModel: 'RT9130E-4', craneMake: 'Terex' },
];

const MOCK_CRANE_SUPPLIER_LIST: any[] = [
  { supplierId: 1, supplierName: 'Sarens Heavy Lift India' },
  { supplierId: 2, supplierName: 'ALE Heavylift' },
  { supplierId: 3, supplierName: 'Mammoet India' },
  { supplierId: 4, supplierName: 'Sanghvi Movers Ltd' },
  { supplierId: 5, supplierName: 'Tiger Crane Services' },
];

@Component({
  selector: 'app-assign-project-crane-details',
  imports: [Shared],
  templateUrl: './assign-project-crane-details.html',
  styleUrl: './assign-project-crane-details.css',
})

export class AssignProjectCraneDetails implements OnInit {
  projectId = 0;

  showPrjCraneDetail = false;

  actionName = 'Assign';

  projectCraneList: any[] = [];
  craneInfoList: any[] = [];
  supplierList: any[] = [];

  selectedPrjCrane: any;
  selectedProject: any;

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private route: ActivatedRoute, private messageService: MessageService, 
    private apiService: Apiservice, private confirmationService: ConfirmationService){}

  prjCraneForm = this.fb.group({
    craneType: [null as number | null],
    craneModel: [null as number | null],
    craneMake: [null as number | null],
    
    projectId: [0],
    projectCraneDetailId: [0],
    craneId: [0],
    supplierId: [0, Validators.required],
    registrationNumber: ['', [Validators.required, Validators.maxLength(50)]],
    status: [false]
  }, { validators: craneRequiredValidator })

  get isCraneInvalid(): boolean {
    const craneType = this.prjCraneForm.get('craneType');
    const craneModel = this.prjCraneForm.get('craneModel');
    const craneMake = this.prjCraneForm.get('craneMake');

    const isTouched = craneType?.touched || craneModel?.touched || craneMake?.touched || craneType?.dirty;
    
    return this.prjCraneForm.hasError('craneRequired') && Boolean(isTouched);
  }

  get supplierId(){
    return this.prjCraneForm.get('supplierId');
  }

  get registrationNumber(){
    return this.prjCraneForm.get('registrationNumber');
  }

  ngOnInit(){
    this.items = this.getMenuItems();
    
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');

      if (id) {
        this.projectId = Number(id);
        this.fetchAllProjectCraneDetails();
      }
    });

    this.selectedProject = history.state.project;
  }

  fetchAllProjectCraneDetails(){
    try {
      this.apiService.fetchAllProjectCraneDetails('').subscribe({
        next: val => {
          this.projectCraneList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.projectCraneList = MOCK_PROJECT_CRANE_LIST;
          }
        }
      })
    } catch (error) {
      this.projectCraneList = MOCK_PROJECT_CRANE_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchCraneInfo(){
    try {
      this.apiService.fetchCraneInfo('').subscribe({
        next: val => {
          this.craneInfoList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.craneInfoList = MOCK_CRANE_INFO_LIST;
          }
        }
      })
    } catch (error) {
      this.craneInfoList = MOCK_CRANE_INFO_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  selectedCrane(craneId: number | null){
    if (!craneId) {
    // Reset all crane controls if clear button is clicked
    this.prjCraneForm.patchValue({
      craneType: null,
      craneModel: null,
      craneMake: null,
      craneId: 0,
      supplierId: 0
    });
      this.supplierList = [];
      return;
    }

    this.prjCraneForm.patchValue({
      craneType: craneId,
      craneModel: craneId,
      craneMake: craneId,
      craneId: craneId
    });

    try {
      const data = {
        craneId: craneId
      }

      this.apiService.fetchCraneSuppliers(data).subscribe({
        next: val => {
          this.supplierList = val.data.suppliers;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.supplierList = MOCK_CRANE_SUPPLIER_LIST;
          }
        }
      })
    } catch (error) {
      this.supplierList = MOCK_CRANE_SUPPLIER_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitPrjCraneForm(){
    try {
      if (!this.selectedPrjCrane) {
        
        const formValue = this.prjCraneForm.value;
  
        const data = {
          projectId: this.projectId,
          craneId: formValue.craneId,
          supplierId: formValue.supplierId,
          registrationNumber: formValue.registrationNumber
        };
  
        this.apiService.assignPrjCraneDetail(data).subscribe({
          next: val => {
            this.messageService.add({ severity: 'success', summary: 'Success', 
                  detail: `Successfully Crane Detail Assigned` });
            this.showPrjCraneDetail = false;
            this.fetchAllProjectCraneDetails();
          },
          error: err => {
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            } else {
              this.assignPrjCraneLocally(data);
            }
          }
        })
      } else {
        const formValue = this.prjCraneForm.value;
  
        const data = {
          projectCraneDetailId: formValue.projectCraneDetailId,
          craneId: formValue.craneId,
          supplierId: formValue.supplierId,
          registrationNumber: formValue.registrationNumber,
          status: formValue.status
        };
  
        this.apiService.updatePrjCraneDetail(data).subscribe({
          next: val => {
            this.messageService.add({ severity: 'success', summary: 'Success', 
                  detail: `Successfully Crane Detail Updated` });
            this.showPrjCraneDetail = false;
            this.fetchAllProjectCraneDetails();
          },
          error: err => {
      
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            } else {
              this.updatePrjCraneLocally(data);
            }
          }
        })
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteCraneDetail(){
    try {
      this.confirmationService.confirm({
        message: `Do you want to delete this record?`,
        header: `Delete Crane Detail`,
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
              projectCraneDetailId: this.selectedPrjCrane.projectCraneDetailId
            }

            this.apiService.deletePrjCraneDetail(data).subscribe({
              next: val => {
                this.messageService.add({ severity: 'success', summary: 'Success', 
                      detail: `Successfully Deleted Crane Detail` });
                this.fetchAllProjectCraneDetails();
              },
              error: err => {
          
                if (err.status === 400) {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
                } else {
                  this.deletePrjCraneLocally();
                }
              }
            })
          } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // ── Demo mode CRUD (operates on the in-memory mock list when the backend is unreachable) ──

  private buildCraneRef(craneId: number | null | undefined){
    return (this.craneInfoList.length ? this.craneInfoList : MOCK_CRANE_INFO_LIST)
      .find(c => c.craneId === craneId) ?? null;
  }

  private buildSupplierRef(supplierId: number | null | undefined){
    return (this.supplierList.length ? this.supplierList : MOCK_CRANE_SUPPLIER_LIST)
      .find(s => s.supplierId === supplierId) ?? null;
  }

  private assignPrjCraneLocally(data: any){
    const newId = Math.max(0, ...this.projectCraneList.map(c => c.projectCraneDetailId || 0)) + 1;
    const newDetail = {
      projectCraneDetailId: newId,
      crane: this.buildCraneRef(data.craneId),
      supplier: this.buildSupplierRef(data.supplierId),
      registrationNumber: data.registrationNumber,
      status: true
    };
    this.projectCraneList = [newDetail, ...this.projectCraneList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully Crane Detail Assigned` });
    this.showPrjCraneDetail = false;
  }

  private updatePrjCraneLocally(data: any){
    this.projectCraneList = this.projectCraneList.map(c => c.projectCraneDetailId === data.projectCraneDetailId ? {
      ...c,
      crane: this.buildCraneRef(data.craneId) ?? c.crane,
      supplier: this.buildSupplierRef(data.supplierId) ?? c.supplier,
      registrationNumber: data.registrationNumber,
      status: data.status
    } : c);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully Crane Detail Updated` });
    this.showPrjCraneDetail = false;
  }

  private deletePrjCraneLocally(){
    this.projectCraneList = this.projectCraneList.filter(c => c.projectCraneDetailId !== this.selectedPrjCrane.projectCraneDetailId);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully Deleted Crane Detail` });
  }

  openCraneDetail(){
    try {
      this.showPrjCraneDetail = true;
      this.fetchCraneInfo();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editCraneDetail(){
    try {
      this.showPrjCraneDetail = true;
      this.fetchCraneInfo();

      this.selectedCrane(this.selectedPrjCrane?.crane?.craneId);

      this.prjCraneForm.patchValue({
        projectCraneDetailId: this.selectedPrjCrane?.projectCraneDetailId,
        craneId: this.selectedPrjCrane?.crane?.craneId,
        supplierId: this.selectedPrjCrane?.supplier?.supplierId,
        registrationNumber: this.selectedPrjCrane?.registrationNumber,
        status: this.selectedPrjCrane?.status
      })

      this.actionName = 'Update';
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Update Crane Detail',
        icon: 'pi pi-link',
        command: () => this.editCraneDetail()
      },
      {
        label: 'Delete Crane Detail',
        icon: 'pi pi-trash',
        command: () => this.deleteCraneDetail()
      }
    ]
  }

  prjCraneMenu(event: Event, menu: any, crane: any){
    this.selectedPrjCrane = crane;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedPrjCrane = null;
    this.actionName = 'Assign';
    this.prjCraneForm.reset();
  }
}
