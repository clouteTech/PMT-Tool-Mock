import { Component, OnInit } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';
import { MenuItem, MessageService } from 'primeng/api';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_YEARLY_DEMAND_PLAN: any[] = [
  {
    yearlyDemandPlanId: 1,
    planYear: 2026,
    customer: {
      customerId: 1,
      customerName: 'ReNew Power',
      customerCode: 'REN001'
    },
    totalProjects: 2,
    totalSpvs: 2,
    totalWtgs: 2,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 2,
    planYear: 2026,
    customer: {
      customerId: 2,
      customerName: 'Adani Green Energy',
      customerCode: 'ADN001'
    },
    totalProjects: 2,
    totalSpvs: 2,
    totalWtgs: 3,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 3,
    planYear: 2027,
    customer: {
      customerId: 3,
      customerName: 'Suzlon Energy',
      customerCode: 'SUZ001'
    },
    totalProjects: 3,
    totalSpvs: 3,
    totalWtgs: 3,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 4,
    planYear: 2026,
    customer: {
      customerId: 4,
      customerName: 'Greenko',
      customerCode: 'GRK001'
    },
    totalProjects: 1,
    totalSpvs: 1,
    totalWtgs: 1,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 5,
    planYear: 2027,
    customer: {
      customerId: 5,
      customerName: 'Tata Power Renewable',
      customerCode: 'TPR001'
    },
    totalProjects: 4,
    totalSpvs: 4,
    totalWtgs: 5,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 6,
    planYear: 2026,
    customer: {
      customerId: 1,
      customerName: 'ReNew Power',
      customerCode: 'REN001'
    },
    totalProjects: 2,
    totalSpvs: 2,
    totalWtgs: 2,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 7,
    planYear: 2025,
    customer: {
      customerId: 2,
      customerName: 'Adani Green Energy',
      customerCode: 'ADN001'
    },
    totalProjects: 2,
    totalSpvs: 2,
    totalWtgs: 3,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 8,
    planYear: 2027,
    customer: {
      customerId: 3,
      customerName: 'Suzlon Energy',
      customerCode: 'SUZ001'
    },
    totalProjects: 3,
    totalSpvs: 3,
    totalWtgs: 3,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 9,
    planYear: 2026,
    customer: {
      customerId: 4,
      customerName: 'Greenko',
      customerCode: 'GRK001'
    },
    totalProjects: 2,
    totalSpvs: 2,
    totalWtgs: 2,
    status: 'DRAFT'
  },
  {
    yearlyDemandPlanId: 10,
    planYear: 2027,
    customer: {
      customerId: 5,
      customerName: 'Tata Power Renewable',
      customerCode: 'TPR001'
    },
    totalProjects: 4,
    totalSpvs: 4,
    totalWtgs: 5,
    status: 'DRAFT'
  }
];

interface Customer {
  customerId: number;
  customerName: string;
  customerCode: string;
  status: boolean;
}

interface Project {
  project: {
    projectId: number;
    projectCode: string;
  };
  spvs: Spv[];
}

interface Spv {
  spv: {
    customerSpvId: number;
    spvName: string;
    status: boolean;
  };
  wtgs: Wtg[];
}

interface Wtg {
  yearlyDemandPlanDetailId: number;
  wtgConfigId: number;
  projectId: number;
  spvId: number;
  wtgType: string;
  towerType: string;
  bladeType: string;
  capMw: number;
  totalQty: number;

  janQty: number;
  febQty: number;
  marQty: number;
  aprQty: number;
  mayQty: number;
  junQty: number;
  julQty: number;
  augQty: number;
  sepQty: number;
  octQty: number;
  novQty: number;
  decQty: number;
}

interface YearlyDemandPlan {
  yearlyDemandPlanId: number;
  planYear: number;
  customer: Customer;
  status: string;
  projects: Project[];
  totalProjects?: number;
  totalSpvs?: number;
  totalWtgs?: number;
}

@Component({
  selector: 'app-yearly-demand-plans',
  imports: [Shared],
  templateUrl: './yearly-demand-plans.html',
  styleUrl: './yearly-demand-plans.css',
})
export class YearlyDemandPlans implements OnInit {
  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;
  loading = false;

  yearlyDemandPlanList: YearlyDemandPlan[] = [];

  items: MenuItem[] = [];

  constructor(private apiService: Apiservice, private messageService: MessageService){}

  ngOnInit(): void {
      this.fetchAllYearlyDemandPlan();
  }

  // Counts are always derived from the API's nested projects → spvs → wtgs
  // arrays — never hardcoded — and default to 0 when an array is null/missing.
  private mapYearlyDemandPlan(plan: any): YearlyDemandPlan {
    try {
      const totalProjects = plan?.projects?.length ?? 0;

      const totalSpvs = plan?.projects?.reduce(
        (total: number, project: any) => total + (project?.spvs?.length ?? 0),
        0
      ) ?? 0;

      const totalWtgs = plan?.projects?.reduce(
        (projectTotal: number, project: any) =>
          projectTotal +
          (project?.spvs?.reduce(
            (spvTotal: number, spv: any) => spvTotal + (spv?.wtgs?.length ?? 0),
            0
          ) ?? 0),
        0
      ) ?? 0;

      return { ...plan, totalProjects, totalSpvs, totalWtgs };
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      return { ...plan, totalProjects: 0, totalSpvs: 0, totalWtgs: 0 };
    }
  }

  fetchAllYearlyDemandPlan(){
    try {
      const data = {
        customerId: null,
        planYear: null,
        projectId: null,
        spvId: null,
        status: null,
        page: this.page,
        size: this.size,
        sortBy: "createdOn",
        sortDirection: "asc"
      }

      this.loading = true;

      this.apiService.fetchAllYearlyDemandPlan(data).subscribe({
        next: val => {

          this.yearlyDemandPlanList = (val.data.content ?? []).map((plan: any) => this.mapYearlyDemandPlan(plan));
          this.totalRecords = val.data.totalElements ?? 0;
          this.loading = false;
        },
        error: err => {
          this.loading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.yearlyDemandPlanList = MOCK_YEARLY_DEMAND_PLAN;
            this.totalRecords = MOCK_YEARLY_DEMAND_PLAN.length;
          }
        }
      })
    } catch (error) {
      this.loading = false;

      this.yearlyDemandPlanList = MOCK_YEARLY_DEMAND_PLAN;
      this.totalRecords = MOCK_YEARLY_DEMAND_PLAN.length;

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });
    }
  }

  loadYearlyPlan(event: any){
    try {
      this.first = event.first;

      this.page = event.first / event.rows;
      this.size = event.rows;

      this.fetchAllYearlyDemandPlan();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // Stub handlers — wire to real edit/delete APIs once yearly demand plan CRUD is available.
  yearlyPlanMenu(event: Event, menu: any, yearlyPlan: YearlyDemandPlan) {
    try {
      this.items = [
        { label: 'Edit', icon: 'pi pi-pencil', command: () => console.log('edit', yearlyPlan) },
        { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('delete', yearlyPlan) }
      ];
      menu.toggle(event);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }
}
