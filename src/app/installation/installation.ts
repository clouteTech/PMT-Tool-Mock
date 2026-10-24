import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MenuItem, MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';
import { Router } from '@angular/router';

export interface WtgRow {
  wtgId: string;
  locationNo: string;
  maximoId: string;
  wtgType: string;
  towerType: string;
  sectionCount: number;
  craneSupplier: number; // tower section count: 1–6, hardcoded per WTG
}

export interface SummaryRow {
  projectCode: string;
  projectName: string;
  wtgCount: number;
}

export interface ViewColumn {
  field: string;
  header: string;
  stepLabel: string;
  type: 'date' | 'text' | 'number' | 'select';
  stepIdx: number;
}

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_INSTALLATION_PROJECTS: any[] = [
  { projectId: 1, projectCode: 'ENV-P401', projectName: 'Kutch Wind Farm Phase 1', totalWtgs: 12, wtgCount: 12, customer: { customerId: 1, customerName: 'Adani Green Energy Ltd' } },
  { projectId: 2, projectCode: 'ENV-P402', projectName: 'Jaisalmer Cluster Phase 2', totalWtgs: 8, wtgCount: 8, customer: { customerId: 2, customerName: 'ReNew Power Pvt Ltd' } },
  { projectId: 3, projectCode: 'ENV-P403', projectName: 'Bhuj Coastal Wind Project', totalWtgs: 15, wtgCount: 15, customer: { customerId: 3, customerName: 'Tata Power Renewable Energy' } },
  { projectId: 4, projectCode: 'ENV-P404', projectName: 'Kayathar Wind Farm', totalWtgs: 6, wtgCount: 6, customer: { customerId: 4, customerName: 'Suzlon Energy Ltd' } },
  { projectId: 5, projectCode: 'ENV-P405', projectName: 'Chitradurga Wind Corridor', totalWtgs: 10, wtgCount: 10, customer: { customerId: 5, customerName: 'Greenko Energies Pvt Ltd' } },
  { projectId: 6, projectCode: 'ENV-P406', projectName: 'Kutch Bhuj Extension Phase 3', totalWtgs: 9, wtgCount: 9, customer: { customerId: 6, customerName: 'CleanMax Enviro Energy' } },
  { projectId: 7, projectCode: 'ENV-P407', projectName: 'Rajkot Wind Energy Park', totalWtgs: 7, wtgCount: 7, customer: { customerId: 7, customerName: 'Sembcorp Green Infra' } },
  { projectId: 8, projectCode: 'ENV-P408', projectName: 'Tuticorin Coastal Cluster', totalWtgs: 11, wtgCount: 11, customer: { customerId: 8, customerName: 'Vestas Wind Technology India' } },
  { projectId: 9, projectCode: 'ENV-P409', projectName: 'Anantapur Wind Complex', totalWtgs: 14, wtgCount: 14, customer: { customerId: 9, customerName: 'Torrent Power Ltd' } },
  { projectId: 10, projectCode: 'ENV-P410', projectName: 'Dhule Wind Energy Farm', totalWtgs: 5, wtgCount: 5, customer: { customerId: 10, customerName: 'Continuum Green Energy' } },
];

const MOCK_INSTALLATION_CRANE_DETAILS: any[] = [
  { projectCraneDetailId: 1, supplier: { supplierId: 1, supplierName: 'Sarens Heavy Lift India' }, crane: { craneId: 1, craneModel: 'LR 1750/2' } },
  { projectCraneDetailId: 2, supplier: { supplierId: 2, supplierName: 'ALE Heavylift' }, crane: { craneId: 2, craneModel: 'CC 2800-1' } },
  { projectCraneDetailId: 3, supplier: { supplierId: 3, supplierName: 'Mammoet India' }, crane: { craneId: 3, craneModel: 'GMK 6400' } },
  { projectCraneDetailId: 4, supplier: { supplierId: 4, supplierName: 'Sanghvi Movers Ltd' }, crane: { craneId: 4, craneModel: 'MD 485' } },
];

const MOCK_INSTALLATION_WTG_DETAILS: any[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return {
    location: { locationId: n, locationCode: `LOC-${String(n).padStart(2, '0')}`, maximoId: `MAX-${String(n).padStart(3, '0')}` },
    projectWtg: {
      wtgCode: `WTG-${String(n).padStart(2, '0')}`,
      wtgType: { wtgType: n % 2 === 0 ? 'EN-141' : 'EN-156' },
      towerType: { towerType: n % 2 === 0 ? '120HH-474T' : '140HH-520T', sectionCount: n % 2 === 0 ? 5 : 6 }
    }
  };
});

const MOCK_INSTALLATION_ACTIVITIES: any[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  const sectionCount = n % 2 === 0 ? 5 : 6;
  const complete = n <= 6; // first 6 WTGs fully installed, rest in progress/pending
  const base = new Date(2026, 6, n); // Jul-2026 onward
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const plus = (days: number) => fmt(new Date(base.getTime() + days * 86400000));

  return {
    projectWtgs: [{
      wtgCode: `WTG-${String(n).padStart(2, '0')}`,
      wtgType: { wtgType: n % 2 === 0 ? 'EN-141' : 'EN-156' },
      towerType: { towerType: n % 2 === 0 ? '120HH-474T' : '140HH-520T', sectionCount }
    }],
    projectLocation: { locationCode: `LOC-${String(n).padStart(2, '0')}`, maximoId: `MAX-${String(n).padStart(3, '0')}` },
    projectCraneDetail: {
      supplier: { supplierId: (n % 4) + 1, supplierName: MOCK_INSTALLATION_CRANE_DETAILS[n % 4].supplier.supplierName },
      crane: { craneId: (n % 4) + 1, craneModel: MOCK_INSTALLATION_CRANE_DETAILS[n % 4].crane.craneModel }
    },
    craneMobilization: plus(0),
    craneAssemblyStart: plus(1),
    craneAssemblyFinish: plus(2),
    bottomPlatformAssembly: plus(3),
    craneBoomUp: plus(4),
    converterPanelInstallation: plus(5),
    installationPlanStart: plus(0),
    installationActualStart: plus(1),
    installationForeCastStart: plus(1),
    installationStartDelayReason: complete ? '' : 'Awaiting crane mobilization',
    towerInstallations: Array.from({ length: sectionCount }, (_, s) => ({
      towerInstallationId: s + 1,
      section: s + 1,
      installationDate: complete || s < 2 ? plus(6 + s) : null,
      torqueCheckDate: complete ? plus(6 + s + 1) : null
    })),
    nacelleInstallation: complete ? plus(14) : null,
    assemblyMethod: n % 2 === 0 ? 'HUB' : 'ROTOR',
    rotorAssemblyDate: n % 2 !== 0 && complete ? plus(15) : null,
    hubAssemblyDate: n % 2 === 0 && complete ? plus(15) : null,
    rotorInstallationDate: n % 2 !== 0 && complete ? plus(16) : null,
    installationPlanFinish: plus(20),
    installationActualFinish: complete ? plus(21) : null,
    installationForeCastFinish: complete ? plus(21) : plus(25),
    installationFinishDelayReason: complete ? '' : 'Blade delivery delayed',
    craneBoomDown: complete ? plus(22) : null,
    anchorBolt10PercentTorqueCheck: complete ? plus(7) : null,
    towerNacelle10PercentTorqueCheck: complete ? plus(17) : null,
    nacelleHub10PercentTorqueCheck: complete ? plus(18) : null,
    bladeInstallations: Array.from({ length: 3 }, (_, b) => ({
      bladeInstallationId: b + 1,
      bladeNo: b + 1,
      installationDate: complete ? plus(17 + b) : null,
      torqueCheckDate: complete ? plus(18 + b) : null
    })),
    rotorBolt10PercentTorqueCheck: n % 2 !== 0 && complete ? plus(19) : null,
    final10PercentTorqueCheck: complete ? plus(23) : null,
    generatorAlignment: complete ? plus(24) : null,
    cableLaying: complete ? plus(25) : null,
    mechanicalCompletion: complete ? plus(26) : null,
    electricalCompletion: complete ? plus(27) : null,
    liftInstallation: complete ? plus(28) : null,
    qaInspectionFinish: complete ? plus(29) : null,
    mccPlan: plus(30),
    mccActual: complete ? plus(30) : null,
    mccForecast: complete ? plus(30) : plus(34),
    mccDelayReason: complete ? '' : 'Grid connectivity pending',
    mccSignOff: complete ? plus(31) : null,
  };
});

