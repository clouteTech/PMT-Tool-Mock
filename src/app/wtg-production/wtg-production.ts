import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule }    from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule }  from 'primeng/textarea';
import { SelectModule }    from 'primeng/select';
import { DatePickerModule }from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { TableModule }     from 'primeng/table';
import { ToastModule }     from 'primeng/toast';
import { CardModule }      from 'primeng/card';
import { MenuItem, MessageService }  from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield'; 
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FluidModule } from 'primeng/fluid';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MenuModule } from 'primeng/menu';
import { StepperModule } from 'primeng/stepper';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Shared } from '../shared/services/shared';
import { Router } from '@angular/router';

// P-Code -> Customer lookup, matching the customer/project data used in Project Creation.
// Traces every production row back to Customer -> P-Code -> Component per the agreed spec.
const P_CODE_CUSTOMER_MAP: Record<string, string> = {
  'P-8001': 'ReNew Power',
  'P-8002': 'Adani Green Energy',
  'P-8003': 'Suzlon Energy',
  'P-8004': 'Greenko',
  'P-8005': 'Tata Power Renewable',
  'P-8006': 'JSW Energy',
  'P-8007': 'ReNew Power',
  'P-8008': 'Suzlon Energy',
  'P-8009': 'Adani Green Energy',
  'P-8010': 'Greenko',
};

@Component({
  selector: 'app-wtgproduction',
  imports: [CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    SelectModule, DatePickerModule,
    AccordionModule, TableModule,
    ToastModule, CardModule,IconFieldModule,TagModule,InputIconModule,DialogModule,ConfirmDialogModule,
    FluidModule,ReactiveFormsModule,MultiSelectModule,CheckboxModule,MenuModule,StepperModule,FloatLabelModule,
    Shared
  ],
  providers: [MessageService],
  templateUrl: './wtg-production.html',
  styleUrl: './wtg-production.css',
})
export class WTGProduction {
  showProductionModal = false;
  chooseUploadTemplate = false;
  chooseDownloadTemplate = false;
  showBladeAllocationModal = false;

  selectedProduction: any;

  items: MenuItem[] = [];

  private router = inject(Router);
  private fb = inject(FormBuilder);

  bladeAllocationForm = this.fb.group({
    customerName: [''],
    pCode: ['']
  });
  
  constructor(private sanitizer: DomSanitizer, private messageService: MessageService){}

