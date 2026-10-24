import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ButtonModule }      from 'primeng/button';
import { InputTextModule }   from 'primeng/inputtext';
import { TextareaModule }    from 'primeng/textarea';
import { SelectModule }      from 'primeng/select';
import { DatePickerModule }  from 'primeng/datepicker';
import { AccordionModule }   from 'primeng/accordion';
import { TableModule }       from 'primeng/table';
import { ToastModule }       from 'primeng/toast';
import { CardModule }        from 'primeng/card';
import { ConfirmationService, MenuItem, MessageService }    from 'primeng/api';
import { IconFieldModule }   from 'primeng/iconfield';
import { TagModule }         from 'primeng/tag';
import { InputIconModule }   from 'primeng/inputicon';
import { DialogModule }      from 'primeng/dialog';
import { ConfirmDialogModule }from 'primeng/confirmdialog';
import { FluidModule }       from 'primeng/fluid';
import { CheckboxModule }    from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule }     from 'primeng/divider';
import { TooltipModule }     from 'primeng/tooltip';
import { Apiservice } from '../service/apiservice';
import { Shared } from '../shared/services/shared';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface WtgConfig {
  id: number;
  wtgType: string[];       // multiselect → array
  capacity: string | null;
  towerType: string;
  bladeTypeId: string;
  gridConnectivity: string;
  ppaType: string;
  wtgQty: number | null;
  shipAddress: string;
  monthly: (number | null)[];
  startMonth: string;
}

export interface SpvEntry {
  id: number;
  spv: any;
  wtgConfigs: WtgConfig[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateMonthLabels(startMonth: string, count = 12): string[] {
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [mon, yr] = startMonth.split(' ');
  let mi = monthNames.indexOf(mon);
  let yi = parseInt(yr, 10);
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    labels.push(`${monthNames[mi]} ${yi}`);
    mi++;
    if (mi === 12) { mi = 0; yi++; }
  }
  return labels;
}

function currentMonthLabel(): string {
  const now = new Date();
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()];
  return `${m} ${now.getFullYear()}`;
}

let _id = 0;
function nextId() { return ++_id; }

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_PROJECT_LIST: any[] = [
  { projectId: 1, projectCode: 'P-8001', customer: { customerId: 1, customerName: 'ReNew Power' }, probability: 'P90', totalWtgs: 24, totalCapacity: 79.2 },
  { projectId: 2, projectCode: 'P-8002', customer: { customerId: 2, customerName: 'Adani Green Energy' }, probability: 'P50', totalWtgs: 18, totalCapacity: 59.4 },
  { projectId: 3, projectCode: 'P-8003', customer: { customerId: 3, customerName: 'Suzlon Energy' }, probability: 'P100', totalWtgs: 30, totalCapacity: 99.0 },
  { projectId: 4, projectCode: 'P-8004', customer: { customerId: 4, customerName: 'Greenko' }, probability: 'P90', totalWtgs: 12, totalCapacity: 39.6 },
  { projectId: 5, projectCode: 'P-8005', customer: { customerId: 5, customerName: 'Tata Power Renewable' }, probability: 'P75', totalWtgs: 20, totalCapacity: 66.0 },
  { projectId: 6, projectCode: 'P-8006', customer: { customerId: 6, customerName: 'JSW Energy' }, probability: 'P50', totalWtgs: 15, totalCapacity: 49.5 },
  { projectId: 7, projectCode: 'P-8007', customer: { customerId: 1, customerName: 'ReNew Power' }, probability: 'P90', totalWtgs: 28, totalCapacity: 92.4 },
  { projectId: 8, projectCode: 'P-8008', customer: { customerId: 3, customerName: 'Suzlon Energy' }, probability: 'P100', totalWtgs: 10, totalCapacity: 33.0 },
  { projectId: 9, projectCode: 'P-8009', customer: { customerId: 2, customerName: 'Adani Green Energy' }, probability: 'P75', totalWtgs: 22, totalCapacity: 72.6 },
  { projectId: 10, projectCode: 'P-8010', customer: { customerId: 4, customerName: 'Greenko' }, probability: 'P90', totalWtgs: 16, totalCapacity: 52.8 },
];

const MOCK_ZONE_LIST: any[] = [
  { zoneId: 1, zone: 'North' },
  { zoneId: 2, zone: 'South' },
  { zoneId: 3, zone: 'East' },
  { zoneId: 4, zone: 'West' },
];

const MOCK_WTG_TYPE_LIST: any[] = [
  { wtgTypeId: 1, wtgType: 'EN132' },
  { wtgTypeId: 2, wtgType: 'EN156' },
  { wtgTypeId: 3, wtgType: 'EN182' },
  { wtgTypeId: 4, wtgType: 'EN156(NS)' },
  { wtgTypeId: 5, wtgType: 'EN182(NS)' },
];

const MOCK_CAPACITY_LIST: any[] = [
  { capacityId: 1, capacity: 2.1 },
  { capacityId: 2, capacity: 2.4 },
  { capacityId: 3, capacity: 2.5 },
  { capacityId: 4, capacity: 3.0 },
  { capacityId: 5, capacity: 3.3 },
  { capacityId: 6, capacity: 3.5 },
  { capacityId: 7, capacity: 5.0 },
  { capacityId: 8, capacity: 5.5 },
];

const MOCK_TOWER_TYPE_LIST: any[] = [
  { towerTypeId: 1, towerType: '120HH-304T' },
  { towerTypeId: 2, towerType: '130HH-420T' },
  { towerTypeId: 3, towerType: '140HH-474T' },
  { towerTypeId: 4, towerType: '140HH-353T' },
];

const MOCK_BLADE_TYPE_LIST: any[] = [
  { bladeTypeId: 1, bladeType: 'Small' },
  { bladeTypeId: 2, bladeType: 'Big' },
];

const MOCK_GRID_LIST: any[] = [
  { gridConnectivityId: 1, gridConnectivity: 'STU' },
  { gridConnectivityId: 2, gridConnectivity: 'CTU' },
];

