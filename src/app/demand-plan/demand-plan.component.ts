import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService, ProjectEntry, WtgRow, CUSTOMERS, YEARS } from '../data.service';

// PrimeNG v20
import { TableModule }       from 'primeng/table';
import { SelectModule }      from 'primeng/select';
import { ButtonModule }      from 'primeng/button';
import { InputTextModule }   from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule }      from 'primeng/dialog';
import { ToastModule }       from 'primeng/toast';
import { TagModule }         from 'primeng/tag';
import { CardModule }        from 'primeng/card';
import { MessageService }    from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DividerModule }     from 'primeng/divider';
import { Apiservice } from '../service/apiservice';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_CUSTOMERS: any[] = [
  { customerId: 1, customerName: 'ReNew Power Ltd' },
  { customerId: 2, customerName: 'Adani Green Energy' },
  { customerId: 3, customerName: 'Suzlon Energy' },
  { customerId: 4, customerName: 'Greenko Group' },
  { customerId: 5, customerName: 'Tata Power Renewable Energy' },
  { customerId: 6, customerName: 'Continuum Green Energy' },
  { customerId: 7, customerName: 'Hero Future Energies' },
  { customerId: 8, customerName: 'JSW Energy' },
  { customerId: 9, customerName: 'Sembcorp Green Infra' },
  { customerId: 10, customerName: 'Torrent Power Ltd' },
];

const MOCK_PROJECTS: any[] = [
  { projectId: 1, projectCode: 'BWF-P2-2026' },
  { projectId: 2, projectCode: 'JSLM-CL4-2026' },
  { projectId: 3, projectCode: 'KNL-WP1-2026' },
  { projectId: 4, projectCode: 'DVGD-WP3-2026' },
  { projectId: 5, projectCode: 'CHTP-WP2-2026' },
  { projectId: 6, projectCode: 'RJKT-WP5-2026' },
  { projectId: 7, projectCode: 'PATN-WP1-2026' },
  { projectId: 8, projectCode: 'TUTC-WP4-2026' },
  { projectId: 9, projectCode: 'BLGM-WP2-2026' },
  { projectId: 10, projectCode: 'SNGR-WP6-2026' },
];

const MOCK_SPVS: any[] = [
  { customerSpvId: 1, spvName: 'Bhuj Renewable Energy SPV 1' },
  { customerSpvId: 2, spvName: 'Jaisalmer Wind Power SPV 2' },
  { customerSpvId: 3, spvName: 'Kutch Green Energy SPV 3' },
  { customerSpvId: 4, spvName: 'Devgadh Wind Projects SPV 4' },
  { customerSpvId: 5, spvName: 'Chitradurga Wind SPV 5' },
  { customerSpvId: 6, spvName: 'Rajkot Renewable SPV 6' },
  { customerSpvId: 7, spvName: 'Patan Wind Energy SPV 7' },
  { customerSpvId: 8, spvName: 'Tuticorin Wind SPV 8' },
  { customerSpvId: 9, spvName: 'Belgaum Green Power SPV 9' },
  { customerSpvId: 10, spvName: 'Sangareddy Wind SPV 10' },
];