 wtgProductionList: any[] = [
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-01",
      proActualStart: "2026-03-01",
      proForecastStart: "2026-03-01",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-02",
      proActualFinish: "2026-03-02",
      proForecastFinish: "2026-03-02",
      proFinishDelayReason: "No Delay",
      serialNo: "B-001",
      finalQC: "2026-03-05",
      status: "DONE"
    },
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-01",
      proActualStart: "2026-03-01",
      proForecastStart: "2026-03-01",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-02",
      proActualFinish: "2026-03-02",
      proForecastFinish: "2026-03-02",
      proFinishDelayReason: "No Delay",
      serialNo: "B-002",
      finalQC: "2026-03-05",
      status: "DONE"
    },
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-01",
      proActualStart: "2026-03-01",
      proForecastStart: "2026-03-01",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-02",
      proActualFinish: "2026-03-02",
      proForecastFinish: "2026-03-02",
      proFinishDelayReason: "No Delay",
      serialNo: "B-003",
      finalQC: "2026-03-08",
      status: "DONE"
    },
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-03",
      proActualStart: "2026-03-03",
      proForecastStart: "2026-03-03",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-04",
      proActualFinish: "2026-03-04",
      proForecastFinish: "2026-03-04",
      proFinishDelayReason: "No Delay",
      serialNo: "B-004",
      finalQC: "2026-03-09",
      status: "DONE"
    },
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-03",
      proActualStart: "2026-03-03",
      proForecastStart: "2026-03-03",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-04",
      proActualFinish: "2026-03-04",
      proForecastFinish: "2026-03-04",
      proFinishDelayReason: "No Delay",
      serialNo: "B-005",
      finalQC: "2026-03-10",
      status: "DONE"
    },
    {
      pCode: "P-8006",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-03",
      proActualStart: "2026-03-03",
      proForecastStart: "2026-03-03",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-04",
      proActualFinish: "2026-03-04",
      proForecastFinish: "2026-03-04",
      proFinishDelayReason: "No Delay",
      serialNo: "B-006",
      finalQC: "2026-03-07",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8007",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-05",
      proActualStart: "2026-03-05",
      proForecastStart: "2026-03-05",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-06",
      proActualFinish: "2026-03-06",
      proForecastFinish: "2026-03-06",
      proFinishDelayReason: "No Delay",
      serialNo: "B-007",
      finalQC: "2026-03-09",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8008",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-05",
      proActualStart: "2026-03-05",
      proForecastStart: "2026-03-05",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-06",
      proActualFinish: "2026-03-06",
      proForecastFinish: "2026-03-06",
      proFinishDelayReason: "No Delay",
      serialNo: "B-008",
      finalQC: "2026-03-09",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8009",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-05",
      proActualStart: "2026-03-05",
      proForecastStart: "2026-03-05",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-06",
      proActualFinish: "2026-03-06",
      proForecastFinish: "2026-03-06",
      proFinishDelayReason: "No Delay",
      serialNo: "B-009",
      finalQC: "2026-03-09",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8010",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-07",
      proActualStart: "2026-03-07",
      proForecastStart: "2026-03-07",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-08",
      proActualFinish: "2026-03-08",
      proForecastFinish: "2026-03-08",
      proFinishDelayReason: "No Delay",
      serialNo: "B-021",
      finalQC: "2026-03-11",
      status: "PLANNED"
    },
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-07",
      proActualStart: "2026-03-07",
      proForecastStart: "2026-03-07",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-08",
      proActualFinish: "2026-03-08",
      proForecastFinish: "2026-03-08",
      proFinishDelayReason: "No Delay",
      serialNo: "B-022",
      finalQC: "2026-03-11",
      status: "PLANNED"
    },
    {
      pCode: "P-8002",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-07",
      proActualStart: "2026-03-07",
      proForecastStart: "2026-03-07",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-08",
      proActualFinish: "2026-03-08",
      proForecastFinish: "2026-03-08",
      proFinishDelayReason: "No Delay",
      serialNo: "B-023",
      finalQC: "2026-03-11",
      status: "PLANNED"
    },
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-01",
      proActualStart: "2026-03-01",
      proForecastStart: "2026-03-01",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-02",
      proActualFinish: "2026-03-02",
      proForecastFinish: "2026-03-02",
      proFinishDelayReason: "No Delay",
      serialNo: "B-013",
      finalQC: "2026-03-12",
      status: "DONE"
    },
    {
      pCode: "P-8009",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-01",
      proActualStart: "2026-03-01",
      proForecastStart: "2026-03-01",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-02",
      proActualFinish: "2026-03-02",
      proForecastFinish: "2026-03-02",
      proFinishDelayReason: "No Delay",
      serialNo: "B-014",
      finalQC: "2026-03-14",
      status: "DONE"
    },
    {
      pCode: "P-8010",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-01",
      proActualStart: "2026-03-01",
      proForecastStart: "2026-03-01",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-02",
      proActualFinish: "2026-03-02",
      proForecastFinish: "2026-03-02",
      proFinishDelayReason: "No Delay",
      serialNo: "B-015",
      finalQC: "2026-03-15",
      status: "DONE"
    },
    {
      pCode: "P-8006",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-03",
      proActualStart: "2026-03-03",
      proForecastStart: "2026-03-03",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-04",
      proActualFinish: "2026-03-04",
      proForecastFinish: "2026-03-04",
      proFinishDelayReason: "No Delay",
      serialNo: "B-016",
      finalQC: "2026-03-07",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8007",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-03",
      proActualStart: "2026-03-03",
      proForecastStart: "2026-03-03",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-04",
      proActualFinish: "2026-03-04",
      proForecastFinish: "2026-03-04",
      proFinishDelayReason: "No Delay",
      serialNo: "B-017",
      finalQC: "2026-03-07",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8008",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-03",
      proActualStart: "2026-03-03",
      proForecastStart: "2026-03-03",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-04",
      proActualFinish: "2026-03-04",
      proForecastFinish: "2026-03-04",
      proFinishDelayReason: "No Delay",
      serialNo: "B-018",
      finalQC: "2026-03-07",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8009",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-05",
      proActualStart: "2026-03-05",
      proForecastStart: "2026-03-05",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-06",
      proActualFinish: "2026-03-06",
      proForecastFinish: "2026-03-06",
      proFinishDelayReason: "No Delay",
      serialNo: "B-019",
      finalQC: "2026-03-09",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8010",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-05",
      proActualStart: "2026-03-05",
      proForecastStart: "2026-03-05",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-06",
      proActualFinish: "2026-03-06",
      proForecastFinish: "2026-03-06",
      proFinishDelayReason: "No Delay",
      serialNo: "B-020",
      finalQC: "2026-03-09",
      status: "IN_PROGRESS"
    },
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-05",
      proActualStart: "2026-03-05",
      proForecastStart: "2026-03-05",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-06",
      proActualFinish: "2026-03-06",
      proForecastFinish: "2026-03-06",
      proFinishDelayReason: "No Delay",
      serialNo: "B-024",
      finalQC: "2026-03-09",
      status: "PLANNED"
    },
    {
      pCode: "P-8002",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-07",
      proActualStart: "2026-03-07",
      proForecastStart: "2026-03-07",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-08",
      proActualFinish: "2026-03-08",
      proForecastFinish: "2026-03-08",
      proFinishDelayReason: "No Delay",
      serialNo: "B-025",
      finalQC: "2026-03-11",
      status: "PLANNED"
    },
    {
      pCode: "P-8003",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-07",
      proActualStart: "2026-03-07",
      proForecastStart: "2026-03-07",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-08",
      proActualFinish: "2026-03-08",
      proForecastFinish: "2026-03-08",
      proFinishDelayReason: "No Delay",
      serialNo: "B-026",
      finalQC: "2026-03-11",
      status: "PLANNED"
    },
    {
      pCode: "P-8004",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-07",
      proActualStart: "2026-03-07",
      proForecastStart: "2026-03-07",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-08",
      proActualFinish: "2026-03-08",
      proForecastFinish: "2026-03-08",
      proFinishDelayReason: "No Delay",
      serialNo: "B-027",
      finalQC: "2026-03-11",
      status: "PLANNED"
    },
    {
      pCode: "P-8005",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-09",
      proActualStart: "2026-03-09",
      proForecastStart: "2026-03-09",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-10",
      proActualFinish: "2026-03-10",
      proForecastFinish: "2026-03-10",
      proFinishDelayReason: "No Delay",
      serialNo: "B-028",
      finalQC: "2026-03-13",
      status: "PLANNED"
    },
    {
      pCode: "P-8006",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-09",
      proActualStart: "2026-03-09",
      proForecastStart: "2026-03-09",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-10",
      proActualFinish: "2026-03-10",
      proForecastFinish: "2026-03-10",
      proFinishDelayReason: "No Delay",
      serialNo: "B-029",
      finalQC: "2026-03-13",
      status: "PLANNED"
    },
    {
      pCode: "P-8007",
      component: "Blade",
      subComponent: "Root Section",
      proPlanStart: "2026-03-09",
      proActualStart: "2026-03-09",
      proForecastStart: "2026-03-09",
      proStartDelayReason: "No Delay",
      proPlanFinish: "2026-03-10",
      proActualFinish: "2026-03-10",
      proForecastFinish: "2026-03-10",
      proFinishDelayReason: "No Delay",
      serialNo: "B-030",
      finalQC: "2026-03-13",
      status: "PLANNED"
    },
  ];

  ngOnInit(): void {
    this.items = this.getMenuItems();

    // Trace every row back to its Customer, matching the agreed
    // Customer -> P-Code -> Component hierarchy.
    this.wtgProductionList = this.wtgProductionList.map(row => ({
      ...row,
      customerName: P_CODE_CUSTOMER_MAP[row.pCode] || '-'
    }));
  }

  downloadTemplate(){
    try {
      this.messageService.add({
        severity: 'info',
        summary: 'Coming Soon',
        detail: 'Production template download will be available soon.'
      });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  uploadTemplate(){
    try {
        this.messageService.add({
          severity: 'info',
          summary: 'Coming Soon',
          detail: 'Production template upload will be available soon.'
        });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  exportProduction(){
    try {
      this.chooseDownloadTemplate = true;      
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openImportDialog(){
    try {
      this.chooseUploadTemplate = true;      
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }


  // ── Blade Allocation: scoped to warehouse Blade stock for a given Customer/P-Code ──

  get customerOptions(){
    const names = Array.from(new Set(this.wtgProductionList.map(r => r.customerName).filter(Boolean)));
    return names.map(n => ({ label: n, value: n }));
  }

  get pCodeOptionsForSelectedCustomer(){
    const customerName = this.bladeAllocationForm.get('customerName')?.value;
    if (!customerName) return [];

    const codes = Array.from(new Set(
      this.wtgProductionList
        .filter(r => r.customerName === customerName && r.component === 'Blade')
        .map(r => r.pCode)
    ));
    return codes.map(c => ({ label: c, value: c }));
  }

  onBladeAllocationCustomerChange(){
    this.bladeAllocationForm.get('pCode')?.setValue('');
  }

  openBladeAllocation(){
    this.bladeAllocationForm.reset({ customerName: '', pCode: '' });
    this.showBladeAllocationModal = true;
  }

  proceedBladeAllocation(){
    const customerName = this.bladeAllocationForm.get('customerName')?.value;
    const pCode = this.bladeAllocationForm.get('pCode')?.value;

    if (!customerName || !pCode) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Selection', detail: 'Please select both Customer and P-Code.' });
      return;
    }

    const bladeComponents = this.wtgProductionList
      .filter(r => r.pCode === pCode && r.component === 'Blade')
      .map(r => ({ componentName: r.component, serialNo: r.serialNo, pCode: r.pCode, customerName: r.customerName }));

    if (!bladeComponents.length) {
      this.messageService.add({ severity: 'warn', summary: 'No Blade Stock', detail: `No Blade components found for ${pCode}.` });
      return;
    }

    this.showBladeAllocationModal = false;
    this.router.navigate(['/plantAllocation'], { state: { components: bladeComponents } });
  }

  getMenuItems(){
    return [
      {
        label: 'Edit Production Details',
        icon: 'pi pi-pencil',
        command: () => this.openProductionDetails()
      },
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command: () => this.openImportDialog()
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: () => this.exportProduction()
      }
    ]
  }

  getSafeSvg(svg: string): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  } 

  openProductionDetails(){
    try {
      this.showProductionModal = true;
    } catch (error) {
    }
  }

  openMenu(menu: any, event: any, selectedProd: any){
    this.selectedProduction = selectedProd;
    this.items = this.getMenuItems();
    menu.toggle(event);
  }
}