const MOCK_PPA_LIST: any[] = [
  { ppaTypeId: 1, ppaType: 'Auction' },
  { ppaTypeId: 2, ppaType: 'C&I' },
];

const MOCK_CUSTOMER_LIST: any[] = [
  { customerId: 1, customerName: 'ReNew Power', status: true },
  { customerId: 2, customerName: 'Adani Green Energy', status: true },
  { customerId: 3, customerName: 'Suzlon Energy', status: true },
  { customerId: 4, customerName: 'Greenko', status: true },
  { customerId: 5, customerName: 'Tata Power Renewable', status: true },
  { customerId: 6, customerName: 'JSW Energy', status: true },
  { customerId: 7, customerName: 'NTPC Renewable Energy', status: true },
  { customerId: 8, customerName: 'Torrent Power', status: false },
  { customerId: 9, customerName: 'Hero Future Energies', status: true },
  { customerId: 10, customerName: 'Continuum Green Energy', status: true },
];

const MOCK_CLUSTER_LIST: any[] = [
  { clusterId: 1, clusterName: 'Gujarat', status: true },
  { clusterId: 2, clusterName: 'Tamil Nadu', status: true },
  { clusterId: 3, clusterName: 'Rajasthan', status: true },
  { clusterId: 4, clusterName: 'Karnataka', status: true },
  { clusterId: 5, clusterName: 'Andhra Pradesh', status: true },
  { clusterId: 6, clusterName: 'Maharashtra', status: true },
  { clusterId: 7, clusterName: 'Madhya Pradesh', status: true },
  { clusterId: 8, clusterName: 'Telangana', status: true },
];

const MOCK_MANAGER_LIST: any[] = [
  { userId: 1, userName: 'Ravi Kumar', status: true },
  { userId: 2, userName: 'Sunita Sharma', status: true },
  { userId: 3, userName: 'Ajay Patel', status: true },
  { userId: 4, userName: 'Meena Joshi', status: true },
  { userId: 5, userName: 'Vikram Singh', status: true },
  { userId: 6, userName: 'Oxford Rebello', status: true },
  { userId: 7, userName: 'Srikanth Shanmugam', status: true },
  { userId: 8, userName: 'Surendra Panwar', status: true },
];

const MOCK_SPV_OPTIONS: { label: string; value: any }[] = [
  { label: 'ReNew Wind SPV 1', value: 101 },
  { label: 'ReNew Wind SPV 2', value: 102 },
  { label: 'ReNew Wind SPV 3', value: 103 },
  { label: 'ReNew Wind SPV 4', value: 104 },
];