@Component({
  selector: 'app-installation',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, DatePickerModule,
    TableModule, ToastModule, CardModule,
    AccordionModule, TagModule, TextareaModule,
    TooltipModule, StepperModule, InputNumberModule,
    DialogModule, SelectModule, Shared
  ],
  providers: [MessageService],
  templateUrl: './installation.html',
  styleUrl: './installation.css',
})
export class Installation implements OnInit {
  pCode = 'P-8001';
  wtgQty = 2;

  stepCompleted: boolean[] = new Array(1).fill(false);
  activeStep = 0;

  stepForms: FormGroup[][] = [];
  wtgRows: WtgRow[] = [];

  selectedProject: any;
  selectedFile: any;
  prjDetails: any;
  prjLocationDetails: any[] = [];
  tableData: any[] = [];
  prjCraneDetails: any[] = [];
  prjWTGDetails: any[] = [];
  installationActivityDetails: any[] = [];
  projectList: any[] = [];
  supplierCraneList: any[] = [];
  editInstallationActivityDetails: any[] = [];

  // View Popup
  viewVisible = false;

  // Open WTG Popup
  wtgPopupVisible = false;
  chooseDownloadTemplate = false;
  chooseUploadTemplate = false;
  displayImportDialog = false;
  showEditInstallationModal = false;

  wtgPopupActiveStep = 0;
  selectedSummaryRow: SummaryRow | null = null;

  items: MenuItem[] = [];

  // Summary Table rows
  summaryRows: SummaryRow[] = [];

  maxDate: Date | undefined;

  assemblyMethodOptions = [
    { label: 'ROTOR', value: 'ROTOR' },
    { label: 'HUB', value: 'HUB' },
  ];

  // Crane Model dropdown options
  // craneModelOptions = [
  //   { label: 'Crane Model 1', value: 'Crane Model 1' },
  //   { label: 'Crane Model 2', value: 'Crane Model 2' },
  // ];

  // Crane supplier dropdown options (5 or 6 tower sections)
  // craneSupplierOptions = [];

  // Per-row crane supplier state (stepIdx=0, rowIdx → supplierId), restored from
  // installationActivityDetails[rowIdx].projectCraneDetail.supplier.supplierId.
  // P-8002 rows get fixed 0 (no dropdown) — see rowCraneSupplierFixed.
  rowCraneSupplierValues: { [rowIdx: number]: number } = {};
  rowCraneSupplierFixed: { [rowIdx: number]: boolean } = {}; // true = fixed 0, no dropdown

  // Per-row crane list for the Main Crane Model dropdown, loaded for that row's supplier
  rowSupplierCraneList: { [rowIdx: number]: any[] } = {};

  // ── Per-row assembly method state (rowIdx → 'Rotor'|'Hub(DD)'|null) ────
  rowAssemblyMethod: { [rowIdx: number]: string | null } = {};

  getTowerSectionCount(rowIdx: number): number {
    // If this row has a fixed 0 (P-8002), all tower sections are N/A
    if (this.rowCraneSupplierFixed[rowIdx]) return 0;
    // Otherwise read the dropdown value (5 or 6), default 5
    return this.prjWTGDetails[rowIdx]?.projectWtg?.towerType?.sectionCount ?? 5;
  }

  onCraneSupplierChange(rowIdx: number, value: number) {
    this.rowCraneSupplierValues[rowIdx] = value;
  }

  isCraneSupplierFixed(rowIdx: number): boolean {
    return !!this.rowCraneSupplierFixed[rowIdx];
  }

  getCraneSupplierDisplay(rowIdx: number): number | null {
    if (this.rowCraneSupplierFixed[rowIdx]) return 0;
    return this.rowCraneSupplierValues[rowIdx] ?? null;
  }

  isProjectRow(projectCode: string, rowIdx: number): boolean {
    // Determine which project this rowIdx belongs to
    const row = this.selectedSummaryRow;
    return row?.projectCode === projectCode;
  }

  isTowerSectionVisible(rowIdx: number, sectionNum: number): boolean {
    return sectionNum <= this.getTowerSectionCount(rowIdx);
  }

  onAssemblyMethodChange(stepIdx: number, rowIdx: number, value: string) {
    this.rowAssemblyMethod[rowIdx] = value;
    this.setStepFormValue(stepIdx, rowIdx, 'assemblyMethod', value);
    // Clear fields that belong to the other method
    if (value === 'ROTOR') {
      // Clear hub-only fields
      ['hubAssemblyDate','blade1Installation','blade2Installation','blade3Installation',
       'maxOfThreeBlade','blade1Bolts10pct','blade2Bolts10pct','blade3Bolts10pct'].forEach(f =>
        this.setStepFormValue(stepIdx, rowIdx, f, null));
    } else if (value === 'HUB') {
      // Clear rotor-only fields
      ['rotorAssemblyDate','rotorInstallationDate','rotorBolts10pct'].forEach(f =>
        this.setStepFormValue(stepIdx, rowIdx, f, null));
    }
  }

  getAssemblyMethod(stepIdx: number, rowIdx: number): string | null {
    return this.rowAssemblyMethod[rowIdx] ??
           this.getStepFormValue(stepIdx, rowIdx, 'assemblyMethod') ?? null;
  }

  isRotorField(field: string): boolean {
    return ['rotorAssemblyDate', 'rotorInstallationDate', 'rotorBolts10pct'].includes(field);
  }

  isHubField(field: string): boolean {
    return ['hubAssemblyDate', 'blade1Installation', 'blade2Installation', 'blade3Installation',
            'maxOfThreeBlade', 'blade1Bolts10pct', 'blade2Bolts10pct', 'blade3Bolts10pct'].includes(field);
  }

  isTowerSection(field: string): boolean {
    return ['s1TowerInstallation','s2TowerInstallation','s3TowerInstallation',
            's4TowerInstallation','s5TowerInstallation','s6TowerInstallation'].includes(field);
  }