const MOCK_WTG_DETAILS: any[] = [
  { wtgConfigId: 1, wtgType: 'EN-141', capMw: 3.0, towerType: '120HH-355T', bladeType: 'B68.5', totalQty: 12, janQty: 1, febQty: 1, marQty: 1, aprQty: 1, mayQty: 1, junQty: 1, julQty: 1, augQty: 1, sepQty: 1, octQty: 1, novQty: 1, decQty: 1 },
  { wtgConfigId: 2, wtgType: 'EN-156', capMw: 3.3, towerType: '140HH-474T', bladeType: 'B76.0', totalQty: 8, janQty: 0, febQty: 1, marQty: 1, aprQty: 1, mayQty: 0, junQty: 1, julQty: 1, augQty: 1, sepQty: 0, octQty: 1, novQty: 1, decQty: 0 },
  { wtgConfigId: 3, wtgType: 'EN-171', capMw: 3.6, towerType: '135HH-500T', bladeType: 'B83.5', totalQty: 6, janQty: 1, febQty: 0, marQty: 1, aprQty: 0, mayQty: 1, junQty: 0, julQty: 1, augQty: 0, sepQty: 1, octQty: 0, novQty: 1, decQty: 0 },
  { wtgConfigId: 4, wtgType: 'EN-131', capMw: 2.1, towerType: '105HH-330T', bladeType: 'B64.0', totalQty: 10, janQty: 1, febQty: 1, marQty: 0, aprQty: 1, mayQty: 1, junQty: 0, julQty: 1, augQty: 1, sepQty: 0, octQty: 1, novQty: 1, decQty: 1 },
  { wtgConfigId: 5, wtgType: 'EN-141', capMw: 3.0, towerType: '120HH-355T', bladeType: 'B68.5', totalQty: 9, janQty: 0, febQty: 1, marQty: 1, aprQty: 0, mayQty: 1, junQty: 1, julQty: 0, augQty: 1, sepQty: 1, octQty: 0, novQty: 1, decQty: 1 },
  { wtgConfigId: 6, wtgType: 'EN-156', capMw: 3.3, towerType: '140HH-474T', bladeType: 'B76.0', totalQty: 7, janQty: 1, febQty: 0, marQty: 0, aprQty: 1, mayQty: 1, junQty: 0, julQty: 1, augQty: 0, sepQty: 1, octQty: 1, novQty: 0, decQty: 1 },
  { wtgConfigId: 7, wtgType: 'EN-171', capMw: 3.6, towerType: '135HH-500T', bladeType: 'B83.5', totalQty: 11, janQty: 1, febQty: 1, marQty: 1, aprQty: 1, mayQty: 0, junQty: 1, julQty: 1, augQty: 1, sepQty: 1, octQty: 0, novQty: 1, decQty: 1 },
  { wtgConfigId: 8, wtgType: 'EN-131', capMw: 2.1, towerType: '105HH-330T', bladeType: 'B64.0', totalQty: 5, janQty: 0, febQty: 0, marQty: 1, aprQty: 0, mayQty: 1, junQty: 0, julQty: 1, augQty: 0, sepQty: 1, octQty: 0, novQty: 0, decQty: 1 },
  { wtgConfigId: 9, wtgType: 'EN-156', capMw: 3.3, towerType: '140HH-474T', bladeType: 'B76.0', totalQty: 13, janQty: 1, febQty: 1, marQty: 1, aprQty: 1, mayQty: 1, junQty: 1, julQty: 1, augQty: 1, sepQty: 1, octQty: 1, novQty: 1, decQty: 1 },
  { wtgConfigId: 10, wtgType: 'EN-141', capMw: 3.0, towerType: '120HH-355T', bladeType: 'B68.5', totalQty: 4, janQty: 0, febQty: 1, marQty: 0, aprQty: 0, mayQty: 1, junQty: 0, julQty: 0, augQty: 1, sepQty: 0, octQty: 0, novQty: 1, decQty: 0 },
];

@Component({
  selector: 'app-demand-plan',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TableModule, SelectModule, ButtonModule,
    InputTextModule, InputNumberModule,
    DialogModule, ToastModule, TagModule,
    CardModule, ConfirmDialogModule, DividerModule, ReactiveFormsModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './demand-plan.component.html',
  styleUrls: ['./demand-plan.component.scss']
})
export class DemandPlanComponent implements OnInit {
  selectedYear = '2026';

  year     = '2026';
  customer = '';
  projects: ProjectEntry[] = [];
  private uidSeed = 0;

  selectedCustomerId = 0;
  selectedProjectId = 0;

  customerInfoList: any[] = [];
  customerProjectList: any[] = [];
  projectSpvList: any[] = [];
  projectSpvWtgDetailList: any[] = [];
  // Cache of SPV options keyed by projectId, so each Project Entry (and the
  // Plan Summary) can resolve its own SPV list/name instead of whichever
  // project was fetched most recently.
  spvListByProject: { [projectId: number]: any[] } = {};

  isSubmitting = false;

  // p-select options
  yearOptions = YEARS.map(y => ({ label: y, value: y }));
  // customerOptions = CUSTOMERS.map(c => ({ label: c, value: c }));

  // Summary dialog
  summaryVisible = false;

  private fb = inject(FormBuilder);

  constructor(private ds: DataService, private msgSvc: MessageService, private apiService: Apiservice) {}

  private projectEntrySeq = 0;

  yearlyDemandPlanForm = this.fb.group({
    planYear: [],
    customerId: [],
    projects: this.fb.array([this.createProjectForm()])
  })

  createProjectForm(project?: any): FormGroup{
    try {
      const spvs = this.fb.array(
        (project?.spvs ?? []).map((spv: any) =>
          this.createSpvForm(spv)
        )
      );

      return this.fb.group({
        entryNo: [project?.entryNo ?? ++this.projectEntrySeq],
        projectId: [project?.projectId ?? null],
        spvs: spvs
      })
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return this.fb.group({ entryNo: [++this.projectEntrySeq], projectId: [null], spvs: this.fb.array([]) });
    }
  }

