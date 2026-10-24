import { Component, OnInit } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { MenuItem, MessageService } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// P-Code -> Customer lookup, matching the customer/project data used in Project Creation.
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

interface QualitySummaryRow {
  pCode: string;
  customerName: string;
  nacelleCount: number;
  hubCount: number;
  bladeCount: number;
  inspectionCompletedCount: number;
  mdccCompletedCount: number;
}

@Component({
  selector: 'app-wtg-quality',
  imports: [Shared],
  providers: [MessageService],
  templateUrl: './wtg-quality.html',
  styleUrl: './wtg-quality.css',
})
export class WtgQuality implements OnInit {
  showQualDetailsModal = false;
  showSummaryView = false;

  chooseDownloadTemplate = false;
  chooseUploadTemplate = false;

  items: MenuItem[] = [];
  selectedQuality: any = {};

  summaryRows: QualitySummaryRow[] = [];

  constructor(private sanitizer: DomSanitizer, private messageService: MessageService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();

    // Trace every row back to its Customer and give it a serial number,
    // matching the earlier version's per-component serial traceability.
    this.qualityList = this.qualityList.map((row, i) => ({
      ...row,
      customerName: P_CODE_CUSTOMER_MAP[row.pCode] || '-',
      serialNo: row.serialNo || `${row.component?.[0] || 'C'}-${String(i + 1).padStart(3, '0')}`
    }));

    this.buildSummary();
  }

  qualityList: any[] = [
    {
      pCode: "P-8001",
      component: "Nacelle",
      subComponent: "Root Section",
      serialNo: "N-001",
      inspectionCallPlan: "2026-04-05",
      customerInspectionActual: "2026-04-06",
      customerInprogressInspection: "2026-04-04",
      mdccPlan: "2026-04-08",
      mdccActual: "2026-04-09"
    },
    {
      pCode: "P-8002",
      component: "Hub",
      subComponent: "Root Section",
      serialNo: "H-002",
      inspectionCallPlan: "2026-04-06",
      customerInspectionActual: "2026-04-07",
      customerInprogressInspection: "2026-04-05",
      mdccPlan: "2026-04-09",
      mdccActual: "2026-04-10"
    },
    {
      pCode: "P-8003",
      component: "Blade",
      subComponent: "Root Section",
      serialNo: "B-003",
      inspectionCallPlan: "2026-04-07",
      customerInspectionActual: "2026-04-08",
      customerInprogressInspection: "2026-04-06",
      mdccPlan: "2026-04-10",
      mdccActual: "2026-04-11"
    },
    {
      pCode: "P-8004",
      component: "Tower",
      subComponent: "Root Section",
      serialNo: "T-004",
      inspectionCallPlan: "2026-04-08",
      customerInspectionActual: "2026-04-09",
      customerInprogressInspection: "2026-04-07",
      mdccPlan: "2026-04-11",
      mdccActual: "2026-04-12"
    },
    {
      pCode: "P-8005",
      component: "Converter Panel",
      subComponent: "Root Section",
      serialNo: "CP-005",
      inspectionCallPlan: "2026-04-09",
      customerInspectionActual: "2026-04-10",
      customerInprogressInspection: "2026-04-08",
      mdccPlan: "2026-04-12",
      mdccActual: "2026-04-13"
    },
    {
      pCode: "P-8006",
      component: "Nacelle",
      subComponent: "Root Section",
      serialNo: "N-006",
      inspectionCallPlan: "2026-04-10",
      customerInspectionActual: "2026-04-11",
      customerInprogressInspection: "2026-04-09",
      mdccPlan: "2026-04-13",
      mdccActual: "2026-04-14"
    },
    {
      pCode: "P-8007",
      component: "Hub",
      subComponent: "Root Section",
      serialNo: "H-007",
      inspectionCallPlan: "2026-04-11",
      customerInspectionActual: "2026-04-12",
      customerInprogressInspection: "2026-04-10",
      mdccPlan: "2026-04-14",
      mdccActual: "2026-04-15"
    },
    {
      pCode: "P-8008",
      component: "Blade",
      subComponent: "Root Section",
      serialNo: "B-008",
      inspectionCallPlan: "2026-04-12",
      customerInspectionActual: "2026-04-13",
      customerInprogressInspection: "2026-04-11",
      mdccPlan: "2026-04-15",
      mdccActual: "2026-04-16"
    },
    {
      pCode: "P-8009",
      component: "Tower",
      subComponent: "Root Section",
      serialNo: "T-009",
      inspectionCallPlan: "2026-04-13",
      customerInspectionActual: "2026-04-14",
      customerInprogressInspection: "2026-04-12",
      mdccPlan: "2026-04-16",
      mdccActual: "2026-04-17"
    },
    {
      pCode: "P-8010",
      component: "Converter Panel",
      subComponent: "Root Section",
      serialNo: "CP-010",
      inspectionCallPlan: "2026-04-14",
      customerInspectionActual: "2026-04-15",
      customerInprogressInspection: "2026-04-13",
      mdccPlan: "2026-04-17",
      mdccActual: "2026-04-18"
    },
  ]

  buildSummary(){
    const map = new Map<string, QualitySummaryRow>();

    for (const row of this.qualityList){
      const key = row.pCode;
      let summary = map.get(key);
      if (!summary){
        summary = {
          pCode: row.pCode,
          customerName: row.customerName,
          nacelleCount: 0,
          hubCount: 0,
          bladeCount: 0,
          inspectionCompletedCount: 0,
          mdccCompletedCount: 0
        };
        map.set(key, summary);
      }

      if (row.component === 'Nacelle') summary.nacelleCount++;
      if (row.component === 'Hub') summary.hubCount++;
      if (row.component === 'Blade') summary.bladeCount++;
      if (row.customerInspectionActual) summary.inspectionCompletedCount++;
      if (row.mdccActual) summary.mdccCompletedCount++;
    }

    this.summaryRows = Array.from(map.values());
  }

  toggleSummaryView(){
    this.showSummaryView = !this.showSummaryView;
  }

  openQualityDetails(){
    try {
      this.showQualDetailsModal = true;
    } catch (error) {
    }
  }

  exportQuality(){
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

  downloadTemplate(){
    try {
      this.messageService.add({
        severity: 'info',
        summary: 'Coming Soon',
        detail: 'Quality template download will be available soon.'
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
          detail: 'Quality template upload will be available soon.'
        });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitQualityDetails(){
    if (!this.selectedQuality?.pCode) return;

    this.showQualDetailsModal = false;
    this.buildSummary();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quality details updated.' });
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.openQualityDetails()
      },
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command: () => this.openImportDialog()
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: () => this.exportQuality()
      }
    ]
  }

  getSafeSvg(svg: string): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  qualityMenu(event: Event, menu: any, quality: any){
    this.selectedQuality = quality;
    menu.toggle(event);
  }
}