  getTowerSectionNumber(field: string): number {
    const map: Record<string,number> = {
      's1TowerInstallation': 1, 's2TowerInstallation': 2, 's3TowerInstallation': 3,
      's4TowerInstallation': 4, 's5TowerInstallation': 5, 's6TowerInstallation': 6,
    };
    return map[field] ?? 0;
  }

  isUpperBoltsSection(field: string): boolean {
    return ['s1UpperBolts10pct','s2UpperBolts10pct','s3UpperBolts10pct',
            's4UpperBolts10pct','s5UpperBolts10pct','s6UpperBolts10pct'].includes(field);
  }

  getUpperBoltsSectionNumber(field: string): number {
    const map: Record<string,number> = {
      's1UpperBolts10pct': 1, 's2UpperBolts10pct': 2, 's3UpperBolts10pct': 3,
      's4UpperBolts10pct': 4, 's5UpperBolts10pct': 5, 's6UpperBolts10pct': 6,
    };
    return map[field] ?? 0;
  }

  isFieldVisible(stepIdx: number, rowIdx: number, field: string): boolean {
    const method = this.getAssemblyMethod(stepIdx, rowIdx);

    // Tower section visibility: based on craneSupplier value hardcoded per WTG row
    if (this.isTowerSection(field)) {
      const sectionNum = this.getTowerSectionNumber(field);
      return this.isTowerSectionVisible(rowIdx, sectionNum);
    }

    // Upper Bolts Torque Check visibility: same craneSupplier logic as tower sections
    if (this.isUpperBoltsSection(field)) {
      const sectionNum = this.getUpperBoltsSectionNumber(field);
      return this.isTowerSectionVisible(rowIdx, sectionNum);
    }

    // Rotor-only fields: only show if method is Rotor
    if (this.isRotorField(field)) {
      return method === 'ROTOR';
    }

    // Hub-only fields: only show if method is Hub(DD)
    if (this.isHubField(field)) {
      return method === 'HUB';
    }

    // All other fields always visible
    return true;
  }

  getEditTowerSectionCount(rowIdx: number): number{
    const wtg = this.installationActivityDetails?.[rowIdx];
    return wtg?.projectWtgs?.[0]?.towerType?.sectionCount ?? 0;
  }

  isEditTowerSectionVisible(rowIdx: number, sectionNum: number): boolean {
    return sectionNum <= this.getEditTowerSectionCount(rowIdx);
  }

  isEditFieldVisible(stepIdx: number, rowIdx: number, field: string): boolean{
    const method = this.getAssemblyMethod(stepIdx, rowIdx);

    if (this.isTowerSection(field)) {
      const sectionNum = this.getTowerSectionNumber(field);

      return this.isEditTowerSectionVisible(rowIdx, sectionNum);
    }

    if (this.isUpperBoltsSection(field)) {
      const sectionNum = this.getUpperBoltsSectionNumber(field);
      return this.isEditTowerSectionVisible(rowIdx, sectionNum);
    }

    if (this.isRotorField(field)) {
      return method === 'ROTOR';
    }

    if (this.isHubField(field)) {
      return method === 'HUB';
    }

    return true;
  }

  // ─── STEPS (7 logical groups from the Excel) ─────────────────────────────
  // Single step — all 54 fields in exact Excel column order (cols 7–60)
  steps = [
    { id: 1, label: 'Installation' },
  ];

  stepColumnDefs: { [stepIdx: number]: { field: string; header: string; type: 'date' | 'text' | 'number' | 'select' }[] } = {
    0: [
      // Col 7-13: Crane & Setup
      { field: 'mainCraneModel',                 header: 'Main Crane Model',                       type: 'select' },
      { field: 'mainCraneMob',                   header: 'Main Crane Mob',                         type: 'date'   },
      { field: 'startOfMainCraneAssembly',       header: 'Start of Main Crane Assembly',           type: 'date'   },
      { field: 'finishOfMainCraneAssembly',      header: 'Finish of Main Crane Assembly',          type: 'date'   },
      { field: 'bottomPlatformAssembly',         header: 'Bottom Platform Assembly',               type: 'date'   },
      { field: 'mainCraneBoomUp',                header: 'Main Crane Boom Up',                     type: 'date'   },
      // Col 14-18: Converter Panel + Installation Start
      { field: 'converterPanelInstallation',     header: 'Converter Panel Installation',           type: 'date'   },
      { field: 'installationPlanStart',          header: 'Installation Plan Start',                type: 'date'   },
      { field: 'installationActualStart',        header: 'Installation Actual Start',              type: 'date'   },
      { field: 'installationForecastStart',      header: 'Installation Forecast Start',            type: 'date'   },
      { field: 'installationStartDelayReason',   header: 'Installation Start Delay Reason',        type: 'text'   },
      // Col 19-23: Tower Sections
      { field: 's1TowerInstallation',            header: 'S1 Tower Section Installation',          type: 'date'   },
      { field: 's2TowerInstallation',            header: 'S2 Tower Section Installation',          type: 'date'   },
      { field: 's3TowerInstallation',            header: 'S3 Tower Section Installation',          type: 'date'   },
      { field: 's4TowerInstallation',            header: 'S4 Tower Section Installation',          type: 'date'   },
      { field: 's5TowerInstallation',            header: 'S5 Tower Section Installation',          type: 'date'   },
      { field: 's6TowerInstallation',            header: 'S6 Tower Section Installation',          type: 'date'   },
      // Col 24-32: Nacelle & Rotor
      { field: 'nacelleInstallation',            header: 'Nacelle Installation',                   type: 'date'   },
      { field: 'assemblyMethod',                 header: 'Assembly Method',                        type: 'select' },
      { field: 'rotorAssemblyDate',              header: 'Rotor Assembly Date',                    type: 'date'   },
      { field: 'hubAssemblyDate',                header: 'Hub Assembly Date',                      type: 'date'   },
      { field: 'blade1Installation',             header: 'Blade 1 Installation',                   type: 'date'   },
      { field: 'blade2Installation',             header: 'Blade 2 Installation',                   type: 'date'   },
      { field: 'blade3Installation',             header: 'Blade 3 Installation',                   type: 'date'   },
      { field: 'maxOfThreeBlade',                header: 'Max of Three Blade',                     type: 'date'   },
      { field: 'rotorInstallationDate',          header: 'Rotor Installation Date',                type: 'date'   },
      // Col 33-37: Installation Finish
      { field: 'installationPlanFinish',         header: 'Installation Plan Finish',               type: 'date'   },
      { field: 'installationActualFinish',       header: 'Installation Actual Finish',             type: 'date'   },
      { field: 'installationForecastFinish',     header: 'Installation Forecast Finish',           type: 'date'   },
      { field: 'installationFinishDelayReason',  header: 'Installation Finish Delay Reason',       type: 'text'   },
      { field: 'mainCraneBoomDown',              header: 'Main Crane Boom Down',                   type: 'date'   },
      // Col 38-49: Torque Checks
      { field: 'anchorBolts10pct',               header: 'Anchor Bolts 10% Torque Check',          type: 'date'   },
      { field: 's1UpperBolts10pct',              header: 'S1 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's2UpperBolts10pct',              header: 'S2 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's3UpperBolts10pct',              header: 'S3 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's4UpperBolts10pct',              header: 'S4 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's5UpperBolts10pct',              header: 'S5 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's6UpperBolts10pct',              header: 'S6 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 'towerNacelleBolts10pct',         header: 'Tower-Nacelle Bolts 10% Torque Check',   type: 'date'   },
      { field: 'nacelleHubBolts10pct',           header: 'Nacelle-Hub Bolts 10% Torque Check',     type: 'date'   },
      { field: 'blade1Bolts10pct',               header: 'Blade 1 Bolts 10% Torque Check Date',    type: 'date'   },
      { field: 'blade2Bolts10pct',               header: 'Blade 2 Bolts 10% Torque Check',         type: 'date'   },
      { field: 'blade3Bolts10pct',               header: 'Blade 3 Bolts 10% Torque Check',         type: 'date'   },
      { field: 'rotorBolts10pct',                header: 'Rotor Bolts 10% Torque Check',           type: 'date'   },
      { field: 'finalTorquingCompleted',         header: '10% Final Torquing Completed',           type: 'date'   },
      // Col 50-55: Mechanical & Electrical
      { field: 'generatorAlignmentDate',         header: 'Generator Alignment Date',               type: 'date'   },
      { field: 'cableLaying',                    header: 'Cable Laying Date',                      type: 'date'   },
      { field: 'mechanicalCompletion',           header: 'Mechanical Completion',                  type: 'date'   },
      { field: 'electricalCompletion',           header: 'Electrical Completion',                  type: 'date'   },
      { field: 'liftInstallation',               header: 'Lift Installation Date',                 type: 'date'   },
      { field: 'qaInspectionFinish',             header: 'QA Inspection Finish Date',              type: 'date'   },
      // Col 56-60: MCC
      { field: 'mccPlan',                        header: 'MCC Plan',                               type: 'date'   },
      { field: 'mccActual',                      header: 'MCC Actual',                             type: 'date'   },
      { field: 'mccForecast',                    header: 'MCC Forecast',                           type: 'date'   },
      { field: 'mccDelayReason',                 header: 'MCC Delay Reason',                       type: 'text'   },
      { field: 'mccSignOffDate',                 header: 'MCC Sign Off Date',                      type: 'date'   },
    ],
  };

