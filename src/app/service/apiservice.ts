import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Apiservice {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient){}

  postMethod(url: any, params: any, config?: any){
    if (environment.useMockData) {
      // Demo mode: skip the real network call entirely so callers hit their
      // error/catch branch (and mock data fallback) immediately instead of
      // waiting on a timeout against an unreachable backend.
      return throwError(() => ({ status: 0, error: { detail: 'Demo mode: mock data' } }));
    }
    return this.http.post(this.baseUrl + url, params, config);
  }

  // Login API

  sendOtp(params: any): Observable<any>{
    return this.postMethod('auth/send-otp', params);
  }

  validateOtp(params: any): Observable<any>{
    return this.postMethod('auth/validate-otp', params);
  }

  // Blade Type Master

  fetchAllBladeTypes(params: any): Observable<any>{
    return this.postMethod('master/blade-type/get-all', params);
  }

  createBladeType(params: any): Observable<any>{
    return this.postMethod('master/blade-type/create', params);
  }

  updateBladeType(params: any){
    return this.postMethod('master/blade-type/update', params);
  }

  deleteBladeType(params: any): Observable<any>{
    return this.postMethod('master/blade-type/delete', params);
  }

  // Component Master

  fetchAllComponents(params: any): Observable<any>{
    return this.postMethod('master/wtg-component/get-all', params);
  }

  // Capacity Master

  fetchAllCapacities(params: any): Observable<any>{
    return this.postMethod('master/capacity/get-all', params);
  }

  createCapacity(params: any): Observable<any>{
    return this.postMethod('master/capacity/create', params);
  }

  updateCapacity(params: any): Observable<any>{
    return this.postMethod('master/capacity/update', params);
  }

  deleteCapacity(params: any): Observable<any>{
    return this.postMethod('master/capacity/delete', params);
  }

  // Zone Master

  fetchAllZones(params: any): Observable<any>{
    return this.postMethod('master/zone/get-all', params);
  }

  createZone(params: any): Observable<any>{
    return this.postMethod('master/zone/create', params);
  }

  updateZone(params: any): Observable<any>{
    return this.postMethod('master/zone/update', params);
  }

  deleteZone(params: any): Observable<any>{
    return this.postMethod('master/zone/delete', params);
  }


  // PPA-Type Master

  fetchAllPpaTypes(params: any): Observable<any>{
    return this.postMethod('master/ppa-type/get-all', params);
  }

  createPpaType(params: any){
    return this.postMethod('master/ppa-type/create', params);
  }

  updatePpaType(params: any){
    return this.postMethod('master/ppa-type/update', params);
  }

  deletePpaType(params: any){
    return this.postMethod('master/ppa-type/delete', params);
  }

  // Tower Type Master

  fetchAllTowerTypes(params: any): Observable<any>{
    return this.postMethod('master/tower-type/get-all', params);
  }

  createTowerType(params: any): Observable<any>{
    return this.postMethod('master/tower-type/create', params);
  }

  updateTowerType(params: any){
    return this.postMethod('master/tower-type/update', params);
  }

  deleteTowerType(params: any){
    return this.postMethod('master/tower-type/delete', params);
  }

  // Grid Connectivity Master

  fetchAllGridConnectivities(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/get-all', params);
  }

  createGridConnectivity(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/create', params);
  }

  updateGridConnectivity(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/update', params);
  }

  deleteGridConnectivity(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/delete', params);
  }

  // WTG Type Master

  fetchAllWTGTypes(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/get-all', params);
  }

  createWTGTypes(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/create', params);
  }

  updateWTGType(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/update', params);
  }

  deleteWTGType(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/delete', params);
  }

  // Department Master

  fetchAllDepartments(params: any): Observable<any>{
    return this.postMethod('master/organization/department/get-all', params);
  }

  createDepartments(params: any): Observable<any>{
    return this.postMethod('master/organization/department/create', params);
  }

  updateDepartments(params: any): Observable<any>{
    return this.postMethod('master/organization/department/update', params);
  }

  deleteDepartments(params: any): Observable<any>{
    return this.postMethod('master/organization/department/delete', params);
  }

  fetchDepartmentById(params: any): Observable<any>{
    return this.postMethod('master/organization/department/get', params);
  }

  fetchDepartmentInfo(params: any): Observable<any>{
    return this.postMethod('master/organization/department/info', params);
  }

  // Department - Cluster Mapping

  assignClustersToDepartment(params: any): Observable<any>{
    return this.postMethod('master/organization/department-cluster/assign-cluster', params);
  }

  removeClustersFromDepartment(params: any): Observable<any>{
    return this.postMethod('master/organization/department-cluster/remove-cluster', params);
  }

  // Company User Master

  fetchAllCompanyUsers(params: any): Observable<any>{
    return this.postMethod('auth/company-user/search', params);
  }

  createCompanyUsers(params: any): Observable<any>{
    return this.postMethod('auth/company-user/create', params);
  }

  updateCompanyUsers(params: any): Observable<any>{
    return this.postMethod('auth/company-user/update', params);
  }

  deleteCompanyUsers(params: any): Observable<any>{
    return this.postMethod('auth/company-user/delete', params);
  }

  // UserGroup Master

  fetchAllUserGroups(params: any): Observable<any>{
    return this.postMethod('auth/user-group/search', params);
  }

  createUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group/create', params);
  }

  updateUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group/update', params);
  }

  deleteUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group/delete', params);
  }

  fetchUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group/get', params);
  }

  fetchUserGroupInfo(params: any): Observable<any>{
    return this.postMethod('auth/user-group/info', params);
  }

  // Plant Master
  fetchAllPlants(params: any): Observable<any>{
    return this.postMethod('master/plant/get-all', params);
  }

  createPlant(params: any): Observable<any>{
    return this.postMethod('master/plant/create', params);
  }

  updatePlant(params: any): Observable<any>{
    return this.postMethod('master/plant/update', params);
  }

  deletePlant(params: any): Observable<any>{
    return this.postMethod('master/plant/delete', params);
  }

  fetchPlantInfo(params: any): Observable<any>{
    return this.postMethod('master/plant/info', params);
  }

  // Role Master

  fetchAllRoles(params: any): Observable<any>{
    return this.postMethod('auth/role/search', params);
  }

  fetchRoleInfo(params: any): Observable<any>{
    return this.postMethod('auth/role/info', params);
  }

  assignRolesToUsergroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group-role/assign-role', params);
  }

  removeRolesToUsergroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group-role/remove-role', params);
  }

  // Cluster Master

  fetchAllClusters(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/get-all', params);
  }

  createCluster(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/create', params);
  }

  updateCluster(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/update', params);
  }

  deleteCluster(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/delete', params);
  }

  fetchClusterInfo(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/info', params);
  }

  // User - User Group Mapping

  fetchUsersByUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/get-group-users', params);
  }

  fetchUserGroupsByUser(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/get-user-groups', params);
  }

  assignUserGroupsToUser(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/assign-group', params);
  }

  customerSearch(params: any): Observable<any>{
    return this.postMethod('master/customer/search', params);
  }
  customerGet(params: any): Observable<any>{
    return this.postMethod('master/customer/get', params);
  }
  createCustomer(params: any): Observable<any>{
    return this.postMethod('master/customer/create', params);
  }

  updateCustomer(params: any): Observable<any>{
    return this.postMethod('master/customer/update', params);
  }

  foundationExport(params: any): Observable<any>{
     return this.postMethod(
    'foundation/export',
    params,
    { responseType: 'blob' }
  );
  }
   foundationImport(params: any): Observable<any>{
    return this.postMethod('foundation/import', params);
  }

  spvAdd(params: any): Observable<any>{
    return this.postMethod('master/customer/spv/add', params);
  }
  spvUpdate(params: any): Observable<any>{
    return this.postMethod('master/customer/spv/update', params);
  }
  spvDelete(params: any): Observable<any>{
    return this.postMethod('master/customer/spv/delete', params);
  }
  userGroupInfo(params: any): Observable<any>{
    return this.postMethod('auth/user-group/info', params);
  }
  assignGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/assign-group', params);
  }

  removeUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/remove-group', params);
  }

  projectSearch(params: any): Observable<any>{
    return this.postMethod('project/search', params);
  }
  projectCreate(params: any): Observable<any>{
    return this.postMethod('project/create', params);
  }

  deleteProject(params: any): Observable<any>{
    return this.postMethod('project/delete', params);
  }

  foundationActivities(params: any): Observable<any>{
    return this.postMethod('foundation/activities', params);
  }
  zoneInfo(params: any): Observable<any>{
    return this.postMethod('master/zone/info', params);
  }
  wtgTypeInfo(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/info', params);
  }
  capacityInfo(params: any): Observable<any>{
    return this.postMethod('master/capacity/info', params);
  }
  towerTypeInfo(params: any): Observable<any>{
    return this.postMethod('master/tower-type/info', params);
  }
  bladeTypeInfo(params: any): Observable<any>{
    return this.postMethod('master/blade-type/info', params);
  }
  gridConnectivityInfo(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/info', params);
  }
  ppaTypeInfo(params: any): Observable<any>{
    return this.postMethod('master/ppa-type/info', params);
  }
  customerInfo(params: any): Observable<any>{
    return this.postMethod('master/customer/info', params);
  }
  clusterInfo(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/info', params);
  }
  companyUserInfo(params: any): Observable<any>{
    return this.postMethod('auth/company-user/info', params);
  }

  fetchCompanyUser(params: any): Observable<any>{
    return this.postMethod('auth/company-user/get', params);
  }

  customerSpvInfo(params: any): Observable<any>{
    return this.postMethod('master/customer/spv/info', params);
  }
  locationExport(params: any): Observable<any>{
    return this.postMethod(
    'project/location/export',
    params,
    { responseType: 'blob' }
    );
  }

  locationImport(params: any): Observable<any>{
    return this.postMethod('project/location/import', params);
  }

  // Installation

  installationList(params: any): Observable<any>{
    return this.http.get(`${this.baseUrl}installation/all`);
  }

  installationExport(params: any): Observable<any>{
    return this.postMethod('installation/export', params, { responseType: 'blob' });
  }

  installationImport(params: any): Observable<any>{
    return this.postMethod('installation/import', params);
  }

  installationCreate(params: any): Observable<any>{
    return this.postMethod('installation/create-with-details', params);
  }

  fetchInstallationActivities(params: any): Observable<any>{
    return this.postMethod('installation/activities', params);
  }

  updateInstallation(params: any): Observable<any>{
    return this.postMethod('installation/update', params);
  }

  // Commissioning

  commissioningExport(params: any): Observable<any>{
    return this.postMethod('commissioning/export', params, { responseType: 'blob' });
  }

  commissioningImport(params: any): Observable<any>{
    return this.postMethod('commissioning/import', params);
  }

  // project

  fetchProjectDetails(params: any): Observable<any>{
    return this.postMethod('project/get', params);
  }

  updateProjectDetails(params: any): Observable<any>{
    return this.postMethod('project/update-details', params);
  }

  updateProjectSpv(params: any): Observable<any>{
    return this.postMethod('project/spv/update', params);
  }

  updatePrjSpvWtgConfig(params: any): Observable<any>{
    return this.postMethod('project/config/update', params);
  }

  deleteProjectSpv(params: any): Observable<any>{
    return this.postMethod('project/spv/delete', params);
  }

  deletePrjSpvWtg(params: any): Observable<any>{
    return this.postMethod('project/config/delete', params);
  }

  // project location 

  fetchPrjLocationInfo(params: any): Observable<any>{
    return this.postMethod('project/location/info', params);
  }

  createPrjWTGLocation(params: any): Observable<any>{
    return this.postMethod('project/location/create', params);
  }

  updatePrjWTGLocation(params: any): Observable<any>{
    return this.postMethod('project/location/update', params);
  }

  deletePrjWTGLocation(params: any): Observable<any>{
    return this.postMethod('project/location/delete', params);
  }

  // Foundation

  createFoundationSoilTest(params: any): Observable<any>{
    return this.postMethod('foundation/activity/soil-test', params);
  }

  createFoundationExcavation(params: any): Observable<any>{
    return this.postMethod('foundation/activity/excavation', params);
  }

  createFoundationPCC(params: any): Observable<any>{
    return this.postMethod('foundation/activity/pcc', params);
  }

  createFoundationFlange(params: any): Observable<any>{
    return this.postMethod('foundation/activity/flange', params);
  }

  createFoundationReinforcement(params: any): Observable<any>{
    return this.postMethod('foundation/activity/reinforcement', params);
  }

  createFoundationEarthing(params: any): Observable<any>{
    return this.postMethod('foundation/activity/earthing', params);
  }

  createFoundationShuttering(params: any): Observable<any>{
    return this.postMethod('foundation/activity/shuttering', params);
  }

  createFoundationRaftCasting(params: any): Observable<any>{
    return this.postMethod('foundation/activity/raft-casting', params);
  }

  createFoundationPedestalCasting(params: any): Observable<any>{
    return this.postMethod('foundation/activity/pedestal-casting', params);
  }

  createFoundationCubeTest(params: any): Observable<any>{
    return this.postMethod('foundation/activity/foundation-cube-test', params);
  }

  createFoundationGrouting(params: any): Observable<any>{
    return this.postMethod('foundation/activity/grouting', params);
  }

  createFoundationGroutingCubeTest(params: any): Observable<any>{
    return this.postMethod('foundation/activity/grouting-cube-test', params);
  }

  createFoundationBackfilling(params: any): Observable<any>{
    return this.postMethod('foundation/activity/backfilling', params);
  }

  createFoundationApproachRoad(params: any): Observable<any>{
    return this.postMethod('foundation/activity/approach-road', params);
  }

  createFoundationCranePlatform(params: any){
    return this.postMethod('foundation/activity/crane-platform', params);
  }

  createFoundationLocationClearance(params: any){
    return this.postMethod('foundation/activity/location-clearance', params);
  }

  // Project Crane Detail

  fetchPrjCraneDetails(params: any): Observable<any>{
    return this.postMethod('project/crane-detail/get-project-cranes', params);
  }

  // Project WTG Detail

  fetchPrjWTGDetails(params: any): Observable<any>{
    return this.postMethod('project/wtg/get-all', params);
  }

  // Crane Master

  fetchAllCranes(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane/get-all', params);
  }

  createCrane(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane/create', params);
  }

  updateCrane(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane/update', params);
  }

  deleteCrane(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane/delete', params);
  }

  fetchCraneInfo(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane/info', params);
  }

  // Crane Supplier Master

  fetchAllCraneSuppliers(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier/get-all', params);
  }

  createCraneSupplier(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier/create', params);
  }

  updateCraneSupplier(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier/update', params);
  }

  deleteCraneSupplier(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier/delete', params);
  }

  fetchSupplierInfo(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier/info', params);
  }

  // Yearly Demand Plan

  fetchAllYearlyDemandPlan(params: any): Observable<any>{
    return this.postMethod('yearly-demand-plan/search', params);
  }

  fetchProjectsByCustomer(params: any): Observable<any>{
    return this.postMethod('yearly-demand-plan/projects-by-customer', params);
  }

  fetchSPVsByProject(params: any): Observable<any>{
    return this.postMethod('yearly-demand-plan/spvs', params);
  }

  fetchWtgDetailsByProjectSPV(params: any): Observable<any>{
    return this.postMethod('yearly-demand-plan/wtg-details', params);
  }

  saveYearlyDemandPlan(params: any): Observable<any>{
    return this.postMethod('yearly-demand-plan/save', params);
  }

  // Monthly Demand Plan
  
  fetchAllMonthlyDemandPlan(params: any): Observable<any>{
    return this.postMethod('monthly-demand-plan/search', params);
  }

  fetchMonthlyDetailsFromYearlyPlan(params: any): Observable<any>{
    return this.postMethod('monthly-demand-plan/component-requirements', params);
  }

  fetchAllComponentSerialList(params: any): Observable<any>{
    return this.postMethod('component-productions/get-serial-list', params);
  }

  // User - Plant Mapping

  assignPlantToUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-plant/assign', params);
  }

  removePlantFromUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-plant/remove', params);
  }

  fetchPlantsByUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-plant/get-user-plants', params);
  }

  fetchActivePlantsFromUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-plant/get-active-user-plants', params);
  }

  // User - Cluster Mapping

  assignClustersToUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-cluster/assign', params);
  }

  removeClustersFromUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-cluster/remove', params)
  }

  fetchActiveClustersFromUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-cluster/get-active-user-clusters', params);
  }

  // User - Department Mapping

  assignDepartmentsToUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-department/assign', params); 
  }

  removeDepartmentsFromUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-department/remove', params);
  }

  fetchActiveDepartmentsFromUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-department/get-active-user-departments', params);
  }

  // User - Component Mapping

  assignComponentsToUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-component/assign', params);
  }

  removeComponentsFromUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-component/remove', params);
  }

  fetchActiveComponentsFromUser(params: any): Observable<any>{
    return this.postMethod('mapping/user-component/get-active-user-components', params);
  }

  // Crane - Supplier Mapping

  assignSuppliersToCrane(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier-mapping/assign-supplier', params);
  }

  removeSuppliersFromCrane(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier-mapping/remove-supplier', params);
  }

  fetchCraneSuppliers(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier-mapping/get-crane-suppliers', params);
  }

  fetchCranesBySupplier(params: any): Observable<any>{
    return this.postMethod('master/equipment/crane-supplier-mapping/get-supplier-cranes', params);
  }

  // Project Crane Details

  fetchAllProjectCraneDetails(params: any): Observable<any>{
    return this.postMethod('project/crane-detail/get-all', params);
  }

  assignPrjCraneDetail(params: any): Observable<any>{
    return this.postMethod('project/crane-detail/create', params);
  }

  updatePrjCraneDetail(params: any): Observable<any>{
    return this.postMethod('project/crane-detail/update', params);
  }

  deletePrjCraneDetail(params: any): Observable<any>{
    return this.postMethod('project/crane-detail/delete', params);
  }

  // auth/user-user-group/remove-group

  // auth/company-user/get
}