const MOCK_CUSTOMER_SPV_LIST: any[] = [
  { customerSpvId: 101, spvName: 'ReNew Wind SPV 1', status: true },
  { customerSpvId: 102, spvName: 'ReNew Wind SPV 2', status: true },
  { customerSpvId: 103, spvName: 'ReNew Wind SPV 3', status: true },
  { customerSpvId: 104, spvName: 'ReNew Wind SPV 4', status: true },
];

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    SelectModule, DatePickerModule,
    AccordionModule, TableModule,
    ToastModule, CardModule, IconFieldModule, TagModule, InputIconModule,
    DialogModule, ConfirmDialogModule,
    FluidModule, CheckboxModule, InputNumberModule,
    DividerModule, TooltipModule, Shared
  ],
  providers: [MessageService],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  selectedProject: any;

  // ── Project list (table) ──────────────────────────────────────────────────
  projectList:any; /* = [
    {
      SlNo: '1', Pcode: 'P-8001',
      FPD: 'India_Renew1_Gadag_KA_300.3MW', SiteName: 'ReNew-1 Gadag, KN',
      Customer: 'Renew', Cityinfo: 'Gadag', uniqueS: 'KA-6', State: 'Karnataka',
      WTGQTY: '3', Capacity: '300.3', PM: 'Oxford Rebello', type1: 'FTE',
      StateHead: 'Srikanth Shanmugam', type2: 'FTE', ConstructionManager: 'OM Mishra',
      type3: 'FTE', machinaclLead: '', type4: 'FTE',
      StartDate: '01-01-2022', CompleteDate: '30-06-2025',
      DetailStatus: 'Installation, O&M', Status4: 'Execution,Service',
      ContractualCoD: '31-03-23', ExpectedCoD: '30-06-25', ActualCoD: '02-05-25',
      Delay: 763, Remarks: 'Land delay, RoW, Delay in GSS & EHV Line'
    },
    {
      SlNo: '2', Pcode: 'P-8002',
      FPD: 'India_Renew2_Chandwad_MH_300.3MW', SiteName: 'ReNew2 Chanwad, MH',
      Customer: 'Renew', Cityinfo: 'Chandwad', uniqueS: 'MH-5', State: 'Maharashtra',
      WTGQTY: '3', Capacity: '151.18', PM: 'Oxford Rebello', type1: 'FTE',
      StateHead: 'Surendra Panwar', type2: 'FTE', ConstructionManager: 'Adil Hussain',
      type3: 'DCE', machinaclLead: '', type4: '',
      StartDate: '01-01-2022', CompleteDate: '31-12-2025',
      DetailStatus: 'Installation', Status4: 'Execution',
      ContractualCoD: '31-03-23', ExpectedCoD: '30-06-25', ActualCoD: '02-05-25',
      Delay: 763, Remarks: 'Project size reduced to 46'
    }
  ]; */

  // ── Dialog / step state ───────────────────────────────────────────────────
  addProjectDialog = false;
  projectHeader: string = 'Step 1: Create Project';
  isProjectCreated = false;
  step1 = true;
  showEditProjectModal = false;

  items: MenuItem[] = [];

  // ── Step 1 form fields ────────────────────────────────────────────────────
  pCode = '';
  projectDescription = '';
  customerName = '';
  cityInfo = '';
  selectedState: any = '';
  selectedZone = '';
  projectQTY: number = 0;
  projectTotalCapacity = '';
  selectedProjectManager = '';
  selectedBDManager = '';
  selectedSolutionManager = '';
  selectedStateHead = '';
  selectedSiteManager = '';
  selectedMultpleSPV = 'Yes';
  towerScopeChecked = true;
  diableStateDD = false;
  ContractStatusValue = '';
  projectTermValue = '';
  projectProbalityValue = '';

  projectDetails: any;


  // ── Step 1 date fields ────────────────────────────────────────────────────
  dateAnchorCage: Date | null = null;
  dateComponentSupply: Date | null = null;
  dateSiteActivity: Date | null = null;
  dateCommissioning: Date | null = null;
  dateContractualCOD: Date | null = null;
  dateExpectedCOD: Date | null = null;
  dateTermSheet: Date | null = null;
  dateAdvance1: Date | null = null;
  dateAdvance2: Date | null = null;
  dateAdvance3: Date | null = null;
  dateBGRelease: Date | null = null;
  dateSupplyContract: Date | null = null;
  dateServiceSign: Date | null = null;
  dateLTSASign: Date | null = null;

  customerSPVList: any[] = [];

  // ── Step 1 dropdown options ───────────────────────────────────────────────
  states: any[] = [];

  cityStateMap: { [key: string]: string } = {
    chennai: 'Tamil Nadu', coimbatore: 'Tamil Nadu', salem: 'Tamil Nadu',
    hyderabad: 'Telangana', bengaluru: 'Karnataka', mysuru: 'Karnataka',
    mumbai: 'Maharashtra', pune: 'Maharashtra', delhi: 'Delhi',
    kolkata: 'West Bengal', patna: 'Bihar', ranchi: 'Jharkhand',
    lucknow: 'Uttar Pradesh'
  };

  zoneOptions: any[]       = [/* [{ label: 'North', value: '1' }, { label: 'South', value: '2' } */];
  PMOptions: any[]         = [/* { label: 'PM 1', value: '1' }, { label: 'PM 2', value: '2' }, { label: 'PM 3', value: '3' }, { label: 'PM 4', value: '4' } */];
  BDOptions         = [{ label: 'BD 1', value: '1' }, { label: 'BD 2', value: '2' }, { label: 'BD 3', value: '3' }, { label: 'BD 4', value: '4' }];
  solutionOptions   = [{ label: 'Solution Manager 1', value: '1' }, { label: 'Solution Manager 2', value: '2' }, { label: 'Solution Manager 3', value: '3' }];
  stateHeadOptions  = [{ label: 'State Head 1', value: '1' }, { label: 'State Head 2', value: '2' }];
  siteManagerOptions= [{ label: 'Site Manager 1', value: '1' }, { label: 'Site Manager 2', value: '2' }];
  multipleSPVOptions= [{ label: 'Yes', value: '1' }, { label: 'No', value: '2' }];
  projectProbality= [{ label: 'P-50', value: 'P50' }, { label: 'P-75', value: 'P75' }, { label: 'P-90', value: 'P90' }, { label: 'P-100', value: 'P100' }];
  projectTerm= [{ label: 'DAP', value: 'DAP' }, { label: 'DAP + Tower', value: 'DAP_TOWER' }, { label: 'EXW', value: 'EXW' }, { label: 'EXW + Tower', value: 'EXW_TOWER' }];
  CustomerNameList: any[]= [/* { label: 'Customer 1', value: '1' }, { label: 'Customer 2', value: '2' }, { label: 'Customer 3', value: '3' }, { label: 'Customer 4', value: '4' } */];

  // ── Step 2: SPV/WTG options ───────────────────────────────────────────────
  WTGOptions: any[]     = [
    /* { label: 'EN132', value: '132' }, { label: 'EN156', value: '156' },
    { label: 'EN182', value: '182' }, { label: 'EN156(NS)', value: '156' },
    { label: 'EN182(NS)', value: '182' } */
  ];
   getCapacityOpts: any[] = [];
  towerOptions: any[]   = [
    /* { label: '120HH-304T', value: '1' }, { label: '140HH-474T', value: '2' },
    { label: '130HH-420T', value: '3' }, { label: '140HH-353T', value: '4' }*/
  ];
  bladeOptions: any[]   = [
    /* { label: 'Blade 1', value: '1' }, { label: 'Blade 2', value: '2' }, */
  ];
  gridOptions: any[]    = [/* { label: 'STU', value: '1' }, { label: 'CTU', value: '2' } */];
  ppaOptions: any[]     = [/* { label: 'Auction', value: '1' }, { label: 'C&I', value: '2' } */];

  // Capacity options driven by WTG type
  private wtgCapacityMap: Record<string, { label: string; value: string }[]> = {
    EN132:       [{ label: '2.4 MW', value: '2.4' }, { label: '2.5 MW', value: '2.5' }],
    EN156:       [{ label: '3.3 MW', value: '3.3' }, { label: '3.5 MW', value: '3.5' }],
    EN182:       [{ label: '5.0 MW', value: '5.0' }, { label: '5.5 MW', value: '5.5' }],
    'EN156(NS)': [{ label: '3.3 MW', value: '3.3' }, { label: '3.5 MW', value: '3.5' }],
    'EN182(NS)': [{ label: '5.0 MW', value: '5.0' }, { label: '5.5 MW', value: '5.5' }],
  };

  // ── Step 2: SPV entries (replaces FormArray table) ────────────────────────
  spvEntries: SpvEntry[] = [];
  spvOptions: { label: string; value: any }[] = [];
  spvOptsList: { label: string; value: any; disabled: boolean }[][] = [];
  overallTotalCapacity = 0;

  private fb = inject(FormBuilder);

  projectForm = this.fb.group({
    projectId: [0],
    customerId: [0],
    projectDescription: [""],
    city: [""],
    country: [""],
    clusterId: [0],
    projectTotalQty: [{ value: 0, disabled: true }],
    projectTotalCapacity: [{ value: 0, disabled: true }],
    clusterHeadId: [0],
    zoneId: [0],
    projectManagerId: [0],
    bdManagerId: [0],
    solutionManagerId: [0],
    siteManagerId: [0],
    projectTerm: [""],
    probability: [""],
    projectStatus: [""],
    contractStatus: [""]
  })

  projectSpvForm = this.fb.group({
    spvs: this.fb.array([])
  })

  get spvs(): FormArray{
    return this.projectSpvForm.get('spvs') as FormArray;
  }

  createSpvForm(spv?: any): FormGroup{
    const wtgConfigurations = this.fb.array(
      (spv?.wtgConfigurations ?? []).map((config: any) =>
        this.createWtgConfigForm(config) 
      )
    )

    return this.fb.group({
      projectSpvId: [spv?.projectSpvId ?? 0],
      customerSpvId: [spv?.customerSpv?.customerSpvId ?? null],
      wtgConfigurations: wtgConfigurations
    });
  }

  getWtgConfigurations(spvIndex: number): FormArray {
    return this.spvs.at(spvIndex).get('wtgConfigurations') as FormArray;
  }

  createWtgConfigForm(config?: any): FormGroup{
    return this.fb.group({
      wtgConfigId: [config?.wtgConfigId ?? 0],
      wtgTypeId: [config?.wtgType?.wtgTypeId ?? null],
      capacityId: [config?.capacity?.capacityId ?? null],
      towerTypeId: [config?.towerType?.towerTypeId ?? null],
      bladeTypeId: [config?.bladeType?.bladeTypeId ?? null],
      gridConnectivityId: [config?.gridConnectivity?.gridConnectivityId ?? null],
      ppaTypeId: [config?.ppaType?.ppaTypeId ?? null],
      wtgQty: [{ value: config?.wtgQty ?? 0, disabled: true }]
    })
  }

  constructor(private messageService: MessageService,private apiService:Apiservice, 
      private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.getProjectList();
    this.getZoneList();
    this.getWTGTypeList();
    this.getCapacityList();
    this.getTowerTypeList();
    this.getBladeTypeList();
    this.getGridInfoList();
    this.getPPAInfoList();
    this.getCustomerList();
    this.getClusterList();
    this.getManagerList();
    this.items = this.getMenuItems();
  }

  getProjectList(){
    try{
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
      this.apiService.projectSearch(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.projectList = res.data.content
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.projectList = MOCK_PROJECT_LIST;
        }
        }
      })

    }catch(e){
      this.projectList = MOCK_PROJECT_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getZoneList(){
    try{
      let data = {}
      this.apiService.zoneInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.zoneOptions = res.data
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.zoneOptions = MOCK_ZONE_LIST;
        }
        }
      })

    }catch(e){
      this.zoneOptions = MOCK_ZONE_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

    getWTGTypeList(){
    try{
      let data = {}
      this.apiService.wtgTypeInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.WTGOptions = res.data
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.WTGOptions = MOCK_WTG_TYPE_LIST;
        }
        }
      })

    }catch(e){
      this.WTGOptions = MOCK_WTG_TYPE_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

     getCapacityList(){
    try{
      let data = {}
      this.apiService.capacityInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.getCapacityOpts = res.data
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.getCapacityOpts = MOCK_CAPACITY_LIST;
        }
        }
      })

    }catch(e){
      this.getCapacityOpts = MOCK_CAPACITY_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getTowerTypeList(){
    try{
      let data = {}
      this.apiService.towerTypeInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.towerOptions = res.data
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.towerOptions = MOCK_TOWER_TYPE_LIST;
        }
        }
      })

    }catch(e){
      this.towerOptions = MOCK_TOWER_TYPE_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getBladeTypeList(){
    try{
      let data = {}
      this.apiService.bladeTypeInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.bladeOptions = res.data
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.bladeOptions = MOCK_BLADE_TYPE_LIST;
        }
        }
      })

    }catch(e){
      this.bladeOptions = MOCK_BLADE_TYPE_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getGridInfoList(){
    try{
      let data = {}
      this.apiService.gridConnectivityInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.gridOptions = res.data
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.gridOptions = MOCK_GRID_LIST;
        }
        }
      })

    }catch(e){
      this.gridOptions = MOCK_GRID_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getPPAInfoList(){
    try{
      let data = {}
      this.apiService.ppaTypeInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.ppaOptions = res.data
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.ppaOptions = MOCK_PPA_LIST;
        }
        }
      })

    }catch(e){
      this.ppaOptions = MOCK_PPA_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getCustomerList(){
    try{
      let data = {}
      this.apiService.customerInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          var filt = res.data.filter((itm:any)=>{
            return itm.status == true
          })
          this.CustomerNameList = filt
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.CustomerNameList = MOCK_CUSTOMER_LIST.filter((itm:any) => itm.status == true);
        }
        }
      })

    }catch(e){
      this.CustomerNameList = MOCK_CUSTOMER_LIST.filter((itm:any) => itm.status == true);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getClusterList(){
    try{
      let data = {}
      this.apiService.clusterInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          var filt = res.data.filter((itm:any)=>{
            return itm.status == true
          })
          this.states = filt
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.states = MOCK_CLUSTER_LIST.filter((itm:any) => itm.status == true);
        }
        }
      })

    }catch(e){
      this.states = MOCK_CLUSTER_LIST.filter((itm:any) => itm.status == true);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getManagerList(){
    try{
      let data = {}
      this.apiService.companyUserInfo(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          var filt = res.data.filter((itm:any)=>{
            return itm.status == true
          })
          this.PMOptions = filt
        },error:(err)=>{
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        } else {
          this.PMOptions = MOCK_MANAGER_LIST.filter((itm:any) => itm.status == true);
        }
        }
      })

    }catch(e){
      this.PMOptions = MOCK_MANAGER_LIST.filter((itm:any) => itm.status == true);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

getSPVList(addFirst = false): void {
  try {
    const data = { customerId: this.customerName || 1 };
    this.apiService.customerSpvInfo(data).subscribe({
      next: (res) => {
        console.log('SPV raw data:', res.data); // <-- check console for real property names
        const filt = res.data.filter((itm: any) => itm.status == true);
        this.spvOptions = filt.map((itm: any) => ({
          label: itm.spvName,
          value: itm.customerSpvId       // if this logs as undefined, change to the real key
        }));
        console.log('spvOptions built:', this.spvOptions);
        if (addFirst) this.addSpvEntry(); else this.buildOptsList();
      },
      error: (err) => {
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.detail || 'Error loading SPV list' });
        } else {
          this.spvOptions = MOCK_SPV_OPTIONS;
        }
        if (addFirst) this.addSpvEntry(); else this.buildOptsList();
      }
    });
  } catch (e) {
    this.spvOptions = MOCK_SPV_OPTIONS;
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    if (addFirst) this.addSpvEntry(); else this.buildOptsList();
  }
}

  // ─── Step 1 ───────────────────────────────────────────────────────────────

  addNewProject(): void {
    this.addProjectDialog = true;
  }

  onCityChange(val: any): void {
    const city = val.target.value.trim().toLowerCase();
    if (this.cityStateMap[city]) {
      this.selectedState = this.cityStateMap[city];
      this.diableStateDD = true;
    } else {
      this.selectedState = '';
      this.diableStateDD = false;
    }
  }

  validateStep1() {

  const requiredFields = [
    { key: this.pCode, name: 'Project Code' },
    { key: this.projectDescription, name: 'Project Description' },
    { key: this.customerName, name: 'Customer' },
    { key: this.cityInfo, name: 'City Info' },
    { key: this.selectedState, name: 'State' },
    { key: this.selectedZone, name: 'Zone' },
    { key: this.projectQTY, name: 'Project QTY' },
    { key: this.projectTotalCapacity, name: 'Project Total Capacity' },
    { key: this.projectProbalityValue, name: 'Project Probability' },
    { key: this.projectTermValue, name: 'Project Term' },

    { key: this.selectedProjectManager, name: 'Project Manager' },
    { key: this.selectedBDManager, name: 'BD Manager' },
    { key: this.selectedSolutionManager, name: 'Solution Manager' },
    { key: this.selectedStateHead, name: 'State Head' },
    { key: this.selectedSiteManager, name: 'Site Manager' }
  ];

  const invalidField = requiredFields.find(field =>
    field.key === null ||
    field.key === undefined ||
    field.key === '' ||
    (typeof field.key === 'string' && field.key.trim() === '')
  );

  if (invalidField) {

    this.messageService.add({
      severity: 'warn',
      summary: 'Required',
      detail: `${invalidField.name} is required`
    });

    return;
  }

  if (this.pCode.trim().length > 10) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Invalid',
      detail: 'Project Code must not exceed 10 characters'
    });

    return;
  }

  if (this.projectDescription.trim().length > 100) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Invalid',
      detail: 'Project Description must not exceed 100 characters'
    });

    return;
  }

  this.submitProject();
}

  submitProject(): void {
    this.spvEntries = [];
    this.spvOptions = [];
    this.projectHeader = 'Step 2: Add SPV Details';
    this.isProjectCreated = true;
    this.step1 = false;
    this.getSPVList(true);
  }

  // ─── Step 2: SPV management ───────────────────────────────────────────────

  addSpvEntry(): void {
    this.spvEntries.push({ id: nextId(), spv: null, wtgConfigs: [this.emptyConfig()] });
    this.buildOptsList();
  }