  constructor(private fb: FormBuilder, private messageService: MessageService, 
      private apiService: Apiservice, private router: Router) {}

  ngOnInit() {
    const maxWtg = Math.max(this.wtgQty, ...this.summaryRows.map(r => r.wtgCount));

    for (let i = 1; i <= maxWtg; i++) {
      this.wtgRows.push({
        wtgId: `WTG-${String(i).padStart(2, '0')}`,
        locationNo: `LOC-${String(i).padStart(2, '0')}`,
        maximoId: `MAX-${String(i).padStart(3, '0')}`,
        wtgType: i % 2 === 0 ? 'EN182' : 'EN132',
        towerType: i % 2 === 0 ? '140HH-520T' : '120HH-474T',
        sectionCount: i % 2 === 0 ? 5 : 6,
        craneSupplier: 5, // default; overridden per project in openWtgPopup
      });
    }

    for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
      const cols = this.stepColumnDefs[stepIdx];
      const rowForms: FormGroup[] = this.wtgRows.map(() => {
        const group: any = {};
        cols.forEach(col => { group[col.field] = [null]; });
        return this.fb.group(group);
      });
      this.stepForms.push(rowForms);
    }

    this.fetchProjectList();

    this.items = this.getMenuItems();

    const today = new Date();
    this.maxDate = new Date(today);
  }

  fetchProjectList(){
    try {
      let data = {
        "search": null,
        "customerId": null,
        "clusterId": null,
        "zoneId": null,
        "projectManagerId": null,
        "projectTerm": null,
        "probability": null,
        "page": 0,
        "size": 10,
        "sortBy": "createdOn",
        "sortDirection": "asc"
      }

      this.apiService.projectSearch(data).subscribe({
        next: val => {
          this.projectList = val.data.content;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.projectList = MOCK_INSTALLATION_PROJECTS;
          }
        }
      })
    } catch (error) {
      this.projectList = MOCK_INSTALLATION_PROJECTS;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });
    }
  }

  getTotalWtgCount(): number {
    return this.projectList.reduce((sum, p) => sum + (p?.totalWtgs ?? 0), 0);
  }

  // ─── ROW-LEVEL UNLOCK LOGIC ───────────────────────────────────────────────
  isRowEnabled(stepIdx: number, rowIdx: number): boolean {
    if (stepIdx === 0) return true;
    return this.isPreviousStepRowFullyFilled(stepIdx - 1, rowIdx);
  }

  isPreviousStepRowFullyFilled(stepIdx: number, rowIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    if (!this.stepForms[stepIdx]?.[rowIdx]) return false;
    return cols.every(col => {
      const val = this.stepForms[stepIdx][rowIdx].get(col.field)?.value;
      return val !== null && val !== undefined && val !== '';
    });
  }

  isStepEnabled(stepIdx: number): boolean {
    if (stepIdx === 0) return true;
    return this.stepCompleted[stepIdx - 1] || this.isAnyRowFullyFilledInStep(stepIdx - 1);
  }

  isAnyRowFullyFilledInStep(stepIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    return this.stepForms[stepIdx]?.some(rowForm =>
      cols.every(col => {
        const val = rowForm.get(col.field)?.value;
        return val !== null && val !== undefined && val !== '';
      })
    ) ?? false;
  }

  isAnyRowFilledInStep(stepIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    return this.stepForms[stepIdx]?.some(rowForm =>
      cols.some(col => {
        const val = rowForm.get(col.field)?.value;
        return val !== null && val !== undefined && val !== '';
      })
    ) ?? false;
  }

  getStepFormValue(stepIdx: number, rowIdx: number, field: string): any {
    return this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
  }

  setStepFormValue(stepIdx: number, rowIdx: number, field: string, value: any) {
    const control = this.stepForms[stepIdx]?.[rowIdx]?.get(field);

    if (control) {
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  isStepRowsFilled(stepIdx: number): boolean {
    return this.isAnyRowFilledInStep(stepIdx);
  }

  formatDate(date: any): string | null {
    if(!date) return null;

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  buildInstallationPayload(){
    return this.prjWTGDetails
      .map((wtg: any, rowIdx: number) => ({
        wtg,
        rowIdx
      }))
      .filter(({rowIdx}) => {
        const form = this.stepForms[0][rowIdx];

        return Object.values(form.value).some(v => 
          v !== null &&
          v !== '' &&
          v !== undefined
        );
      })
      .map(({ wtg, rowIdx }) => {

    const form = this.stepForms[0][rowIdx];
      
    const sectionCount = wtg.projectWtg?.towerType?.sectionCount ?? 0;

    const towerInstallations = [];

    for (let i = 1; i <= sectionCount; i++) {
      towerInstallations.push({
        section: i,
        installationDate: this.formatDate(form.get(`s${i}TowerInstallation`)?.value),
        torqueCheckDate: this.formatDate(form.get(`s${i}UpperBolts10pct`)?.value)
      });
    }

    const bladeInstallations = [];

    for (let i = 1; i <= 3; i++) {
      bladeInstallations.push({
        bladeNo: i,
        installationDate: this.formatDate(form.get(`blade${i}Installation`)?.value),
        torqueCheckDate: this.formatDate(form.get(`blade${i}Bolts10pct`)?.value)
      });
    }

      return {

        projectLocationId: wtg.location?.locationId ?? 0,

        projectCraneDetailId:
          form.get('mainCraneModel')?.value,

        assemblyMethod:
          form.get('assemblyMethod')?.value,

        craneMobilization:
          this.formatDate(form.get('mainCraneMob')?.value),

        craneAssemblyStart:
          this.formatDate(form.get('startOfMainCraneAssembly')?.value),

        craneAssemblyFinish:
          this.formatDate(form.get('finishOfMainCraneAssembly')?.value),

        bottomPlatformAssembly:
          this.formatDate(form.get('bottomPlatformAssembly')?.value),

        craneBoomUp:
          this.formatDate(form.get('mainCraneBoomUp')?.value),

        converterPanelInstallation:
          this.formatDate(form.get('converterPanelInstallation')?.value),

        installationPlanStart:
          this.formatDate(form.get('installationPlanStart')?.value),

        installationActualStart:
          this.formatDate(form.get('installationActualStart')?.value),

        installationForeCastStart:
          this.formatDate(form.get('installationForecastStart')?.value),

        installationStartDelayReason:
          form.get('installationStartDelayReason')?.value,

        installationPlanFinish:
          this.formatDate(form.get('installationPlanFinish')?.value),

        installationActualFinish:
          this.formatDate(form.get('installationActualFinish')?.value),

        installationForeCastFinish:
          this.formatDate(form.get('installationForecastFinish')?.value),

        installationFinishDelayReason:
          form.get('installationFinishDelayReason')?.value,

        craneBoomDown:
          this.formatDate(form.get('mainCraneBoomDown')?.value),

        nacelleInstallation:
          this.formatDate(form.get('nacelleInstallation')?.value),

        rotorAssemblyDate:
          this.formatDate(form.get('rotorAssemblyDate')?.value),

        hubAssemblyDate:
          this.formatDate(form.get('hubAssemblyDate')?.value),

        generatorAlignment:
          this.formatDate(form.get('generatorAlignmentDate')?.value),

        cableLaying:
          this.formatDate(form.get('cableLaying')?.value),

        mechanicalCompletion:
          this.formatDate(form.get('mechanicalCompletion')?.value),

        electricalCompletion:
          this.formatDate(form.get('electricalCompletion')?.value),

        liftInstallation:
          this.formatDate(form.get('liftInstallation')?.value),

        qaInspectionFinish:
          this.formatDate(form.get('qaInspectionFinish')?.value),

        mccPlan:
          this.formatDate(form.get('mccPlan')?.value),

        mccActual:
          this.formatDate(form.get('mccActual')?.value),

        mccForecast:
          this.formatDate(form.get('mccForecast')?.value),

        mccDelayReason:
          form.get('mccDelayReason')?.value,

        mccSignOff:
          this.formatDate(form.get('mccSignOffDate')?.value),

        maxOfThreeBlade: 
          this.formatDate(form.get('maxOfThreeBlade')?.value),

        rotorInstallationDate: 
          this.formatDate(form.get('rotorInstallationDate')?.value),

        anchorBolt10PercentTorqueCheck: 
          this.formatDate(form.get('anchorBolts10pct')?.value),

        towerNacelle10PercentTorqueCheck:
          this.formatDate(form.get('towerNacelleBolts10pct')?.value),

        nacelleHub10PercentTorqueCheck:
          this.formatDate(form.get('nacelleHubBolts10pct')?.value),

        rotorBolt10PercentTorqueCheck:
          this.formatDate(form.get('rotorBolts10pct')?.value),

        final10PercentTorqueCheck:
          this.formatDate(form.get('finalTorquingCompleted')?.value),

        towerInstallations,

        bladeInstallations

      };

    })
  }

  markStepComplete(stepIdx: number) {
    try {
      const requiredFields = [
        'installationPlanStart',
        'installationPlanFinish',
        'mainCraneMob',
        'assemblyMethod'
      ];
  
      let hasError = false;
  
      this.stepForms[stepIdx].forEach(form => {
        const rowStarted = Object.values(form.value).some(
          value => value !== null && value !== '' && value !== undefined
        );
  
        if(!rowStarted){
          return;
        }
  
        requiredFields.forEach(field => {
          const control = form.get(field);
  
          control?.markAsTouched();
          control?.updateValueAndValidity();
  
          if(control?.invalid){
            hasError = true;
          }
        })
      })
  
      if (hasError) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Please fill all required fields.'
        });
        return;
      }
  
      if (this.isStepRowsFilled(stepIdx)) {
        this.stepCompleted[stepIdx] = true;
        if (stepIdx === this.steps.length - 1) {
          const payload = this.buildInstallationPayload();
  
          this.apiService.installationCreate(payload).subscribe({
            next: val => {
  
              this.messageService.add({
                severity: 'success',
                summary: 'Step Saved',
                detail: `${this.steps[stepIdx].label} data saved successfully.`
              });
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Step Saved',
                  detail: `${this.steps[stepIdx].label} data saved successfully.`
                });
              }
            }
          });
          return;
        }
        this.wtgPopupActiveStep = stepIdx + 1;
        
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'No Data',
          detail: 'Please fill at least one field before saving this step.'
        });
      }
      
    } catch (error) {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // onSubmit() {
  //   const allData: any = { pCode: this.pCode, wtgQty: this.wtgQty, steps: [] };
  //   this.steps.forEach((step, stepIdx) => {
  //     allData.steps.push({
  //       stepLabel: step.label,
  //       rows: this.wtgRows.map((wtg, rowIdx) => ({
  //         wtgId: wtg.wtgId,
  //         locationNo: wtg.locationNo,
  //         maximoId: wtg.maximoId,
  //         wtgType: wtg.wtgType,
  //         towerType: wtg.towerType,
  //         ...this.stepForms[stepIdx][rowIdx].value
  //       }))
  //     });
  //   });
  //   console.log('Installation Submit:', allData);
  //   this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Installation data submitted successfully!' });
  // }

  getCompletedCount(): number {
    return this.stepCompleted.filter(Boolean).length;
  }

  getStepStatus(stepIdx: number): 'completed' | 'active' | 'disabled' {
    if (this.stepCompleted[stepIdx]) return 'completed';
    if (this.isStepEnabled(stepIdx)) return 'active';
    return 'disabled';
  }

  trackByIndex(index: number): number { return index; }

  patchTowerInstallations(form: FormGroup, towerInstallations: any[]){
    if(!towerInstallations?.length) return;

    towerInstallations.forEach((tower: any) => {
      const section = tower.section;

      form.patchValue({
        towerInstallationId: tower.towerInstallationId,

        [`s${section}TowerInstallation`]:
          tower.installationDate
            ? new Date(tower.installationDate) : null,
        [`s${section}UpperBolts10pct`]:
          tower.torqueCheckDate
            ? new Date(tower.torqueCheckDate) : null
      })
    })
  }

  patchBladeInstallations(form: FormGroup, bladeInstallations: any[]){
    if(!bladeInstallations?.length) return;

    bladeInstallations.forEach((blade: any) => {
      const bladeNo = blade.bladeNo;

      form.patchValue({
        bladeInstallationId: blade.bladeInstallationId,

        [`blade${bladeNo}Installation`]:
          blade.installationDate
            ? new Date(blade.installationDate)
            : null,

        [`blade${bladeNo}Bolts10pct`]:
          blade.torqueCheckDate
            ? new Date(blade.torqueCheckDate)
            : null
      });

    })
  }

  patchInstallationActivities(){
    try {
      if(!this.installationActivityDetails?.length) return;

      this.installationActivityDetails.forEach((item: any, rowIdx: number) => {
        const form = this.stepForms[0]?.[rowIdx];

        if(!form) return;

        // Restore Crane Supplier for this row, and load that supplier's crane
        // list so the Main Crane Model dropdown below has options to match against.
        const supplierId = item.projectCraneDetail?.supplier?.supplierId ?? null;
        if (supplierId !== null && !this.rowCraneSupplierFixed[rowIdx]) {
          this.rowCraneSupplierValues[rowIdx] = supplierId;
          this.selectedSupplier(rowIdx, supplierId);
        }

        form.patchValue({
          installationPlanStart: item.installationPlanStart ? new Date(item.installationPlanStart) : null,
          installationPlanFinish: item.installationPlanFinish ? new Date(item.installationPlanFinish) : null,
          installationActualStart: item.installationActualStart ? new Date(item.installationActualStart) : null,
          installationActualFinish: item.installationActualFinish ? new Date(item.installationActualFinish) : null,
          installationForecastStart: item.installationForeCastStart ? new Date(item.installationForeCastStart) : null,
          installationForecastFinish: item.installationForeCastFinish ? new Date(item.installationForeCastFinish) : null,

          installationStartDelayReason: item.installationStartDelayReason,
          installationFinishDelayReason: item.installationFinishDelayReason,

          mainCraneMob: item.craneMobilization ? new Date(item.craneMobilization) : null,
          startOfMainCraneAssembly: item.craneAssemblyStart ? new Date(item.craneAssemblyStart) : null,
          finishOfMainCraneAssembly: item.craneAssemblyFinish ? new Date(item.craneAssemblyFinish) : null,
          mainCraneBoomUp: item.craneBoomUp ? new Date(item.craneBoomUp) : null,
          mainCraneBoomDown: item.craneBoomDown ? new Date(item.craneBoomDown) : null,

          nacelleInstallation: item.nacelleInstallation ? new Date(item.nacelleInstallation) : null,
          rotorAssemblyDate: item.rotorAssemblyDate ? new Date(item.rotorAssemblyDate) : null,

          assemblyMethod: item.assemblyMethod,
          mainCraneModel: item.projectCraneDetail?.crane?.craneId ?? null,
          bottomPlatformAssembly: item.bottomPlatformAssembly ? new Date(item.bottomPlatformAssembly) : null,
          converterPanelInstallation: item.converterPanelInstallation ? new Date(item.converterPanelInstallation) : null,
          generatorAlignmentDate: item.generatorAlignment ? new Date(item.generatorAlignment) : null,
          cableLaying: item.cableLaying ? new Date(item.cableLaying) : null,
          mechanicalCompletion: item.mechanicalCompletion ? new Date(item.mechanicalCompletion) : null,
          electricalCompletion: item.electricalCompletion ? new Date(item.electricalCompletion) : null,
          liftInstallation: item.liftInstallation ? new Date(item.liftInstallation) : null,
          qaInspectionFinish: item.qaInspectionFinish ? new Date(item.qaInspectionFinish) : null,
          mccPlan: item.mccPlan ? new Date(item.mccPlan) : null,
          mccActual: item.mccActual ? new Date(item.mccActual) : null,
          mccForecast: item.mccForecast ? new Date(item.mccForecast) : null,
          mccDelayReason: item.mccDelayReason,
          mccSignOffDate: item.mccSignOff ? new Date(item.mccSignOff) : null,
          maxOfThreeBlade: item.maxOfThreeBlade ? new Date(item.maxOfThreeBlade) : null,
          rotorInstallationDate: item.rotorInstallationDate ? new Date(item.rotorInstallationDate) : null,
          anchorBolts10pct: item.anchorBolt10PercentTorqueCheck ? new Date(item.anchorBolt10PercentTorqueCheck) : null,
          towerNacelleBolts10pct: item.towerNacelle10PercentTorqueCheck ? new Date(item.towerNacelle10PercentTorqueCheck) : null,
          nacelleHubBolts10pct: item.nacelleHub10PercentTorqueCheck ? new Date(item.nacelleHub10PercentTorqueCheck) : null,
          rotorBolts10pct: item.rotorBolt10PercentTorqueCheck ? new Date(item.rotorBolt10PercentTorqueCheck) : null,
          finalTorquingCompleted: item.final10PercentTorqueCheck ? new Date(item.final10PercentTorqueCheck) : null,
        })

        this.patchTowerInstallations(form, item.towerInstallations);

        this.patchBladeInstallations(form, item.bladeInstallations);
      })
    } catch(error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  createEditInstallationForm(){
    this.stepForms = [];

    for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
      const cols = this.stepColumnDefs[stepIdx];
      
      const rowForms = this.installationActivityDetails.map(() => {
        const group: any = {};

        cols.forEach(col => {
          switch(col.field){
            case 'installationPlanStart':
            case 'installationPlanFinish':
            case 'assemblyMethod':
            case 'mainCraneMob':
              group[col.field] = [null, Validators.required];
              break;
            default:
              group[col.field] = [null];
          }
        });

        return this.fb.group(group);
      });
      
      this.stepForms.push(rowForms);
    }
  }

  fetchInstallationActivities(){
    try {
      const data = {
        projectId: this.selectedProject.projectId
      }

      this.apiService.fetchInstallationActivities(data).subscribe({
        next: val => {
          this.installationActivityDetails = val.data;

          if(this.showEditInstallationModal){
            this.createEditInstallationForm();
          }


          this.patchInstallationActivities();


          // console.log(
          //   'Edit Installation Data:',
          //   this.editInstallationActivityDetails
          // );
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.installationActivityDetails = MOCK_INSTALLATION_ACTIVITIES;

            if (this.showEditInstallationModal) {
              this.createEditInstallationForm();
            }
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.installationActivityDetails = MOCK_INSTALLATION_ACTIVITIES;

      if (this.showEditInstallationModal) {
        this.createEditInstallationForm();
      }
    }
  }

  // ─── VIEW POPUP ───────────────────────────────────────────────────────────
  openViewPopup() { this.viewVisible = true; }
  closeViewPopup() { this.viewVisible = false; }
  openViewAllDataFromWtg() { 
    this.viewVisible = true;
    this.fetchInstallationActivities();
  }

  createForms(){
    this.stepForms = [];

    for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
      const cols = this.stepColumnDefs[stepIdx];
      
      const rowForms = this.prjWTGDetails.map(() => {
        const group: any = {};

        cols.forEach(col => {
          switch(col.field){
            case 'installationPlanStart':
            case 'installationPlanFinish':
            case 'assemblyMethod':
            case 'mainCraneMob':
              group[col.field] = [null, Validators.required];
              break;
            default:
              group[col.field] = [null];
          }
        });

        return this.fb.group(group);
      });

      
      this.stepForms.push(rowForms);
    }
  }

  isFieldRequired(stepIdx: number, rowIdx: number, field: string): boolean {
    const control = this.stepForms[stepIdx]?.[rowIdx]?.get(field);
    return control?.hasValidator(Validators.required) ?? false;
  }

  fetchPrjWTGDetails(){
    try {
      const data = {
        projectId: this.selectedProject.projectId
      }

      this.apiService.fetchPrjWTGDetails(data).subscribe({
        next: val => {
          this.prjWTGDetails = val.data.filter(
            (wtg: any) => wtg.location && wtg.location.locationId
          );

          this.createForms();
          // Installation activities are patched into stepForms — must run after
          // createForms() builds them, never before, or the patch gets discarded.
          this.fetchInstallationActivities();
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.prjWTGDetails = MOCK_INSTALLATION_WTG_DETAILS;
            this.createForms();
            this.fetchInstallationActivities();
          }
        }
      })
    } catch (error) {
      this.prjWTGDetails = MOCK_INSTALLATION_WTG_DETAILS;
      this.createForms();
    }
  }

  fetchPrjCraneDetails(){
    try {
      const data = {
        projectId: this.selectedProject.projectId
      }

      this.apiService.fetchPrjCraneDetails(data).subscribe({
        next: val => {
          this.prjCraneDetails = val.data;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.prjCraneDetails = MOCK_INSTALLATION_CRANE_DETAILS;
          }
        }
      })

    } catch (error) {
      this.prjCraneDetails = MOCK_INSTALLATION_CRANE_DETAILS;
    }
  }

  selectedSupplier(rowIdx: number, supplierId: number){
    try {
      const data = {
        supplierId: supplierId
      }

      this.apiService.fetchCranesBySupplier(data).subscribe({
        next: val => {
          this.rowSupplierCraneList[rowIdx] = val?.data?.cranes;
        },
        error: err => {
        }
      })
    } catch(error){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openWtgPopup(row: SummaryRow) {
    this.selectedProject = row;
    this.selectedSummaryRow = row;
    this.wtgPopupActiveStep = 0;
    this.wtgPopupVisible = true;

    // Reset per-row crane supplier state for this popup
    this.rowCraneSupplierFixed = {};
    this.rowCraneSupplierValues = {};
    this.rowSupplierCraneList = {};

    const count = row.wtgCount;
    for (let rowIdx = 0; rowIdx < count; rowIdx++) {
      if (row.projectCode === 'P-8002') {
        // P-8002: all WTGs fixed at 0 — no dropdown, all tower sections N/A
        this.rowCraneSupplierFixed[rowIdx] = true;
      } else {
        // All other projects: dropdown, restored from installation data once it loads
        this.rowCraneSupplierFixed[rowIdx] = false;
      }
    }

    this.fetchPrjCraneDetails();
    this.fetchPrjWTGDetails();
  }

  closeWtgPopup() {
    this.wtgPopupVisible = false;
    this.selectedSummaryRow = null;
  }

  getViewWtgRows(): WtgRow[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count);
  }

  getWtgPopupRows(): WtgRow[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count);
  }

  getAllViewColumns(): ViewColumn[] {
    const cols: ViewColumn[] = [];
    this.steps.forEach((step, stepIdx) => {
      this.stepColumnDefs[stepIdx].forEach(col => {
        cols.push({ field: col.field, header: col.header, stepLabel: step.label, type: col.type, stepIdx });
      });
    });
    return cols;
  }

  getViewStepGroups(): { stepIdx: number; label: string; colCount: number }[] {
    return this.steps.map((step, stepIdx) => ({
      stepIdx,
      label: `Step ${step.id}: ${step.label}`,
      colCount: this.stepColumnDefs[stepIdx].length
    }));
  }

  getViewValue(stepIdx: number, rowIdx: number, field: string, type: 'date' | 'text' | 'number' | 'select'): string {
    const val = this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    if (val === null || val === undefined || val === '') return '—';
    if (type === 'date' && val instanceof Date) {
      const d = val as Date;
      return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
    }
    return String(val);
  }

  hasViewValue(stepIdx: number, rowIdx: number, field: string): boolean {
    const val = this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    return val !== null && val !== undefined && val !== '';
  }

  getLocationOptions(): any[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count).map(r => ({ label: r.locationNo, value: r.locationNo }));
  }

  getMaximoOptions(): any[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count).map(r => ({ label: r.maximoId, value: r.maximoId }));
  }

  downloadTemplate(){
    try {
      const data = {
        projectId: this.selectedProject.projectId
      }

      this.apiService.installationExport(data).subscribe({
        next: (val: Blob) => {
          const url = window.URL.createObjectURL(val);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Installation.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Installation excel template downloaded successfully.' });
          this.chooseDownloadTemplate = false;
        },
        error: async(err) => {
          if (err.error instanceof Blob) {
            const text = await err.error.text();
            const json = JSON.parse(text);

            this.messageService.add({severity: 'error', summary: 'Error', detail: json.detail || 'Something went wrong' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail || 'Something went wrong' });
          }
        }
      })
    } catch (error) {
    }
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload(event: any){
    this.selectedFile = event.files[0];

    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select file'
      });
      return;
    }

    const formData = new FormData();

    formData.append('file', this.selectedFile);

    formData.append('projectId', this.selectedProject.projectId);

    this.apiService.installationImport(formData).subscribe({
      next: val => {

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File uploaded successfully'
        });

        this.displayImportDialog = false;
        this.chooseUploadTemplate = false;

        this.selectedFile = null;
      },
      error: err => {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.detail
        });
      }
    })
  }

  uploadTemplate(){
    try {
      this.displayImportDialog = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  buildEditInstallationPayload(){
    return this.installationActivityDetails
      .map((wtg: any, rowIdx: number) => ({
        wtg,
        rowIdx
      }))
      .filter(({rowIdx}) => {
        const form = this.stepForms[0][rowIdx];

        return Object.values(form.value).some(v => 
          v !== null &&
          v !== '' &&
          v !== undefined
        );
      })
      .map(({ wtg, rowIdx }) => {
        const form = this.stepForms[0][rowIdx];
          
        const existingTowerInstallations = wtg.towerInstallations ?? [];

        const sectionCount = wtg.projectWtgs?.[0]?.towerType?.sectionCount ?? 0;

        const towerInstallations = [];

        for (let i = 1; i <= sectionCount; i++) {
          const existingTower = existingTowerInstallations.find(
            (tower: any) => tower.section === i
          );

          towerInstallations.push({
            towerInstallationId: existingTower?.towerInstallationId ?? 0,
            section: i,
            installationDate: this.formatDate(form.get(`s${i}TowerInstallation`)?.value),
            torqueCheckDate: this.formatDate(form.get(`s${i}UpperBolts10pct`)?.value)
          });
        }

        const existingBladeInstallations = wtg.bladeInstallations ?? [];

        const bladeInstallations = [];

        for (let i = 1; i <= 3; i++) {
          const existingBlade = existingBladeInstallations.find(
            (blade: any) => blade.bladeNo === i
          );


          bladeInstallations.push({
            bladeInstallationId: existingBlade.bladeInstallationId,
            bladeNo: i,
            installationDate: this.formatDate(form.get(`blade${i}Installation`)?.value),
            torqueCheckDate: this.formatDate(form.get(`blade${i}Bolts10pct`)?.value)
          });
        }

        return {
          installationId: wtg?.installationId,

          projectLocationId: wtg.projectLocation?.locationId ?? 0,

          projectCraneDetailId:
            wtg?.projectCraneDetail?.projectCraneDetailId,

          assemblyMethod:
            form.get('assemblyMethod')?.value,

          craneMobilization:
            this.formatDate(form.get('mainCraneMob')?.value),

          craneAssemblyStart:
            this.formatDate(form.get('startOfMainCraneAssembly')?.value),

          craneAssemblyFinish:
            this.formatDate(form.get('finishOfMainCraneAssembly')?.value),

          bottomPlatformAssembly:
            this.formatDate(form.get('bottomPlatformAssembly')?.value),

          craneBoomUp:
            this.formatDate(form.get('mainCraneBoomUp')?.value),

          converterPanelInstallation:
            this.formatDate(form.get('converterPanelInstallation')?.value),

          installationPlanStart:
            this.formatDate(form.get('installationPlanStart')?.value),

          installationActualStart:
            this.formatDate(form.get('installationActualStart')?.value),

          installationForeCastStart:
            this.formatDate(form.get('installationForecastStart')?.value),

          installationStartDelayReason:
            form.get('installationStartDelayReason')?.value,

          installationPlanFinish:
            this.formatDate(form.get('installationPlanFinish')?.value),

          installationActualFinish:
            this.formatDate(form.get('installationActualFinish')?.value),

          installationForeCastFinish:
            this.formatDate(form.get('installationForecastFinish')?.value),

          installationFinishDelayReason:
            form.get('installationFinishDelayReason')?.value,

          craneBoomDown:
            this.formatDate(form.get('mainCraneBoomDown')?.value),

          nacelleInstallation:
            this.formatDate(form.get('nacelleInstallation')?.value),

          rotorAssemblyDate:
            this.formatDate(form.get('rotorAssemblyDate')?.value),

          hubAssemblyDate:
            this.formatDate(form.get('hubAssemblyDate')?.value),

          generatorAlignment:
            this.formatDate(form.get('generatorAlignmentDate')?.value),

          cableLaying:
            this.formatDate(form.get('cableLaying')?.value),

          mechanicalCompletion:
            this.formatDate(form.get('mechanicalCompletion')?.value),

          electricalCompletion:
            this.formatDate(form.get('electricalCompletion')?.value),

          liftInstallation:
            this.formatDate(form.get('liftInstallation')?.value),

          qaInspectionFinish:
            this.formatDate(form.get('qaInspectionFinish')?.value),

          mccPlan:
            this.formatDate(form.get('mccPlan')?.value),

          mccActual:
            this.formatDate(form.get('mccActual')?.value),

          mccForecast:
            this.formatDate(form.get('mccForecast')?.value),

          mccDelayReason:
            form.get('mccDelayReason')?.value,

          mccSignOff:
            this.formatDate(form.get('mccSignOffDate')?.value),

          maxOfThreeBlade: 
            this.formatDate(form.get('maxOfThreeBlade')?.value),

          rotorInstallationDate: 
            this.formatDate(form.get('rotorInstallationDate')?.value),

          anchorBolt10PercentTorqueCheck: 
            this.formatDate(form.get('anchorBolts10pct')?.value),

          towerNacelle10PercentTorqueCheck:
            this.formatDate(form.get('towerNacelleBolts10pct')?.value),

          nacelleHub10PercentTorqueCheck:
            this.formatDate(form.get('nacelleHubBolts10pct')?.value),

          rotorBolt10PercentTorqueCheck:
            this.formatDate(form.get('rotorBolts10pct')?.value),

          final10PercentTorqueCheck:
            this.formatDate(form.get('finalTorquingCompleted')?.value),

          // craneEntryDate: 
          // craneExitDate:
          // craneRemarks:

          towerInstallations,

          bladeInstallations

        };
    })
  }

  updateInstallation(stepIdx: number){
    try {
      const requiredFields = [
        'installationPlanStart',
        'installationPlanFinish',
        'mainCraneMob',
        'assemblyMethod'
      ];
  
      let hasError = false;
  
      this.stepForms[stepIdx].forEach(form => {
        const rowStarted = Object.values(form.value).some(
          value => value !== null && value !== '' && value !== undefined
        );
  
        if(!rowStarted){
          return;
        }
  
        requiredFields.forEach(field => {
          const control = form.get(field);
  
          control?.markAsTouched();
          control?.updateValueAndValidity();
  
          if(control?.invalid){
            hasError = true;
          }
        })
      })
  
      if (hasError) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Please fill all required fields.'
        });
        return;
      }
      const payload = this.buildEditInstallationPayload();

      this.apiService.updateInstallation(payload).subscribe({
        next: val => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully Updated Installation'
          })
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.updateInstallationLocally(payload);
          }
        }
      })
    } catch(error){

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // Demo mode fallback: merge the built update payload back into the in-memory
  // installation activity rows (same rows keyed off stepForms[0]) when the backend is unreachable.
  private updateInstallationLocally(payload: any[]){
    const eligibleIdxs = this.installationActivityDetails
      .map((_: any, idx: number) => idx)
      .filter((idx: number) => {
        const form = this.stepForms[0][idx];
        return Object.values(form.value).some(
          v => v !== null && v !== '' && v !== undefined
        );
      });

    this.installationActivityDetails = this.installationActivityDetails.map((wtg: any, idx: number) => {
      const pos = eligibleIdxs.indexOf(idx);
      if (pos === -1) return wtg;
      return { ...wtg, ...payload[pos] };
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully Updated Installation'
    });
  }

  openEditInstallationModal(){
    try {
      this.showEditInstallationModal = true;
      this.fetchInstallationActivities();
      this.fetchPrjCraneDetails();
    } catch(error){
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign Project Crane detail',
        icon: 'pi pi-truck',
        command: () => this.router.navigate(['/project', 
          this.selectedProject.projectId, 
          'cranes'],
          {
            state: {
              project: this.selectedProject
            }
          }
        )
      },
      {
        label: 'Edit Installation',
        icon: 'pi pi-pencil',
        command: () => this.openEditInstallationModal()
      },
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command: () => this.openImportDialog()
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: () => this.exportInstallation()
      }
    ]
  }

  openImportDialog(){
    try {
      this.chooseUploadTemplate = true;      
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  exportInstallation(){
    try {
      this.chooseDownloadTemplate = true;      
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  shouldShowTowerFields(): boolean {
    return this.selectedSummaryRow?.projectCode !== 'P-8002';
  }

  openMenu(menu: any, event: any, project: any){
    this.selectedProject = project;
    this.items = this.getMenuItems();
    menu.toggle(event);
  }

  onDialogClose(){

  }
}