  createSpvForm(spv?: any): FormGroup{
    try {
      const wtgs = this.fb.array(
        (spv?.wtgs ?? []).map((wtg: any) =>
          this.createWtgForm(wtg)
        )
      );

      return this.fb.group({
        spvId: [spv?.spvId ?? null],
        wtgs: wtgs
      })
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return this.fb.group({ spvId: [null], wtgs: this.fb.array([]) });
    }
  }

  createWtgForm(wtg?: any): FormGroup{
    try {
      return this.fb.group({
        wtgConfigId: [wtg?.wtgConfigId ?? null],
        wtgType: [wtg?.wtgType ?? null],
        capMw: [wtg?.capMw ?? null],
        towerType: [wtg?.towerType ?? null],
        bladeType: [wtg?.bladeType ?? null],
        totalQty: [wtg?.totalQty ?? 0],
        janQty: [wtg?.janQty ?? 0],
        febQty: [wtg?.febQty ?? 0],
        marQty: [wtg?.marQty ?? 0],
        aprQty: [wtg?.aprQty ?? 0],
        mayQty: [wtg?.mayQty ?? 0],
        junQty: [wtg?.junQty ?? 0],
        julQty: [wtg?.julQty ?? 0],
        augQty: [wtg?.augQty ?? 0],
        sepQty: [wtg?.sepQty ?? 0],
        octQty: [wtg?.octQty ?? 0],
        novQty: [wtg?.novQty ?? 0],
        decQty: [wtg?.decQty ?? 0]
      })
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return this.fb.group({});
    }
  }

  get projectsArray(): FormArray{
    try {
      return this.yearlyDemandPlanForm.get('projects') as FormArray;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return this.fb.array([]);
    }
  }

  getSpvArray(projectIndex: number): FormArray{
    try {
      return this.projectsArray.at(projectIndex).get('spvs') as FormArray;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return this.fb.array([]);
    }
  }

  getWtgsArray(projectIndex: number, spvIndex: number): FormArray {
    try {
      const spvArray = this.getSpvArray(projectIndex);
      const spvGroup = spvArray.at(spvIndex) as FormGroup;

      return spvGroup.get('wtgs') as FormArray;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return this.fb.array([]);
    }
  }

  // Each Project Entry resolves its SPV options from the cache keyed by its
  // own projectId, instead of the single shared `projectSpvList`, which only
  // ever holds the most recently fetched project's SPVs.
  getSpvOptionsForProject(projectIndex: number): any[] {
    try {
      const project = this.projectsArray.at(projectIndex) as FormGroup;
      const projectId = project.get('projectId')?.value;

      return this.spvListByProject[projectId] ?? [];
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return [];
    }
  }

  // Project options for a given Project Entry's dropdown, with Projects
  // already selected by OTHER entries marked disabled (but still selectable
  // in their own entry's dropdown).
  getProjectSelectOptions(projectIndex: number): any[] {
    try {
      const currentProjectId = this.projectsArray.at(projectIndex)?.get('projectId')?.value;
      const selectedElsewhere = new Set(
        this.projectsArray.controls
          .filter((_, idx) => idx !== projectIndex)
          .map(p => p.get('projectId')?.value)
          .filter(id => id !== null && id !== undefined)
      );

      return (this.customerProjectList ?? []).map((project: any) => {
        const disabled = project.projectId !== currentProjectId && selectedElsewhere.has(project.projectId);
        return {
          ...project,
          projectCode: disabled ? `${project.projectCode} (used)` : project.projectCode,
          disabled
        };
      });
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return this.customerProjectList ?? [];
    }
  }

  // SPV options for a given Project Entry's SPV dropdown, with SPVs already
  // selected by another SPV entry WITHIN THE SAME PROJECT marked disabled.
  getSpvSelectOptions(projectIndex: number, spvIndex: number): any[] {
    try {
      const spvArray = this.getSpvArray(projectIndex);
      const currentSpvId = spvArray.at(spvIndex)?.get('spvId')?.value;
      const selectedElsewhere = new Set(
        spvArray.controls
          .filter((_, idx) => idx !== spvIndex)
          .map(s => s.get('spvId')?.value)
          .filter(id => id !== null && id !== undefined)
      );

      return this.getSpvOptionsForProject(projectIndex).map((spv: any) => {
        const disabled = spv.customerSpvId !== currentSpvId && selectedElsewhere.has(spv.customerSpvId);
        return {
          ...spv,
          spvName: disabled ? `${spv.spvName} (used)` : spv.spvName,
          disabled
        };
      });
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return [];
    }
  }