onSpvSelect(entry: SpvEntry, value: any): void {
  entry.spv = value;
  this.buildOptsList();
  // Force new array reference so Angular re-renders the dropdown
  this.spvOptsList = [...this.spvOptsList];
}

buildOptsList(): void {
  const allSelected = this.spvEntries
    .filter(s => s.spv != null)
    .map(s => String(s.spv));           // convert to string for safe comparison

  this.spvOptsList = this.spvEntries.map(entry => {
    return this.spvOptions.map(opt => ({
      ...opt,
      disabled: allSelected.includes(String(opt.value))   // taken by ANY row...
               && String(opt.value) !== String(entry.spv) // ...but not by THIS row
    }));
  });
}

  removeSpvEntry(spvId: number): void {
    this.spvEntries = this.spvEntries.filter(s => s.id !== spvId);
    this.buildOptsList();
    this.recalcOverallCapacity();
  }

  // ─── Step 2: WTG Config management ───────────────────────────────────────

  emptyConfig(): WtgConfig {
    return {
      id: nextId(),
      wtgType: [],
      capacity: null,
      towerType: '',
      bladeTypeId: '',
      gridConnectivity: '',
      ppaType: '',
      wtgQty: null,
      shipAddress: '',
      monthly: Array(12).fill(null),
      startMonth: currentMonthLabel()
    };
  }

  addWtgConfig(spv: SpvEntry): void {
    spv.wtgConfigs.push(this.emptyConfig());
  }

  removeWtgConfig(spv: SpvEntry, cfgId: number): void {
    spv.wtgConfigs = spv.wtgConfigs.filter(c => c.id !== cfgId);
    this.recalcOverallCapacity();
  }

  onWtgTypeChange(cfg: WtgConfig): void {
    cfg.capacity = null;
    cfg.towerType = '';
  }

  /** Capacity options based on the first selected WTG type */
  /* getCapacityOpts(cfg: WtgConfig): { label: string; value: string }[] {
    const firstType = cfg.wtgType?.[0];
    return firstType ? (this.wtgCapacityMap[firstType] ?? []) : [];
  } */

  // ─── Step 2: Monthly distribution ────────────────────────────────────────

  getMonthLabels(cfg: WtgConfig): string[] {
    return generateMonthLabels(cfg.startMonth, 12);
  }

  monthTotal(cfg: WtgConfig): any {
    return cfg.monthly.reduce((s:any, v) => s + (v ?? 0), 0);
  }

  remainingQty(cfg: WtgConfig): number {
    return (cfg.wtgQty ?? 0) - this.monthTotal(cfg);
  }

  onMonthlyInput(cfg: WtgConfig, idx: number, raw: number | null): void {
    const val = raw ?? 0;
    const limit = cfg.wtgQty ?? 0;
    const restSum:any = cfg.monthly.reduce((s:any, v, i) => i !== idx ? s + (v ?? 0) : s, 0);
    if (restSum + val > limit) {
      cfg.monthly[idx] = Math.max(0, limit - restSum);
      this.messageService.add({
        severity: 'warn', summary: 'Qty Exceeded',
        detail: `Max allowed is ${limit}. Capped to ${cfg.monthly[idx]}.`, life: 3000
      });
    } else {
      cfg.monthly[idx] = val;
    }
    this.recalcOverallCapacity();
  }

  resetMonthly(cfg: WtgConfig): void {
    cfg.monthly = Array(12).fill(null);
    this.recalcOverallCapacity();
  }

  hasMonthlyTable(cfg: WtgConfig): boolean {
    return (cfg.wtgQty ?? 0) > 0;
  }

  // ─── Step 2: Totals ───────────────────────────────────────────────────────

  recalcOverallCapacity(): void {
    let total = 0;
    for (const spv of this.spvEntries) {
      for (const cfg of spv.wtgConfigs) {
        total += (Number(cfg.capacity) || 0) * (cfg.wtgQty ?? 0);
      }
    }
    this.overallTotalCapacity = total;
  }

  onQtyChange(cfg: WtgConfig): void {
    // Only reset monthly distribution when a valid positive qty is committed
    if (cfg.wtgQty != null && cfg.wtgQty > 0) {
      this.resetMonthly(cfg);
    }
    this.recalcOverallCapacity();
  }

  onQtyBlur(cfg: WtgConfig): void {
    // If user clears the field, keep null (do not snap to 0)
    if (cfg.wtgQty === 0 || cfg.wtgQty == null) {
      cfg.wtgQty = null;
    } else if (cfg.wtgQty > 0) {
      this.resetMonthly(cfg);
    } 
    this.recalcOverallCapacity();
  }

  onCapacityChange(cfg: WtgConfig): void {
    this.recalcOverallCapacity();
  }

  // ─── Step 2: Validation ───────────────────────────────────────────────────

  validateSpvDetails(): boolean {

  if (!this.spvEntries || this.spvEntries.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Required',
      detail: 'Project SPV Details are required'
    });

    return false;
  }

  const checks: { valid: boolean; message: string }[] = [];

  this.spvEntries.forEach((entry, si) => {
    const spvLabel = `SPV ${si + 1}`;

    checks.push({
      valid: entry.spv !== null && entry.spv !== undefined && entry.spv !== '',
      message: `Please select an SPV for ${spvLabel}.`
    });

    checks.push({
      valid: !!entry.wtgConfigs && entry.wtgConfigs.length > 0,
      message: `At least one WTG configuration is required for ${spvLabel}.`
    });

    (entry.wtgConfigs || []).forEach((cfg, ci) => {
      const rowLabel = `${spvLabel}, WTG Configuration ${ci + 1}`;

      checks.push({ valid: !!cfg.wtgType?.[0], message: `Please select WTG Type for ${rowLabel}.` });
      checks.push({ valid: !!cfg.capacity, message: `Please select Capacity for ${rowLabel}.` });

      if (this.towerScopeChecked) {
        checks.push({ valid: !!cfg.towerType, message: `Please select Tower Type for ${rowLabel}.` });
        checks.push({ valid: !!cfg.bladeTypeId, message: `Please select Blade Type for ${rowLabel}.` });
      }

      checks.push({ valid: !!cfg.gridConnectivity, message: `Please select Grid Connectivity for ${rowLabel}.` });
      checks.push({ valid: !!cfg.ppaType, message: `Please select PPA Type for ${rowLabel}.` });
      checks.push({ valid: !!(cfg.wtgQty && cfg.wtgQty > 0), message: `WTG Quantity must be greater than 0 for ${rowLabel}.` });
    });
  });

  const firstInvalid = checks.find(c => !c.valid);

  if (firstInvalid) {

    this.messageService.add({
      severity: 'warn',
      summary: 'Required',
      detail: firstInvalid.message
    });

    return false;
  }

  return true;
  }

  // ─── Step 2: Save ─────────────────────────────────────────────────────────

  saveSPV(): void {
    try{
      if (!this.validateSpvDetails()) {
        return;
      }

      console.log('SPV Entries:', JSON.stringify(this.spvEntries, null, 2));
    console.log('Overall Total Capacity:', this.overallTotalCapacity);

    var spvDetails:any = []
    this.spvEntries.forEach((spvEntry: any) => {
      spvDetails.push({
        projectSpvId: 0,
        customerSpvId: spvEntry.spv,
        wtgConfigurations: spvEntry.wtgConfigs.map((cfg: any) => ({
          wtgConfigId: 0,
          wtgTypeId: cfg.wtgType?.[0] || 0,
          capacityId: cfg.capacity || 0,
          towerTypeId: cfg.towerType || 0,
          bladeTypeId: cfg.bladeTypeId || 0,
          gridConnectivityId: cfg.gridConnectivity || 0,
          ppaTypeId: cfg.ppaType || 0,
          wtgQty: cfg.wtgQty || 0
        }))
      });

    });
    var filterClusterId:any = []
     if(this.selectedState){
      filterClusterId = this.states.filter((itm:any)=>{
        return itm.label == this.selectedState
      })
    }
    /* if(filterClusterId){
      var clusId = filterClusterId[0].value
    } */
    let data = {
      "projectCode": this.pCode,
      "projectDescription": this.projectDescription,
      "customerId": this.customerName,
      "city": this.cityInfo,
      "country": this.selectedState,
      "clusterId": this.selectedState,
      "clusterHeadId": this.selectedStateHead,
      "zoneId": this.selectedZone,
      "projectManagerId": this.selectedProjectManager,
      "bdManagerId": this.selectedBDManager,
      "solutionManagerId": this.selectedSolutionManager,
      "siteManagerId": this.selectedSiteManager,
      "projectTerm": this.projectTermValue,
      "probability": this.projectProbalityValue,
      "contractStatus": this.ContractStatusValue,
      "projectSpvDetails":spvDetails
    }
    console.log(data);

    this.apiService.projectCreate(data)
    .subscribe({
      next:(res)=>{
        console.log(res);
        this.addProjectDialog = false;
        this.getProjectList();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project Created Successfully' });

      },error:(err)=>{
        console.log(err);

        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
        } else if (err.status === 404) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
        } else {
          this.createProjectLocally(data);
        }
      }
    })
    }catch(e){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
    

    
  }

  deleteProject(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Project`,
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
            projectId: this.selectedProject.projectId
          }
    
          console.log(data);
          
          this.apiService.deleteProject(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Project' });
              this.getProjectList();
            },
            error: err => {
              console.log(err);

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.deleteProjectLocally();
              }
            }
          })
        } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      }
    });
  }

  // ─── Trackers ─────────────────────────────────────────────────────────────
  trackById(_: number, item: { id: number }) { return item.id; }
  trackByIdx(i: number) { return i; }

  // ── Demo mode CRUD (operates on the in-memory mock data when the backend is unreachable) ──

  private applyProjectDetails(details: any){
    this.projectDetails = details;
    this.projectForm.patchValue({
      ...this.projectDetails,
      projectId: this.projectDetails.projectCode,
      customerId: this.projectDetails?.customer?.customerId,
      clusterId: this.projectDetails?.cluster?.clusterId,
      zoneId: this.projectDetails?.zone?.zoneId,
      projectManagerId: this.projectDetails?.projectManager?.userId,
      bdManagerId: this.projectDetails?.bdManager?.userId,
      solutionManagerId: this.projectDetails?.solutionManager?.userId,
      clusterHeadId: this.projectDetails?.clusterHead?.userId,
      siteManagerId: this.projectDetails?.siteManager?.userId,
      projectStatus: this.projectDetails?.projectStatus
    });

    this.fetchCustomerSPVInfo();

    this.spvs.clear();

    this.projectDetails?.projectSpvDetails?.forEach((spv: any) => {
      this.spvs.push(this.createSpvForm(spv));
    });

    console.log('SPV Forms:', this.spvs.value);
  }

  private buildMockProjectDetails(project: any): any {
    return {
      projectId: project?.projectId,
      projectCode: project?.projectCode,
      projectDescription: `Demo project description for ${project?.projectCode ?? ''}`,
      city: 'Demo City',
      country: 'Demo State',
      projectTerm: 'DAP',
      probability: project?.probability ?? 'P90',
      projectStatus: 'ACTIVE',
      contractStatus: 'SIGNED',
      projectTotalQty: project?.totalWtgs ?? 0,
      projectTotalCapacity: project?.totalCapacity ?? 0,
      customer: project?.customer ?? MOCK_CUSTOMER_LIST[0],
      cluster: MOCK_CLUSTER_LIST[0],
      zone: MOCK_ZONE_LIST[0],
      projectManager: MOCK_MANAGER_LIST[0],
      bdManager: MOCK_MANAGER_LIST[1],
      solutionManager: MOCK_MANAGER_LIST[2],
      clusterHead: MOCK_MANAGER_LIST[3],
      siteManager: MOCK_MANAGER_LIST[4],
      projectSpvDetails: MOCK_CUSTOMER_SPV_LIST.map((spv, idx) => ({
        projectSpvId: idx + 1,
        customerSpv: { customerSpvId: spv.customerSpvId, spvName: spv.spvName },
        wtgConfigurations: [
          {
            wtgConfigId: idx * 10 + 1,
            wtgType: MOCK_WTG_TYPE_LIST[idx % MOCK_WTG_TYPE_LIST.length],
            capacity: MOCK_CAPACITY_LIST[idx % MOCK_CAPACITY_LIST.length],
            towerType: MOCK_TOWER_TYPE_LIST[idx % MOCK_TOWER_TYPE_LIST.length],
            bladeType: MOCK_BLADE_TYPE_LIST[idx % MOCK_BLADE_TYPE_LIST.length],
            gridConnectivity: MOCK_GRID_LIST[idx % MOCK_GRID_LIST.length],
            ppaType: MOCK_PPA_LIST[idx % MOCK_PPA_LIST.length],
            wtgQty: 4 + idx
          }
        ]
      }))
    };
  }

  private createProjectLocally(data: any){
    const newId = Math.max(0, ...(this.projectList ?? []).map((p: any) => p.projectId || 0)) + 1;
    const customer = this.CustomerNameList.find((c: any) => c.customerId === data.customerId) ?? null;
    const totalWtgs = (data.projectSpvDetails ?? []).reduce((sum: number, spv: any) =>
      sum + (spv.wtgConfigurations ?? []).reduce((s: number, c: any) => s + (c.wtgQty || 0), 0), 0);

    const newProject = {
      projectId: newId,
      projectCode: data.projectCode,
      customer,
      probability: data.probability,
      totalWtgs,
      totalCapacity: this.overallTotalCapacity
    };

    this.projectList = [newProject, ...(this.projectList ?? [])];

    this.addProjectDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project Created Successfully' });
  }

  private deleteProjectLocally(){
    this.projectList = (this.projectList ?? []).filter((p: any) => p.projectId !== this.selectedProject.projectId);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Project' });
  }

  private updateProjectLocally(data: any){
    const customer = this.CustomerNameList.find((c: any) => c.customerId === data.customerId)
      ?? this.selectedProject?.customer ?? null;

    this.projectList = (this.projectList ?? []).map((p: any) =>
      p.projectId === data.projectId ? {
        ...p,
        customer,
        probability: data.probability,
        totalWtgs: data.projectTotalQty ?? p.totalWtgs,
        totalCapacity: data.projectTotalCapacity ?? p.totalCapacity
      } : p
    );

    this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Updated Project Details'});
    this.showEditProjectModal = false;
  }

  private removeProjectSpvLocally(projectSpvId: number){
    const formArrayIndex = this.spvs.controls.findIndex(
      control => control.get('projectSpvId')?.value === projectSpvId
    );

    console.log('Deleting FormArray index:', formArrayIndex);

    if (formArrayIndex !== -1) {
      this.spvs.removeAt(formArrayIndex);
    }

    this.spvs.updateValueAndValidity();

    console.log('Remaining SPVs:', this.spvs.value);

    this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Deleted Project SPV'});
  }

  private removePrjSpvWtgLocally(spvIdx: number, wtgConfigId: number){
    const index = this.getWtgConfigurations(spvIdx).controls.findIndex(
      control => control.get('wtgConfigId')?.value === wtgConfigId
    );

    console.log(index);

    if (index !== -1) {
      this.getWtgConfigurations(spvIdx).removeAt(index);
    }

    this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Deleted Project SPV WTG Configuration'});
  }

  fetchProjectDetails(){
    try {
      const data = {
        projectId: this.selectedProject.projectId
      }

      console.log(data);

      this.apiService.fetchProjectDetails(data).subscribe({
        next: val => {
          console.log(val);
          this.applyProjectDetails(val.data);
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.applyProjectDetails(this.buildMockProjectDetails(this.selectedProject));
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  updateProject(){
    try {
      const data = {
        ...this.projectForm.value,
        projectId: this.selectedProject.projectId,
        projectTotalQty: this.projectDetails.projectTotalQty,
        projectTotalCapacity: this.projectDetails.projectTotalCapacity
      };
      console.log(data);

      this.apiService.updateProjectDetails(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Updated Project Details'});
          this.showEditProjectModal = false;
          this.getProjectList();
        },
        error: err => {
          console.log(err);
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.updateProjectLocally(data);
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchCustomerSPVInfo(){
    try {
      const data = {
        customerId: this.projectDetails?.customer?.customerId
      }

      console.log(data);
      
      this.apiService.customerSpvInfo(data).subscribe({
        next: val => {
          console.log(val);
          this.customerSPVList = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.customerSPVList = MOCK_CUSTOMER_SPV_LIST;
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.customerSPVList = MOCK_CUSTOMER_SPV_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  updateProjectSpv(index: number){
    try {
      const spvForm = this.spvs.at(index);
  
      console.log(spvForm.value);
  
      const data = {
        projectSpvId: spvForm.get('projectSpvId')?.value,
        customerSpvId: spvForm.get('customerSpvId')?.value
      }
  
      console.log('Update SPV Payload:', data);
  
      this.apiService.updateProjectSpv(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Updated Project SPV'});
          this.getProjectList();
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Updated Project SPV'});
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  addMoreWtgConfig(spvIndex: number){
    const wtgConfigurations = this.getWtgConfigurations(spvIndex);
    const newWtgConfig = this.createWtgConfigForm();
    wtgConfigurations.push(newWtgConfig);
  }

  deleteProjectSpv(projectSpvId: number){
    try {
      console.log(this.projectSpvForm.value);
      console.log(this.spvs.value);


      const data = {
        projectId: this.selectedProject.projectId,
        projectSpvId: projectSpvId
      }

      console.log(data);

      this.apiService.deleteProjectSpv(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Deleted Project SPV'});

          const formArrayIndex = this.spvs.controls.findIndex(
            control => control.get('projectSpvId')?.value === projectSpvId
          );

          console.log('Deleting FormArray index:', formArrayIndex);

          if (formArrayIndex !== -1) {
            this.spvs.removeAt(formArrayIndex);
          }

          this.spvs.updateValueAndValidity();

          console.log('Remaining SPVs:', this.spvs.value);
          // this.getProjectList();
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.removeProjectSpvLocally(projectSpvId);
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deletePrjSpvWtg(spvIdx: number, spv: any, config: any){
    try{
      console.log(this.projectSpvForm.value);
      console.log(this.spvs.value);
      console.log(spv.value);
      console.log(config.value);

      const data = {
        projectSpvId: spv.value.projectSpvId,
        wtgConfigId: config.value.wtgConfigId
      }

      console.log(data);

      this.apiService.deletePrjSpvWtg(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Deleted Project SPV WTG Configuration'});

          const index = this.getWtgConfigurations(spvIdx).controls.findIndex(
            control => control.get('wtgConfigId')?.value === config.value.wtgConfigId
          )

          console.log(index);

          if (index !== -1) {
            this.getWtgConfigurations(spvIdx).removeAt(index);
          }
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.removePrjSpvWtgLocally(spvIdx, config.value.wtgConfigId);
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getTotalCapacity(config: any){
    const formValue = config.getRawValue();

    const capacity = this.getCapacityOpts.find((cap: any) => cap?.capacityId === formValue.capacityId);

    if(!capacity){
      return 0
    };

    if(capacity?.capacity === 2.5){
      return formValue.wtgQty;
    } else if(capacity?.capacity === 2500){
      return formValue.wtgQty * 2;
    }
  }

  updateConfiguration(spvIndex: number, configIndex: number){
    try {
      const configForm = this.getWtgConfigurations(spvIndex).at(configIndex);
  
      console.log(configForm.value);
  
      const data = configForm.getRawValue();
  
      console.log('Update SPV Payload:', data);
  
      this.apiService.updatePrjSpvWtgConfig(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Updated Project SPV WTG Configuration'});
          this.getProjectList();
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.messageService.add({severity: "success", summary: 'Success', detail: 'Successfully Updated Project SPV WTG Configuration'});
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editProjectDetails(){
    try {
      this.showEditProjectModal = true;

      this.fetchProjectDetails();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editProjectDetails()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteProject()
      }
    ]
  }

  projectMenu(event: Event, menu: any, project: any){
    this.selectedProject = project;
    console.log(this.selectedProject);
    menu.toggle(event);
  }

  onDialogClose(){

  }

  projectStatus = [
    {
      label: 'DRAFT',
      value: 'DRAFT'
    },
    {
      label: 'ACTIVE',
      value: 'ACTIVE'
    },
    {
      label: 'ON_HOLD',
      value: 'ON_HOLD'
    },
    {
      label: 'COMPLETED',
      value: 'COMPLETED'
    },
    {
      label: 'CANCELLED',
      value: 'CANCELLED'
    }
  ]
}