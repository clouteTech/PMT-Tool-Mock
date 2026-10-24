import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./demand-plan/demand-plan.component').then(m => m.DemandPlanComponent),
    canActivate: [authGuard]
  },
  {
    path: 'create-project',
    loadComponent: () => import('./create-project/create-project.component').then(m => m.CreateProjectComponent),
    canActivate: [authGuard]
  },
  {
    path: 'componentAllocation',
    loadComponent: () => import('./component-allocation/component-allocation').then(m => m.ComponentAllocation),
    canActivate: [authGuard]
  },
   {
    path: 'allocationApproval',
    loadComponent: () => import('./allocation-approval/allocation-approval').then(m => m.AllocationApproval),
    canActivate: [authGuard]
  },
  {
    path: 'plantAllocation',
    loadComponent: () => import('./plant-allocation/plant-allocation').then(m => m.PlantAllocation),
    canActivate: [authGuard]
  },
  {
    path: 'yearly-demand-plans',
    loadComponent: () => import('./yearly-demand-plans/yearly-demand-plans').then(m => m.YearlyDemandPlans),
    canActivate: [authGuard]
  },
  {
    path: 'yearly-demand-plans/create',
    loadComponent: () => import('./demand-plan/demand-plan.component').then(m => m.DemandPlanComponent),
    canActivate: [authGuard]
  },
  {
    path: 'monthlyDemandPlan',
    loadComponent: () => import('./monthly-plan/monthly-plan').then(m => m.MonthlyPlan),
    canActivate: [authGuard]
  },
  {
    path: 'plan/:id/component-serial',
    loadComponent: () => import('./component-serial/component-serial').then(m => m.ComponentSerial),
    canActivate: [authGuard]
  },
   {
    path: 'WTGProduction',
    loadComponent: () => import('./wtg-production/wtg-production').then(m => m.WTGProduction),
    canActivate: [authGuard]
  },
  {
    path: 'wtg-quality',
    loadComponent: () => import('./wtg-quality/wtg-quality').then(m => m.WtgQuality),
    canActivate: [authGuard]
  },
  {
    path: 'wtg-dispatch',
    loadComponent: () => import('./wtg-dispatch/wtg-dispatch').then(m => m.WtgDispatch),
    canActivate: [authGuard]
  },
  {
    path: 'wtg-dispatch/plan',
    loadComponent: () => import('./wtg-dispatch-form/wtg-dispatch-form').then(m => m.WtgDispatchForm),
    canActivate: [authGuard]
  },
  {
    path: 'foundation',
    loadComponent: () => import('./foundation/foundation').then(m => m.Foundation),
    canActivate: [authGuard]
  },
  {
    path: 'wtg-receiving',
    loadComponent: () => import('./wtg-receiving-project-summary/wtg-receiving-project-summary').then(m => m.WtgReceivingProjectSummary),
    canActivate: [authGuard]
  },
  {
    path: 'wtg-receiving/view',
    loadComponent: () => import('./wtg-receiving/wtg-receiving').then(m => m.WtgReceiving),
    canActivate: [authGuard]
  },
  {
    path: 'commissioning',
    loadComponent: () => import('./commisioning/commisioning').then(m => m.Commisioning),
    canActivate: [authGuard]
  },
  {
    path: 'components',
    loadComponent: () => import('./masters/components/components').then(m => m.Components),
    canActivate: [authGuard]
  },
  {
    path: 'tower-types',
    loadComponent: () => import('./masters/tower-types/tower-types').then(m => m.TowerTypes),
    canActivate: [authGuard]
  },
  {
    path: 'blade-types',
    loadComponent: () => import('./masters/blade-types/blade-types').then(m => m.BladeTypes),
    canActivate: [authGuard]
  },
  {
    path: 'wtg-types',
    loadComponent: () => import('./masters/wtg-types/wtg-types').then(m => m.WtgTypes),
    canActivate: [authGuard]
  },
  {
    path: 'grid-connectivities',
    loadComponent: () => import('./masters/grid-connectivities/grid-connectivities').then(m => m.GridConnectivities),
    canActivate: [authGuard]
  },
  {
    path: 'wtg-capacities',
    loadComponent: () => import('./masters/wtg-capacities/wtg-capacities').then(m => m.WtgCapacities),
    canActivate: [authGuard]
  },
  {
    path: 'ppa-types',
    loadComponent: () => import('./masters/ppa-types/ppa-types').then(m => m.PpaTypes),
    canActivate: [authGuard]
  },
  {
    path: 'plants',
    loadComponent: () => import('./masters/plants/plants').then(m => m.Plants),
    canActivate: [authGuard]
  },
  {
    path: 'plants/production-config',
    loadComponent: () => import('./masters/plant-wise-production-config/plant-wise-production-config').then(m => m.PlantWiseProductionConfig),
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    loadComponent: () => import('./masters/customers/customers').then(m => m.Customers),
    canActivate: [authGuard]
  },
  {
    path: 'customers/add',
    loadComponent: () => import('./masters/add-customer/add-customer').then(m => m.AddCustomer),
    canActivate: [authGuard]
  },
  {
    path: 'customers/spv',
    loadComponent: () => import('./masters/customer-spv-list/customer-spv-list').then(m => m.CustomerSpvList),
    canActivate: [authGuard]
  },
  {
    path: 'customers/quality-config',
    loadComponent: () => import('./masters/customer-wise-quality-config/customer-wise-quality-config').then(m => m.CustomerWiseQualityConfig),
    canActivate: [authGuard]
  },
  {
    path: 'zones',
    loadComponent: () => import('./masters/zones/zones').then(m => m.Zones),
    canActivate: [authGuard]
  },
  {
    path: 'cranes',
    loadComponent: () => import('./masters/cranes/cranes').then(m => m.Cranes),
    canActivate: [authGuard]
  },
  {
    path: 'crane-suppliers',
    loadComponent: () => import('./masters/crane-suppliers/crane-suppliers').then(m => m.CraneSuppliers),
    canActivate: [authGuard]
  },
  {
    path: 'departments',
    loadComponent: () => import('./masters/departments/departments').then(m => m.Departments),
    canActivate: [authGuard]
  },
  {
    path: 'clusters',
    loadComponent: () => import('./masters/clusters/clusters').then(m => m.Clusters),
    canActivate: [authGuard]
  },
  {
    path: 'company-users',
    loadComponent: () => import('./masters/company-users/company-users').then(m => m.CompanyUsers),
    canActivate: [authGuard]
  },
  {
    path: 'user-groups',
    loadComponent: () => import('./masters/user-groups/user-groups').then(m => m.UserGroups),
    canActivate: [authGuard]
  },
  {
    path: 'roles',
    loadComponent: () => import('./masters/roles/roles').then(m => m.Roles),
    canActivate: [authGuard]
  },
  {
    path: 'installation',
    loadComponent: () => import('./installation/installation').then(m => m.Installation),
    canActivate: [authGuard]
  },
  {
    path: 'project/:id/cranes',
    loadComponent: () => import('./assign-project-crane-details/assign-project-crane-details').then(m => m.AssignProjectCraneDetails),
    canActivate: [authGuard]
  },
  {
    path: 'project/:projectId/wtg-location',
    loadComponent: () => import('./project-wtg-location-details/project-wtg-location-details').then(m => m.ProjectWtgLocationDetails),
    canActivate: [authGuard]
  },
   {
    path: 'plant-allocation',
    loadComponent: () =>
      import('./allocation/plant-allocation/plant-allocation')
        .then(m => m.PlantAllocation),
    canActivate: [authGuard]
  },
  {
    path: 'view-allocation',
    loadComponent: () =>
      import('./allocation/view-allocation/view-allocation')
        .then(m => m.ViewAllocation),
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'login' }
];