  ngOnInit() {
    try {
      this.fetchAllCustomer();
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchAllCustomer(){
    try {
      this.apiService.customerInfo('').subscribe({
        next: val => {
          console.log(val);
          this.customerInfoList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.customerInfoList = MOCK_CUSTOMERS;
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.customerInfoList = MOCK_CUSTOMERS;
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchProjectsByCustomer(){
    try {
      const data = {
        customerId: this.selectedCustomerId
      }
      this.apiService.fetchProjectsByCustomer(data).subscribe({
        next: val => {
          console.log(val);
          this.customerProjectList = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.customerProjectList = MOCK_PROJECTS;
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.customerProjectList = MOCK_PROJECTS;
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchSPVsByProject(projectId?: number){
    const targetProjectId = projectId ?? this.selectedProjectId;

    try {
      const data = {
        projectId: targetProjectId
      }
      console.log(data);

      this.apiService.fetchSPVsByProject(data).subscribe({
        next: val => {
          console.log(val);
          this.projectSpvList = val.data;
          this.spvListByProject[targetProjectId] = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.projectSpvList = MOCK_SPVS;
            this.spvListByProject[targetProjectId] = MOCK_SPVS;
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.projectSpvList = MOCK_SPVS;
      this.spvListByProject[targetProjectId] = MOCK_SPVS;
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  populateWtgConfigDetails(projectIndex: number, spvIndex: number){
    try {
      const wtgs = this.getWtgsArray(projectIndex, spvIndex);

      wtgs.clear();

      this.projectSpvWtgDetailList.forEach((wtg: any) => {
        wtgs.push(this.createWtgForm(wtg));
      })
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchWtgDetailsByProjectSPV(spvId: any, projectIndex: number, spvIndex: number){
    try {
      const data = {
        projectId: this.selectedProjectId,
        spvId: spvId
      }

      console.log(data);

      this.apiService.fetchWtgDetailsByProjectSPV(data).subscribe({
        next: val => {
          console.log(val);
          this.projectSpvWtgDetailList = val.data;

          this.populateWtgConfigDetails(projectIndex, spvIndex);
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.projectSpvWtgDetailList = MOCK_WTG_DETAILS;
            this.populateWtgConfigDetails(projectIndex, spvIndex);
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.projectSpvWtgDetailList = MOCK_WTG_DETAILS;
      this.populateWtgConfigDetails(projectIndex, spvIndex);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  get filtersReady(): boolean {
    try {
      const v = this.yearlyDemandPlanForm.value;
      return !!v.planYear && !!v.customerId;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return false;
    }
  }

  get hasData(): boolean {
    try {
      return this.projects.some(p => p.spv && p.rows.length > 0);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return false;
    }
  }

  displayIndex(uid: number): number {
    try {
      return this.projects.findIndex(p => p.uid === uid) + 1;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  getProjectOptions(): { label: string; value: string }[] {
    try {
      return this.ds.getProjects(this.customer).map(c => ({ label: c, value: c }));
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return [];
    }
  }

  getSpvOptions(projectCode: string, myUid: number): { label: string; value: string; disabled?: boolean }[] {
    try {
      return this.ds.getSPVs(projectCode).map(spv => ({
        label: this.isSpvDisabled(spv, projectCode, myUid) ? `${spv} (used)` : spv,
        value: spv,
        disabled: this.isSpvDisabled(spv, projectCode, myUid)
      }));
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return [];
    }
  }

  isSpvDisabled(spv: string, projectCode: string, myUid: number): boolean {
    try {
      if (!projectCode) return false;
      return this.projects
        .filter(p => p.uid !== myUid && p.projectCode === projectCode && !!p.spv)
        .map(p => p.spv)
        .includes(spv);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return false;
    }
  }

  getMonthLabels(): string[] {
    try {
      return this.ds.getMonthLabels(this.year);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return [];
    }
  }

  get badgeSeverity(): 'success' | 'secondary' {
    try {
      return this.projects.some(p => p.spv) ? 'success' : 'secondary';
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 'secondary';
    }
  }

  get badgeText(): string {
    try {
      const n = this.projects.filter(p => p.spv).length;
      const r = this.projects.reduce((s, p) => s + p.rows.length, 0);
      const u = this.projects.reduce((s, p) =>
        s + p.rows.reduce((ss, row) => ss + row.mon.reduce((a, b) => a + b, 0), 0), 0);
      return n > 0 ? `${n} project(s) · ${r} rows · ${u} units` : 'No data entered';
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 'No data entered';
    }
  }

  onYearChange(event: any){
    try {
      /* month labels refresh automatically */
      console.log(event);

      this.selectedYear = event;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  onCustomerChange(customerId: number) {
    try {
      console.log(customerId);
      this.selectedCustomerId = customerId;
      this.fetchProjectsByCustomer();
      console.log(this.yearlyDemandPlanForm.value);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // Inserts a new, blank Project Entry at the TOP of the list, so the user can
  // fill it in immediately without scrolling. Each Project Entry keeps its own
  // persistent `entryNo` (assigned once, in createProjectForm, from the
  // ever-increasing `projectEntrySeq`), and that same value — never the
  // FormArray position — is what's shown on the card and used in validation
  // messages (see validatePayload). So inserting at the top only changes
  // *where* a card sits, never *which number* it displays, and a removed
  // entry's number is never reused by a later Add.
  addProject() {
    try {
      this.projectsArray.insert(0, this.createProjectForm());
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeProject(uid: number) {
    try {
      this.projects = this.projects.filter(p => p.uid !== uid);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // Removes a Project Entry from the UI and its FormGroup from projectsArray.
  // Also releases its per-project SPV cache entry (unless another remaining
  // entry still references the same projectId) so the Project becomes
  // selectable again and no stale SPV state is left behind.
  removeProjectEntry(projectIndex: number) {
    try {
      if (this.projectsArray.length <= 1) return;

      const project = this.projectsArray.at(projectIndex) as FormGroup;
      const projectId = project?.get('projectId')?.value;

      this.projectsArray.removeAt(projectIndex);

      const stillReferenced = this.projectsArray.controls.some(
        p => p.get('projectId')?.value === projectId
      );
      if (projectId !== null && projectId !== undefined && !stillReferenced) {
        delete this.spvListByProject[projectId];
      }
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  onProjectChange(uid: number, code: string) {
    try {
      console.log(code);
      this.selectedProjectId = Number(code);

      const p = this.projects.find(p => p.uid === uid);
      if (!p) return;
      p.projectCode = code; p.spv = ''; p.rows = [];

      this.fetchSPVsByProject();
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  isProjectSelected(projectIndex: number): boolean{
    try {
      const project = this.projectsArray.at(projectIndex) as FormGroup;
      return !!project.get('projectId')?.value;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return false;
    }
  }

  selectedProject(projectId: number, projectIndex: number){
    try {
      this.selectedProjectId = Number(projectId);

      const spvs = this.getSpvArray(projectIndex);

      spvs.clear();

      spvs.push(this.createSpvForm());

      this.fetchSPVsByProject(this.selectedProjectId);
    } catch(error) {
      console.log(error);

      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  selectedSpv(spvId: number, projectIndex: number, spvIndex: number){
    try {
      this.fetchWtgDetailsByProjectSPV(spvId, projectIndex, spvIndex);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMonthLabel(month: {key: string; label: string}): string{
    try {
      const year = this.yearlyDemandPlanForm.get('planYear')?.value;

      return year ? `${month.label} ${year}` : month.label;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return month?.label ?? '';
    }
  }

  monthFields = [
    { key: 'janQty', label: 'Jan' },
    { key: 'febQty', label: 'Feb' },
    { key: 'marQty', label: 'Mar' },
    { key: 'aprQty', label: 'Apr' },
    { key: 'mayQty', label: 'May' },
    { key: 'junQty', label: 'Jun' },
    { key: 'julQty', label: 'Jul' },
    { key: 'augQty', label: 'Aug' },
    { key: 'sepQty', label: 'Sep' },
    { key: 'octQty', label: 'Oct' },
    { key: 'novQty', label: 'Nov' },
    { key: 'decQty', label: 'Dec' }
  ];

  // Sum of the 12 monthly quantities for a single WTG row — this is the
  // "Units Planned" value for that WTG, also shown as the row's "Row Total".
  rowTotal(wtg: FormGroup): number{
    try {
      return this.monthFields.reduce((total, month) => {
        return total + Number(wtg?.get(month.key)?.value ?? 0);
      }, 0);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  qtyTotal(wtgs: FormArray){
    try {
      return wtgs.controls.reduce((total, wtg) => {
        return total + Number(wtg.get('totalQty')?.value)
      }, 0)
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  colTotal(wtgs: FormArray, monthKey: string): number{
    try {
      return wtgs.controls.reduce((total, wtg) => {
        return total + Number(wtg.get(monthKey)?.value ?? 0)
      }, 0)
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  getGrandTotal(projectIndex: number, spvIndex: number){
    try {
      const wtgs = this.getWtgsArray(projectIndex, spvIndex);

      return wtgs.controls.reduce((total, wtg) => {
        return total + this.rowTotal(wtg as FormGroup);
      }, 0);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  onSPVChange(uid: number, spv: string) {
    try {
      console.log(spv);
      const p = this.projects.find(p => p.uid === uid);
      if (!p) return;
      p.spv = spv;
      p.rows = this.ds.getDefaultRows(spv);

      // this.fetchWtgDetailsByProjectSPV(spv);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  addRow(uid: number) {
    try {
      const p = this.projects.find(p => p.uid === uid);
      if (p) p.rows = [...p.rows, { wtg: 'EN182', cap: 5, tower: '140HH-474T', blade: 'Big', qty: 0, mon: Array(12).fill(0) }];
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeRow(uid: number, ri: number) {
    try {
      const p = this.projects.find(p => p.uid === uid);
      if (p) p.rows = p.rows.filter((_, i) => i !== ri);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  updField(uid: number, ri: number, field: 'wtg' | 'cap' | 'tower' | 'blade' | 'qty', val: any) {
    try {
      const p = this.projects.find(p => p.uid === uid);
      if (!p || !p.rows[ri]) return;
      (p.rows[ri] as any)[field] = val;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  updMon(uid: number, ri: number, mi: number, val: number) {
    try {
      const p = this.projects.find(p => p.uid === uid);
      if (p && p.rows[ri]) p.rows[ri].mon[mi] = isNaN(val) ? 0 : val;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // rowTotal(row: WtgRow): number   { return (row.mon ?? []).reduce((a, b) => a + b, 0); }
  // colTotal(rows: WtgRow[], mi: number): number { return rows.reduce((s, r) => s + (r.mon[mi] ?? 0), 0); }
  // qtyTotal(rows: WtgRow[]): number  { return rows.reduce((s, r) => s + (r.qty ?? 0), 0); }
  // grandTotal(rows: WtgRow[]): number { return rows.reduce((s, r) => s + this.rowTotal(r), 0); }

  // Retained (legacy, currently unused by the template) — see class doc comment.
  get summaryProjects(): ProjectEntry[] {
    try {
      return this.projects.filter(p => p.spv && p.rows.length > 0);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return [];
    }
  }
  // get summaryTotalQty():   number { return this.summaryProjects.reduce((s, p) => s + this.qtyTotal(p.rows), 0); }
  // get summaryTotalUnits(): number { return this.summaryProjects.reduce((s, p) => s + this.grandTotal(p.rows), 0); }
  // summaryColTotal(mi: number): number { return this.summaryProjects.reduce((s, p) => s + this.colTotal(p.rows, mi), 0); }

  openSummary() {
    try {
      this.summaryVisible = true;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  closeSummary() {
    try {
      this.summaryVisible = false;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // ── Plan Summary: sourced entirely from yearlyDemandPlanForm ──

  get selectedPlanYear(): any {
    try {
      return this.yearlyDemandPlanForm.get('planYear')?.value;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return null;
    }
  }

  get selectedCustomerName(): string {
    try {
      const customerId = this.yearlyDemandPlanForm.get('customerId')?.value;
      const customer = this.customerInfoList.find(c => c.customerId === customerId);
      return customer?.customerName ?? '';
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return '';
    }
  }

  getProjectLabel(projectIndex: number): string {
    try {
      const project = this.projectsArray.at(projectIndex) as FormGroup;
      const projectId = project.get('projectId')?.value;
      const found = this.customerProjectList.find(p => p.projectId === projectId);
      return found?.projectCode ?? (projectId ? `Project ${projectId}` : '');
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return '';
    }
  }

  getSpvLabel(projectIndex: number, spvIndex: number): string {
    try {
      const spvGroup = this.getSpvArray(projectIndex).at(spvIndex) as FormGroup;
      const spvId = spvGroup.get('spvId')?.value;
      const list = this.getSpvOptionsForProject(projectIndex);
      const found = list.find((s: any) => s.customerSpvId === spvId);
      return found?.spvName ?? (spvId ? `SPV ${spvId}` : '');
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return '';
    }
  }

  // Count of Project Entries that actually have a project selected.
  get summaryProjectCount(): number {
    try {
      return this.projectsArray.controls.filter(p => p.get('projectId')?.value).length;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  // Flat, per-WTG rows built directly from the live form for the summary table.
  get summaryRows(): any[] {
    try {
      const rows: any[] = [];

      this.projectsArray.controls.forEach((_projectCtrl, pi) => {
        this.getSpvArray(pi).controls.forEach((_spvCtrl, si) => {
          this.getWtgsArray(pi, si).controls.forEach((wtgCtrl) => {
            const wtg = (wtgCtrl as FormGroup).value;
            rows.push({
              project: this.getProjectLabel(pi),
              spv: this.getSpvLabel(pi, si),
              wtg: wtg.wtgType,
              cap: wtg.capMw,
              tower: wtg.towerType,
              blade: wtg.bladeType,
              qty: wtg.totalQty,
              mon: this.monthFields.map(m => Number(wtg[m.key] ?? 0)),
              total: this.rowTotal(wtgCtrl as FormGroup)
            });
          });
        });
      });

      return rows;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return [];
    }
  }

  getTotalRows(): number {
    try {
      return this.summaryRows.length;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  // Grand total of Total Qty across every WTG row in the plan.
  get summaryGrandTotalQty(): number {
    try {
      return this.summaryRows.reduce((sum, row) => sum + Number(row.qty ?? 0), 0);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  summaryColGrandTotal(monthIndex: number): number {
    try {
      return this.summaryRows.reduce((sum, row) => sum + Number(row.mon[monthIndex] ?? 0), 0);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  // "Units Planned" — the sum of every WTG row's monthly quantities
  // (Jan..Dec) across the whole plan. Each row's own contribution is
  // `rowTotal()`, i.e. Jan+Feb+...+Dec for that WTG; this getter sums that
  // value across all rows currently in yearlyDemandPlanForm.
  get summaryGrandTotal(): number {
    try {
      return this.summaryRows.reduce((sum, row) => sum + Number(row.total ?? 0), 0);
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return 0;
    }
  }

  // ── Numeric conversion helpers ──

  // Converts to a number for optional/quantity fields; empty/invalid falls back
  // (0 for quantities, null when the field itself is optional).
  private toNumber(value: any, fallback: number | null = 0): number | null {
    try {
      if (value === null || value === undefined || value === '') return fallback;
      const n = Number(value);
      return isNaN(n) ? fallback : n;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return fallback;
    }
  }

  // Converts required IDs; returns null (never 0) when missing/invalid so
  // validation can distinguish "not selected" from a real id of 0.
  private toRequiredNumber(value: any): number | null {
    try {
      if (value === null || value === undefined || value === '') return null;
      const n = Number(value);
      return isNaN(n) ? null : n;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return null;
    }
  }

  // Builds the yearly-demand-plan/save request body from the live form value.
  private buildPayload(): any {
    try {
      const formValue = this.yearlyDemandPlanForm.value;

      return {
        planYear: this.toRequiredNumber(formValue.planYear),
        customerId: this.toRequiredNumber(formValue.customerId),
        projects: (formValue.projects ?? []).map((project: any) => ({
          projectId: this.toRequiredNumber(project.projectId),
          spvs: (project.spvs ?? []).map((spv: any) => ({
            spvId: this.toRequiredNumber(spv.spvId),
            wtgs: (spv.wtgs ?? []).map((wtg: any) => ({
              wtgConfigId: this.toRequiredNumber(wtg.wtgConfigId),
              wtgType: wtg.wtgType,
              capMw: this.toNumber(wtg.capMw, null),
              towerType: wtg.towerType,
              bladeType: wtg.bladeType,
              totalQty: this.toNumber(wtg.totalQty, 0),
              janQty: this.toNumber(wtg.janQty, 0),
              febQty: this.toNumber(wtg.febQty, 0),
              marQty: this.toNumber(wtg.marQty, 0),
              aprQty: this.toNumber(wtg.aprQty, 0),
              mayQty: this.toNumber(wtg.mayQty, 0),
              junQty: this.toNumber(wtg.junQty, 0),
              julQty: this.toNumber(wtg.julQty, 0),
              augQty: this.toNumber(wtg.augQty, 0),
              sepQty: this.toNumber(wtg.sepQty, 0),
              octQty: this.toNumber(wtg.octQty, 0),
              novQty: this.toNumber(wtg.novQty, 0),
              decQty: this.toNumber(wtg.decQty, 0),
            }))
          }))
        }))
      };
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return null;
    }
  }

  // Validates the already-converted payload: required ids + monthly-vs-total.
  // Returns the first problem found so the offending row can be identified.
  //
  // Project entries are displayed newest-first (inserted at index 0), so the
  // FormArray position (pi) is only used to LOCATE each project's data here —
  // the number shown to the user in a message is that project's persistent
  // `entryNo` (the same value rendered on its card as "Project Entry #N"),
  // never `pi + 1`. SPV entries aren't reordered, so `si + 1` (a live
  // position) still matches what's shown on screen for SPVs.
  private validatePayload(payload: any): { valid: boolean; message: string } {
    try {
      if (!payload) {
        return { valid: false, message: 'Unable to prepare the plan for submission. Please try again.' };
      }
      if (payload.planYear === null) {
        return { valid: false, message: 'Please select a Plan Year.' };
      }
      if (payload.customerId === null) {
        return { valid: false, message: 'Please select a Customer.' };
      }
      if (!payload.projects.length) {
        return { valid: false, message: 'Please add at least one project with SPV and WTG details.' };
      }

      const monthKeys = this.monthFields.map(m => m.key);

      for (let pi = 0; pi < payload.projects.length; pi++) {
        const project = payload.projects[pi];
        const entryNo = this.projectsArray.at(pi)?.get('entryNo')?.value ?? (pi + 1);

        if (project.projectId === null) {
          return { valid: false, message: `Please select a Project for Project entry ${entryNo}.` };
        }
        if (!project.spvs.length) {
          return { valid: false, message: `Please select an SPV for Project entry ${entryNo}.` };
        }

        for (let si = 0; si < project.spvs.length; si++) {
          const spv = project.spvs[si];
          if (spv.spvId === null) {
            return { valid: false, message: `Please select an SPV for Project entry ${entryNo}.` };
          }
          if (!spv.wtgs.length) {
            return { valid: false, message: `No WTG details found for Project entry ${entryNo}, SPV entry ${si + 1}.` };
          }

          for (let wi = 0; wi < spv.wtgs.length; wi++) {
            const wtg = spv.wtgs[wi];
            if (wtg.wtgConfigId === null) {
              return { valid: false, message: `Invalid WTG configuration in Project entry ${entryNo}, SPV entry ${si + 1}.` };
            }

            const monthlyTotal = monthKeys.reduce((sum, key) => sum + (wtg[key] ?? 0), 0);
            if (monthlyTotal > (wtg.totalQty ?? 0)) {
              return {
                valid: false,
                message: `Monthly quantity cannot exceed Total Quantity (Project entry ${entryNo}, SPV entry ${si + 1}, WTG ${wtg.wtgType ?? wi + 1}).`
              };
            }
          }
        }
      }

      return { valid: true, message: '' };
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return { valid: false, message: 'Unable to validate the plan. Please try again.' };
    }
  }

  // Resets yearlyDemandPlanForm and all related component state back to the
  // initial "nothing entered yet" state. Called ONLY after a successful save.
  private resetYearlyDemandPlanForm(): void {
    try {
      this.projectsArray.clear();
      this.projectsArray.push(this.createProjectForm());

      this.yearlyDemandPlanForm.patchValue({ planYear: null, customerId: null });

      this.selectedCustomerId = 0;
      this.selectedProjectId = 0;
      this.customerProjectList = [];
      this.projectSpvList = [];
      this.projectSpvWtgDetailList = [];
      this.spvListByProject = {};
      this.isSubmitting = false;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitPlan() {
    try {
      if (this.isSubmitting) return;

      const payload = this.buildPayload();
      const validation = this.validatePayload(payload);

      if (!validation.valid) {
        this.msgSvc.add({ severity: 'warn', summary: 'Validation Error', detail: validation.message, life: 4000 });
        return;
      }

      this.isSubmitting = true;

      this.apiService.saveYearlyDemandPlan(payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.msgSvc.add({ severity: 'success', summary: 'Success', detail: 'Yearly Demand Plan saved successfully.', life: 3000 });
          this.closeSummary();
          this.resetYearlyDemandPlanForm();
        },
        error: (err) => {
          this.isSubmitting = false;

          if (err.status === 400 && err.error?.detail) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail, life: 4000 });
          } else {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Failed to save Yearly Demand Plan. Please try again.', life: 4000 });
          }
        }
      });
    } catch (error) {
      console.log(error);
      this.isSubmitting = false;
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  trackByUid(_: number, p: ProjectEntry) {
    try {
      return p.uid;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return _;
    }
  }

  trackByIdx(i: number) {
    try {
      return i;
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return i;
    }
  }
}
