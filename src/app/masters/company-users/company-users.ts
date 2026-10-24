import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
// assignedPlantId / assignedClusterIds / assignedDepartmentIds / assignedComponentIds drive the
// Assign/Remove mapping modals in demo mode (userGroups already carries the assigned groups).
const MOCK_COMPANY_USERS: any[] = [
  { userId: 1, userName: 'Sanjay Kumar', email: 'sanjay.kumar@windtechindia.com', userGroups: [{ userGroupId: 1, groupName: 'Super Admin Group' }], status: true, assignedPlantId: 1, assignedClusterIds: [1, 7], assignedDepartmentIds: [4], assignedComponentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { userId: 2, userName: 'Ananya Iyer', email: 'ananya.iyer@windtechindia.com', userGroups: [{ userGroupId: 2, groupName: 'Plant Operations Group' }], status: true, assignedPlantId: 2, assignedClusterIds: [3, 6], assignedDepartmentIds: [1], assignedComponentIds: [1, 2] },
  { userId: 3, userName: 'Sivakumar R', email: 'sivakumar.r@windtechindia.com', userGroups: [{ userGroupId: 3, groupName: 'Project Management Group' }], status: false, assignedPlantId: 3, assignedClusterIds: [4, 5], assignedDepartmentIds: [4], assignedComponentIds: [3, 4] },
  { userId: 4, userName: 'Kayalvizhi M', email: 'kayalvizhi.m@windtechindia.com', userGroups: [{ userGroupId: 4, groupName: 'Quality Control Group' }], status: true, assignedPlantId: 4, assignedClusterIds: [4], assignedDepartmentIds: [2], assignedComponentIds: [5, 6] },
  { userId: 5, userName: 'Rakesh Patel', email: 'rakesh.patel@windtechindia.com', userGroups: [{ userGroupId: 5, groupName: 'Logistics Group' }], status: true, assignedPlantId: 5, assignedClusterIds: [1, 7], assignedDepartmentIds: [3], assignedComponentIds: [7, 8] },
  { userId: 6, userName: 'Meera Shah', email: 'meera.shah@windtechindia.com', userGroups: [{ userGroupId: 6, groupName: 'Finance Group' }], status: true, assignedPlantId: 6, assignedClusterIds: [1], assignedDepartmentIds: [6], assignedComponentIds: [] },
  { userId: 7, userName: 'Vikram Singh', email: 'vikram.singh@windtechindia.com', userGroups: [{ userGroupId: 7, groupName: 'HR Group' }], status: false, assignedPlantId: 7, assignedClusterIds: [2], assignedDepartmentIds: [7], assignedComponentIds: [] },
  { userId: 8, userName: 'Deepa Nair', email: 'deepa.nair@windtechindia.com', userGroups: [{ userGroupId: 8, groupName: 'Site Engineering Group' }], status: true, assignedPlantId: 8, assignedClusterIds: [9], assignedDepartmentIds: [5], assignedComponentIds: [9, 10] },
  { userId: 9, userName: 'Suresh Reddy', email: 'suresh.reddy@windtechindia.com', userGroups: [{ userGroupId: 9, groupName: 'Store & Inventory Group' }], status: true, assignedPlantId: 9, assignedClusterIds: [], assignedDepartmentIds: [8], assignedComponentIds: [8] },
  { userId: 10, userName: 'Arjun Mehta', email: 'arjun.mehta@windtechindia.com', userGroups: [], status: true, assignedPlantId: 10, assignedClusterIds: [], assignedDepartmentIds: [], assignedComponentIds: [] },
];

const MOCK_USER_GROUP_INFO: any[] = [
  { userGroupId: 1, groupName: 'Super Admin Group' },
  { userGroupId: 2, groupName: 'Plant Operations Group' },
  { userGroupId: 3, groupName: 'Project Management Group' },
  { userGroupId: 4, groupName: 'Quality Control Group' },
  { userGroupId: 5, groupName: 'Logistics Group' },
  { userGroupId: 6, groupName: 'Finance Group' },
  { userGroupId: 7, groupName: 'HR Group' },
  { userGroupId: 8, groupName: 'Site Engineering Group' },
  { userGroupId: 9, groupName: 'Store & Inventory Group' },
  { userGroupId: 10, groupName: 'Read Only Viewers' },
];

const MOCK_PLANT_INFO: any[] = [
  { id: 1, plant: 'Plant Chennai', location: 'Chennai, Tamil Nadu', plantManager: 'Sanjay Kumar' },
  { id: 2, plant: 'Plant Pune', location: 'Pune, Maharashtra', plantManager: 'Ananya Iyer' },
  { id: 3, plant: 'Plant Trichy', location: 'Tiruchirappalli, Tamil Nadu', plantManager: 'Sivakumar R' },
  { id: 4, plant: 'Plant Tuticorin', location: 'Thoothukudi, Tamil Nadu', plantManager: 'Kayalvizhi M' },
  { id: 5, plant: 'Plant Vadodara', location: 'Vadodara, Gujarat', plantManager: 'Rakesh Patel' },
  { id: 6, plant: 'Plant Kutch', location: 'Bhuj, Gujarat', plantManager: 'Meera Shah' },
  { id: 7, plant: 'Plant Jaisalmer', location: 'Jaisalmer, Rajasthan', plantManager: 'Vikram Singh' },
  { id: 8, plant: 'Plant Bengaluru', location: 'Bengaluru, Karnataka', plantManager: 'Deepa Nair' },
  { id: 9, plant: 'Plant Hyderabad', location: 'Hyderabad, Telangana', plantManager: 'Suresh Reddy' },
  { id: 10, plant: 'Plant Kutch Warehouse', location: 'Bhuj, Gujarat', plantManager: 'Arjun Mehta' },
];

const MOCK_CLUSTER_INFO: any[] = [
  { clusterId: 1, clusterName: 'Kutch Cluster', clusterCode: 'KCH01' },
  { clusterId: 2, clusterName: 'Jaisalmer Cluster', clusterCode: 'JSM01' },
  { clusterId: 3, clusterName: 'Chitradurga Cluster', clusterCode: 'CTD01' },
  { clusterId: 4, clusterName: 'Tuticorin Cluster', clusterCode: 'TUT01' },
  { clusterId: 5, clusterName: 'Kayathar Cluster', clusterCode: 'KYT01' },
  { clusterId: 6, clusterName: 'Coimbatore Cluster', clusterCode: 'CBE01' },
  { clusterId: 7, clusterName: 'Bhuj Cluster', clusterCode: 'BHJ01' },
  { clusterId: 8, clusterName: 'Kayamkulam Cluster', clusterCode: 'KYM01' },
  { clusterId: 9, clusterName: 'Anantapur Cluster', clusterCode: 'ATP01' },
  { clusterId: 10, clusterName: 'Devgadh Baria Cluster', clusterCode: 'DGB01' },
];

const MOCK_DEPARTMENT_INFO: any[] = [
  { departmentId: 1, departmentName: 'Manufacturing' },
  { departmentId: 2, departmentName: 'Quality Assurance' },
  { departmentId: 3, departmentName: 'Logistics & Supply Chain' },
  { departmentId: 4, departmentName: 'Project Management' },
  { departmentId: 5, departmentName: 'Site Installation' },
  { departmentId: 6, departmentName: 'Finance & Accounts' },
  { departmentId: 7, departmentName: 'Human Resources' },
  { departmentId: 8, departmentName: 'Procurement' },
  { departmentId: 9, departmentName: 'Engineering & Design' },
  { departmentId: 10, departmentName: 'Maintenance & Service' },
];

const MOCK_COMPONENT_INFO: any[] = [
  { componentId: 1, componentName: 'Topflange' },
  { componentId: 2, componentName: 'Bottomflange' },
  { componentId: 3, componentName: 'Blade' },
  { componentId: 4, componentName: 'Nacelle' },
  { componentId: 5, componentName: 'Hub' },
  { componentId: 6, componentName: 'Tower' },
  { componentId: 7, componentName: 'Converter Panel' },
  { componentId: 8, componentName: 'Site Accessories' },
  { componentId: 9, componentName: 'SCADA' },
  { componentId: 10, componentName: 'Generator' },
];

@Component({
  selector: 'app-company-users',
  imports: [Shared],
  templateUrl: './company-users.html',
  styleUrl: './company-users.css',
})
export class CompanyUsers implements OnInit {
  showCompanyUserModal = false;
  assignUserGroupModal = false;
  showPlantMappingModal = false;
  showClusterModal = false;
  showDepartmentModal = false;
  showComponentModal = false;

  items: MenuItem[] = [];

  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  selectedCompanyUser: any;

  companyUserList: any[] = [];
  userGroupList:any[] = [];
  assignedUserGroups: any[] = [];
  userGroupSearchQuery = '';
  userGroupModalLoading = false;
  plantInfoList: any[] = [];
  assignedPlant: any | null = null;
  clusterInfoList: any[] = [];
  departmentInfoList: any[] = [];
  assignedActiveClusters: any[] = [];
  assignedActiveDepartments: any[] = [];
  componentList: any[] = [];
  assignedActiveComponents: any[] = [];
  plantSearchQuery = '';
  plantModalLoading = false;
  clusterSearchQuery = '';
  clusterModalLoading = false;
  departmentSearchQuery = '';
  departmentModalLoading = false;
  componentSearchQuery = '';
  componentModalLoading = false;

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  companyUserForm = this.fb.group({
    userId: [0],
    userName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/),
      Validators.maxLength(80)]],
    status: [false]
  })

  get userName(){
    return this.companyUserForm.get('userName');
  }

  get email(){
    return this.companyUserForm.get('email');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllCompanyUser();
  }

  fetchAllCompanyUser(){
    try {
      const data = {
        search: null,
        status: null,
        page: this.page,
        size: this.size,
        sortBy: 'createdOn',
        sortDirection: 'asc'
      }

      this.apiService.fetchAllCompanyUsers(data).subscribe({
        next: val => {
          this.companyUserList = val.data.content;
          this.totalRecords = val.data.totalElements;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.companyUserList = MOCK_COMPANY_USERS;
            this.totalRecords = MOCK_COMPANY_USERS.length;
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      this.companyUserList = MOCK_COMPANY_USERS;
      this.totalRecords = MOCK_COMPANY_USERS.length;
    }
  }

  submitCompanyUserForm(){
    try {
      if (this.companyUserForm.valid) {  
        if (!this.selectedCompanyUser) {   
          const data = this.companyUserForm.value;
    
          this.apiService.createCompanyUsers(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Company User' });
              this.showCompanyUserModal = false;
              this.fetchAllCompanyUser();
            },
            error: err => {
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createCompanyUserLocally(data);
              }
            }
          })
        } else {
          const data = this.companyUserForm.value;
  
          this.apiService.updateCompanyUsers(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Company User' });
              this.showCompanyUserModal = false;
              this.fetchAllCompanyUser();
            },
            error: err => {
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateCompanyUserLocally(data);
              }
            }
          })
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill All Required field' });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ── Demo mode CRUD (operates on the in-memory mock list when the backend is unreachable) ──

  private createCompanyUserLocally(data: any){
    const newId = Math.max(0, ...this.companyUserList.map(u => u.userId || 0)) + 1;
    const newUser = { ...data, userId: newId, userGroups: [], assignedPlantId: null, assignedClusterIds: [], assignedDepartmentIds: [], assignedComponentIds: [] };
    this.companyUserList = [newUser, ...this.companyUserList];
    this.totalRecords = this.companyUserList.length;

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Company User' });
    this.showCompanyUserModal = false;
  }

  private updateCompanyUserLocally(data: any){
    this.companyUserList = this.companyUserList.map(u => u.userId === data.userId ? { ...u, ...data } : u);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Company User' });
    this.showCompanyUserModal = false;
  }

  isUserGroupAssigned(userGroupId: number): boolean{
    return this.assignedUserGroups.some(
      group => group.userGroupId === userGroupId
    )
  }

  toggleUserGroup(usergroup: any){
    if (this.isUserGroupAssigned(usergroup.userGroupId)) {
      this.removeUserGroups(usergroup);
    } else {
      this.assignUserGroups(usergroup);
    }
  }

  getUserGroupInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAssignedUserGroups(){
    const query = this.userGroupSearchQuery.trim().toLowerCase();
    return this.userGroupList.filter(g =>
      this.isUserGroupAssigned(g.userGroupId) &&
      (!query || g.groupName?.toLowerCase().includes(query))
    );
  }

  filteredAvailableUserGroups(){
    const query = this.userGroupSearchQuery.trim().toLowerCase();
    return this.userGroupList.filter(g =>
      !this.isUserGroupAssigned(g.userGroupId) &&
      (!query || g.groupName?.toLowerCase().includes(query))
    );
  }

  isPlantAssigned(plantId: number): boolean {
    return this.assignedPlant?.plantId === plantId;
  }

  isAssignDisabled(plantId: number): boolean {
    return this.assignedPlant !== null &&
          this.assignedPlant?.plantId !== plantId;
  }

  togglePlant(plant: any){
    try {
      if (this.isPlantAssigned(plant.id)) {
        this.removePlantFromUser(plant);
      } else {
        this.assignPlantToUser(plant);
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMappingInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAvailablePlants(){
    const query = this.plantSearchQuery.trim().toLowerCase();
    return this.plantInfoList.filter(p =>
      !this.isPlantAssigned(p.id) &&
      (!query || p.plant?.toLowerCase().includes(query))
    );
  }

  getPlantHint(plant: any): string {
    return [plant?.location, plant?.plantManager].filter(v => v).join(' · ');
  }

  isClusterAssigned(clusterId: number){
    return this.assignedActiveClusters.some(
      cluster => cluster.clusterId === clusterId
    )
  }

  toggleCluster(cluster: any){
    try {
      if (this.isClusterAssigned(cluster.clusterId)) {
        this.removeClustersFromUser(cluster);
      } else {
        this.assignClustersToUser(cluster);
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  filteredAssignedClusters(){
    const query = this.clusterSearchQuery.trim().toLowerCase();
    return this.clusterInfoList.filter(c =>
      this.isClusterAssigned(c.clusterId) &&
      (!query || c.clusterName?.toLowerCase().includes(query) || c.clusterCode?.toLowerCase().includes(query))
    );
  }

  filteredAvailableClusters(){
    const query = this.clusterSearchQuery.trim().toLowerCase();
    return this.clusterInfoList.filter(c =>
      !this.isClusterAssigned(c.clusterId) &&
      (!query || c.clusterName?.toLowerCase().includes(query) || c.clusterCode?.toLowerCase().includes(query))
    );
  }

  fetchActiveClustersFromUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }

      this.apiService.fetchActiveClustersFromUser(data).subscribe({
        next: val => {
          this.assignedActiveClusters = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            const user = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);
            const ids: number[] = user?.assignedClusterIds ?? [];
            this.assignedActiveClusters = MOCK_CLUSTER_INFO.filter(c => ids.includes(c.clusterId));
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  assignClustersToUser(cluster: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        clusterId: cluster.clusterId
      }

      this.apiService.assignClustersToUser(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cluster Assigned Successfully' });
          this.fetchActiveClustersFromUser();
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleClusterLocally(cluster.clusterId, true);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeClustersFromUser(cluster: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        clusterId: cluster.clusterId
      }
      this.apiService.removeClustersFromUser(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cluster Removed Successfully' });
          this.fetchActiveClustersFromUser();
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleClusterLocally(cluster.clusterId, false);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  private toggleClusterLocally(clusterId: number, assign: boolean){
    this.companyUserList = this.companyUserList.map(u => {
      if (u.userId !== this.selectedCompanyUser.userId) return u;
      const ids: number[] = u.assignedClusterIds ?? [];
      const nextIds = assign
        ? (ids.includes(clusterId) ? ids : [...ids, clusterId])
        : ids.filter((id: number) => id !== clusterId);
      return { ...u, assignedClusterIds: nextIds };
    });
    this.selectedCompanyUser = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: assign ? 'Cluster Assigned Successfully' : 'Cluster Removed Successfully' });
    this.fetchActiveClustersFromUser();
  }

  isDepartmentAssigned(departmentId: number){
    return this.assignedActiveDepartments.some(
      department => department.departmentId === departmentId
    )
  }

  toggleDepartment(department: any){
    try {
      if (this.isDepartmentAssigned(department.departmentId)) {
        this.removeDepartmentsFromUser(department);
      } else {
        this.assignDepartmentsToUser(department);
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  filteredAssignedDepartments(){
    const query = this.departmentSearchQuery.trim().toLowerCase();
    return this.departmentInfoList.filter(d =>
      this.isDepartmentAssigned(d.departmentId) &&
      (!query || d.departmentName?.toLowerCase().includes(query))
    );
  }

  filteredAvailableDepartments(){
    const query = this.departmentSearchQuery.trim().toLowerCase();
    return this.departmentInfoList.filter(d =>
      !this.isDepartmentAssigned(d.departmentId) &&
      (!query || d.departmentName?.toLowerCase().includes(query))
    );
  }

  fetchActiveDepartmentsFromUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }

      this.apiService.fetchActiveDepartmentsFromUser(data).subscribe({
        next: val => {
          this.assignedActiveDepartments = val.data;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            const user = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);
            const ids: number[] = user?.assignedDepartmentIds ?? [];
            this.assignedActiveDepartments = MOCK_DEPARTMENT_INFO.filter(d => ids.includes(d.departmentId));
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  assignDepartmentsToUser(department: any){
     try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        departmentId: department.departmentId
      }

      this.apiService.assignDepartmentsToUser(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department Assigned Successfully' });
          this.fetchActiveDepartmentsFromUser();
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleDepartmentLocally(department.departmentId, true);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeDepartmentsFromUser(department: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        departmentId: department.departmentId
      }

      this.apiService.removeDepartmentsFromUser(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department Removed Successfully' });
          this.fetchActiveDepartmentsFromUser();
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleDepartmentLocally(department.departmentId, false);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  private toggleDepartmentLocally(departmentId: number, assign: boolean){
    this.companyUserList = this.companyUserList.map(u => {
      if (u.userId !== this.selectedCompanyUser.userId) return u;
      const ids: number[] = u.assignedDepartmentIds ?? [];
      const nextIds = assign
        ? (ids.includes(departmentId) ? ids : [...ids, departmentId])
        : ids.filter((id: number) => id !== departmentId);
      return { ...u, assignedDepartmentIds: nextIds };
    });
    this.selectedCompanyUser = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: assign ? 'Department Assigned Successfully' : 'Department Removed Successfully' });
    this.fetchActiveDepartmentsFromUser();
  }

  isComponentAssigned(componentId: number){
    return this.assignedActiveComponents.some(
      component => component.componentId === componentId
    )
  }

  toggleComponent(component: any){
    try {
      if (this.isComponentAssigned(component.componentId)) {
        this.removeComponentsFromUser(component);
      } else {
        this.assignComponentsToUser(component);
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  filteredAssignedComponents(){
    const query = this.componentSearchQuery.trim().toLowerCase();
    return this.componentList.filter(c =>
      this.isComponentAssigned(c.componentId) &&
      (!query || c.componentName?.toLowerCase().includes(query))
    );
  }

  filteredAvailableComponents(){
    const query = this.componentSearchQuery.trim().toLowerCase();
    return this.componentList.filter(c =>
      !this.isComponentAssigned(c.componentId) &&
      (!query || c.componentName?.toLowerCase().includes(query))
    );
  }

  fetchActiveComponentsFromUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }

      this.apiService.fetchActiveComponentsFromUser(data).subscribe({
        next: val => {
          this.assignedActiveComponents = val.data;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            const user = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);
            const ids: number[] = user?.assignedComponentIds ?? [];
            this.assignedActiveComponents = MOCK_COMPONENT_INFO.filter(c => ids.includes(c.componentId));
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }


  assignComponentsToUser(component: any){
     try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        componentId: component.componentId
      }

      this.apiService.assignComponentsToUser(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Component Assigned Successfully' });
          this.fetchActiveComponentsFromUser();
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleComponentLocally(component.componentId, true);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeComponentsFromUser(component: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        componentId: component.componentId
      }

      this.apiService.removeComponentsFromUser(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Component Removed Successfully' });
          this.fetchActiveComponentsFromUser();
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleComponentLocally(component.componentId, false);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  private toggleComponentLocally(componentId: number, assign: boolean){
    this.companyUserList = this.companyUserList.map(u => {
      if (u.userId !== this.selectedCompanyUser.userId) return u;
      const ids: number[] = u.assignedComponentIds ?? [];
      const nextIds = assign
        ? (ids.includes(componentId) ? ids : [...ids, componentId])
        : ids.filter((id: number) => id !== componentId);
      return { ...u, assignedComponentIds: nextIds };
    });
    this.selectedCompanyUser = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: assign ? 'Component Assigned Successfully' : 'Component Removed Successfully' });
    this.fetchActiveComponentsFromUser();
  }

  fetchUserGroupInfo(){
    try {
      this.userGroupModalLoading = true;
      this.apiService.userGroupInfo('')
      .subscribe({
        next:val=>{
          this.userGroupList = val.data;
          this.userGroupModalLoading = false;
        },error:(err)=>{
          this.userGroupModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.userGroupList = MOCK_USER_GROUP_INFO;
          }
        }
      })
    } catch (error) {
      this.userGroupModalLoading = false;
      this.userGroupList = MOCK_USER_GROUP_INFO;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchCompanyUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }

      this.apiService.fetchCompanyUser(data).subscribe({
        next: val => {
          this.assignedUserGroups = val.data?.userGroups ?? [];
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            const user = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);
            this.assignedUserGroups = user?.userGroups ?? [];
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchPlantInfo(){
    try {
      this.plantModalLoading = true;
      this.apiService.fetchPlantInfo('').subscribe({
        next: val => {
          this.plantInfoList = val.data;
          this.plantModalLoading = false;
        },
        error: err => {
          this.plantModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.plantInfoList = MOCK_PLANT_INFO;
          }
        }
      })
    } catch (error) {
      this.plantModalLoading = false;
      this.plantInfoList = MOCK_PLANT_INFO;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  assignPlantToUser(plant: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        plantId: plant.id
      }

      this.apiService.assignPlantToUser(data).subscribe({
        next: val => { 
          this.assignedPlant = plant.id;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plant Assigned Successfully' });
          this.fetchActivePlantsFromUser();
          // this.showPlantMappingModal = false;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.assignPlantToUserLocally(plant);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  private assignPlantToUserLocally(plant: any){
    this.companyUserList = this.companyUserList.map(u =>
      u.userId === this.selectedCompanyUser.userId ? { ...u, assignedPlantId: plant.id } : u
    );
    this.selectedCompanyUser = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);
    this.assignedPlant = plant.id;

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plant Assigned Successfully' });
    this.fetchActivePlantsFromUser();
  }

  private removePlantFromUserLocally(){
    this.companyUserList = this.companyUserList.map(u =>
      u.userId === this.selectedCompanyUser.userId ? { ...u, assignedPlantId: null } : u
    );
    this.selectedCompanyUser = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);
    this.assignedPlant = null;

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plant Removed Successfully' });
    this.fetchActivePlantsFromUser();
  }

  removePlantFromUser(plant: any){
    this.confirmationService.confirm({
      message: 'Do you want to remove this plant?',
      header: 'Remove Plant',
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
            userId: this.selectedCompanyUser.userId,
            plantId: plant.id
          }

          this.apiService.removePlantFromUser(data).subscribe({
            next: val => {
              this.assignedPlant = null;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plant Removed Successfully' });
              this.fetchActivePlantsFromUser();
              // this.showPlantMappingModal = false;
            },
            error: err => {
              // if (err.status === 400) {
              //   this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              // }

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.data });
              } else {
                this.removePlantFromUserLocally();
              }
            }
          })
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      }
    });
  }

  fetchActivePlantsFromUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }

      this.apiService.fetchActivePlantsFromUser(data).subscribe({
        next: val => {

          const list = val.data ?? [];
          this.assignedPlant = list.length ? list[0] : null;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            const user = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);
            const plantId = user?.assignedPlantId ?? null;
            const plant = plantId != null ? MOCK_PLANT_INFO.find(p => p.id === plantId) : null;
            this.assignedPlant = plant ? { ...plant, plantId: plant.id } : null;
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openAssignUserGroupsModal(){
    try {
      this.assignUserGroupModal = true;
      this.userGroupSearchQuery = '';

      this.fetchUserGroupInfo();
      this.fetchCompanyUser();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openPlantMappingModal(){
    try {
      this.showPlantMappingModal = true;
      this.plantSearchQuery = '';
      this.fetchPlantInfo();
      this.fetchCompanyUser();
      this.fetchActivePlantsFromUser();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editCompanyUser(){
    try {
      this.showCompanyUserModal = true;
      this.companyUserForm.patchValue(this.selectedCompanyUser);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  assignUserGroups(usergroup: any){
    try{

      const data = {
        userId: this.selectedCompanyUser.userId,
        userGroupId: usergroup?.userGroupId
      }

      this.apiService.assignGroup(data)
      .subscribe({
        next:(val)=>{
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Group Assigned Successfully' });
          this.fetchCompanyUser();
          this.fetchAllCompanyUser();
        },error:(err)=>{

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleUserGroupLocally(usergroup, true);
          }
        }
      })
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });

    }
  }

  removeUserGroups(usergroup: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        userGroupId: usergroup?.userGroupId
      }
      
      this.apiService.removeUserGroup(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Group Removed Successfully' });
          this.fetchCompanyUser();
          this.fetchAllCompanyUser();
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleUserGroupLocally(usergroup, false);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  private toggleUserGroupLocally(usergroup: any, assign: boolean){
    this.companyUserList = this.companyUserList.map(u => {
      if (u.userId !== this.selectedCompanyUser.userId) return u;
      const groups: any[] = u.userGroups ?? [];
      const nextGroups = assign
        ? (groups.some((g: any) => g.userGroupId === usergroup.userGroupId) ? groups : [...groups, { userGroupId: usergroup.userGroupId, groupName: usergroup.groupName }])
        : groups.filter((g: any) => g.userGroupId !== usergroup.userGroupId);
      return { ...u, userGroups: nextGroups };
    });
    this.selectedCompanyUser = this.companyUserList.find(u => u.userId === this.selectedCompanyUser.userId);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: assign ? 'User Group Assigned Successfully' : 'User Group Removed Successfully' });
    this.fetchCompanyUser();
  }

  fetchClusterInfo(){
    try {
      this.clusterModalLoading = true;
      this.apiService.fetchClusterInfo('').subscribe({
        next: val => {
          this.clusterInfoList = val.data;
          this.clusterModalLoading = false;
        },
        error: err => {
          this.clusterModalLoading = false;
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.clusterInfoList = MOCK_CLUSTER_INFO;
          }
        }
      })
    } catch (error) {
      this.clusterModalLoading = false;
      this.clusterInfoList = MOCK_CLUSTER_INFO;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchDepartmentInfo(){
    try {
      this.departmentModalLoading = true;
      this.apiService.fetchDepartmentInfo('').subscribe({
        next: val => {
          this.departmentInfoList = val.data;
          this.departmentModalLoading = false;
        },
        error: err => {
          this.departmentModalLoading = false;
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.departmentInfoList = MOCK_DEPARTMENT_INFO;
          }
        }
      })
    } catch (error) {
      this.departmentModalLoading = false;
      this.departmentInfoList = MOCK_DEPARTMENT_INFO;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchAllComponents(){
    try {
      this.componentModalLoading = true;
      this.apiService.fetchAllComponents('').subscribe({
        next: val => {
          this.componentList = val.data;
          this.componentModalLoading = false;
        },
        error: err => {
          this.componentModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.componentList = MOCK_COMPONENT_INFO;
          }
        }
      })
    } catch (error) {
      this.componentModalLoading = false;
      this.componentList = MOCK_COMPONENT_INFO;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteCompanyUser(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete ${this.selectedCompanyUser?.userName}`,
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
        const data = {
          userId: this.selectedCompanyUser.userId
        }

        this.apiService.deleteCompanyUsers(data).subscribe({
          next: val => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Company User' });
            this.fetchAllCompanyUser();
          },
          error: err => {
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            } else {
              this.companyUserList = this.companyUserList.filter(u => u.userId !== this.selectedCompanyUser.userId);
              this.totalRecords = this.companyUserList.length;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Company User' });
            }
          }
        })
      }
    });
  }

  openCompanyUserModal(){
    try {
      this.showCompanyUserModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openClusterMappingModal(){
    try {
      this.showClusterModal = true;
      this.clusterSearchQuery = '';
      this.fetchClusterInfo();
      this.fetchActiveClustersFromUser();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openDepartmentMappingModal(){
    try {
      this.showDepartmentModal = true;
      this.departmentSearchQuery = '';
      this.fetchDepartmentInfo();
      this.fetchActiveDepartmentsFromUser();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openComponentMappingModel(){
    try {
      this.showComponentModal = true;
      this.componentSearchQuery = '';
      this.fetchAllComponents();
      this.fetchActiveComponentsFromUser();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign/Remove User Group',
        icon: 'pi pi-user-plus',
        command: () => this.openAssignUserGroupsModal(),
      },
      {
        label: 'Assign/Remove Plant',
        icon: 'pi pi-user-plus',
        command: () => this.openPlantMappingModal(),
      },
      {
        label: 'Assign/Remove Department',
        icon: 'pi pi-user-plus',
        command: () => this.openDepartmentMappingModal(),
      },
      {
        label: 'Assign/Remove Cluster',
        icon: 'pi pi-user-plus',
        command: () => this.openClusterMappingModal(),
      },
      {
        label: 'Assign/Remove Component',
        icon: 'pi pi-user-plus',
        command: () => this.openComponentMappingModel(),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCompanyUser()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCompanyUser()
      }
    ]
  }

  companyUserMenu(event: Event, menu: any, companyUser: any){
    this.selectedCompanyUser = companyUser;
    menu.toggle(event);
  }

  onDialogClose() {
    this.selectedCompanyUser = null;
    this.companyUserForm.reset();
    // this.assignedPlant = null;
  }

  loadUser(event: any) {
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.fetchAllCompanyUser();
  }
}
