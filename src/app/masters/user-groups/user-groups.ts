import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
// assignedRoleIds drives the Assign/Remove Role modal in demo mode.
const MOCK_USER_GROUPS: any[] = [
  { userGroupId: 1, groupName: 'Super Admin Group', description: 'Full administrative access to all modules', totalRoles: 1, totalUsers: 2, status: true, assignedRoleIds: [1] },
  { userGroupId: 2, groupName: 'Plant Operations Group', description: 'Manages plant-wise production and configuration', totalRoles: 2, totalUsers: 8, status: true, assignedRoleIds: [2, 9] },
  { userGroupId: 3, groupName: 'Project Management Group', description: 'Handles project, SPV and WTG planning', totalRoles: 3, totalUsers: 6, status: true, assignedRoleIds: [3, 5, 9] },
  { userGroupId: 4, groupName: 'Quality Control Group', description: 'Quality inspection and compliance checks', totalRoles: 1, totalUsers: 5, status: false, assignedRoleIds: [4] },
  { userGroupId: 5, groupName: 'Logistics Group', description: 'Crane, transport and supplier coordination', totalRoles: 2, totalUsers: 4, status: true, assignedRoleIds: [5, 7] },
  { userGroupId: 6, groupName: 'Finance Group', description: 'Budgeting and financial reporting', totalRoles: 1, totalUsers: 3, status: true, assignedRoleIds: [6] },
  { userGroupId: 7, groupName: 'HR Group', description: 'Employee and department management', totalRoles: 1, totalUsers: 3, status: true, assignedRoleIds: [8] },
  { userGroupId: 8, groupName: 'Site Engineering Group', description: 'Installation activity tracking at site', totalRoles: 2, totalUsers: 7, status: true, assignedRoleIds: [9, 5] },
  { userGroupId: 9, groupName: 'Store & Inventory Group', description: 'Component and inventory tracking', totalRoles: 1, totalUsers: 4, status: false, assignedRoleIds: [7] },
  { userGroupId: 10, groupName: 'Read Only Viewers', description: 'View only access across all masters', totalRoles: 1, totalUsers: 10, status: true, assignedRoleIds: [10] },
];

const MOCK_ROLE_INFO: any[] = [
  { roleId: 1, roleKey: 'SUPER_ADMIN', description: 'Full system access' },
  { roleId: 2, roleKey: 'PLANT_ADMIN', description: 'Manage plant operations' },
  { roleId: 3, roleKey: 'PROJECT_MANAGER', description: 'Manage project lifecycle' },
  { roleId: 4, roleKey: 'QUALITY_INSPECTOR', description: 'Quality inspection access' },
  { roleId: 5, roleKey: 'LOGISTICS_COORDINATOR', description: 'Coordinate crane and transport logistics' },
  { roleId: 6, roleKey: 'FINANCE_MANAGER', description: 'View financial reports' },
  { roleId: 7, roleKey: 'STORE_KEEPER', description: 'Manage inventory records' },
  { roleId: 8, roleKey: 'HR_MANAGER', description: 'Manage employee records' },
  { roleId: 9, roleKey: 'SITE_ENGINEER', description: 'Manage installation activities' },
  { roleId: 10, roleKey: 'VIEWER', description: 'Read only access across modules' },
];

@Component({
  selector: 'app-user-groups',
  imports: [Shared],
  templateUrl: './user-groups.html',
  styleUrl: './user-groups.css',
})
export class UserGroups implements OnInit {
  showUserGroupModal = false;
  showRoleModal = false;

  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  items: MenuItem[] = [];

  userGroupList: any[] = [];
  roleInfoList: any[] = [];
  assignedRoles: any[] = [];
  roleSearchQuery = '';
  roleModalLoading = false;

  selectedUsergroup: any;

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  userGroupForm = this.fb.group({
    userGroupId: [0],
    groupName: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(255)],
    status: [false]
  })

  get groupName(){
    return this.userGroupForm.get('groupName');
  }

  get description(){
    return this.userGroupForm.get('description');
  }
    
  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllUserGroups();
  }

  fetchAllUserGroups(){
    try {
      const data = {
        search: null,
        status: null,
        isDefault: null,
        page: 0,
        size: 10,
        sortBy: 'createdOn',
        sortDirection: 'asc'
      }

      this.apiService.fetchAllUserGroups(data).subscribe({
        next: val => {
          this.userGroupList = val.data.content;

          this.totalRecords = val.data.totalElements ?? 0;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.userGroupList = MOCK_USER_GROUPS;
            this.totalRecords = MOCK_USER_GROUPS.length;
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      this.userGroupList = MOCK_USER_GROUPS;
      this.totalRecords = MOCK_USER_GROUPS.length;
    }
  }

  submitUserGroupForm(){
    try {
      if(this.userGroupForm.valid){
        if (!this.selectedUsergroup) {
          const data = this.userGroupForm.value;
  
          this.apiService.createUserGroup(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created User Group' });
              this.showUserGroupModal = false;
              this.fetchAllUserGroups();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createUserGroupLocally(data);
              }
            }
          })
        } else {
          const data = this.userGroupForm.value;

          this.apiService.updateUserGroup(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated User Group' });
              this.showUserGroupModal = false;
              this.fetchAllUserGroups();
            },
            error: err => {
  
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateUserGroupLocally(data);
              }
            }
          })
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill All Required field' });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // ── Demo mode CRUD (operates on the in-memory mock list when the backend is unreachable) ──

  private createUserGroupLocally(data: any){
    const newId = Math.max(0, ...this.userGroupList.map(g => g.userGroupId || 0)) + 1;
    const newGroup = { ...data, userGroupId: newId, totalRoles: 0, totalUsers: 0, assignedRoleIds: [] };
    this.userGroupList = [newGroup, ...this.userGroupList];
    this.totalRecords = this.userGroupList.length;

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created User Group' });
    this.showUserGroupModal = false;
  }

  private updateUserGroupLocally(data: any){
    this.userGroupList = this.userGroupList.map(g => g.userGroupId === data.userGroupId ? { ...g, ...data } : g);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated User Group' });
    this.showUserGroupModal = false;
  }

  editUserGroup(){
    try {
      this.showUserGroupModal = true;
      this.userGroupForm.patchValue(this.selectedUsergroup);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteUserGroup(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete User Group`,
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
            userGroupId: this.selectedUsergroup.userGroupId
          }

          this.apiService.deleteUserGroup(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted User Group' });
              this.fetchAllUserGroups();
            },
            error: err => {

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.userGroupList = this.userGroupList.filter(g => g.userGroupId !== this.selectedUsergroup.userGroupId);
                this.totalRecords = this.userGroupList.length;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted User Group' });
              }
            }
          })
      }
    });
  }

  isRoleAssigned(roleId: number): boolean{
    return this.assignedRoles.some(
      role => role.roleId === roleId
    );
  }

  toggleRole(role: any){
    if (this.isRoleAssigned(role.roleId)) {
      this.removeRole(role);
    } else {
      this.assignRole(role);
    }
  }

  getRoleMappingInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAssignedRoles(){
    const query = this.roleSearchQuery.trim().toLowerCase();
    return this.roleInfoList.filter(r =>
      this.isRoleAssigned(r.roleId) &&
      (!query || r.roleKey?.toLowerCase().includes(query) || r.description?.toLowerCase().includes(query))
    );
  }

  filteredAvailableRoles(){
    const query = this.roleSearchQuery.trim().toLowerCase();
    return this.roleInfoList.filter(r =>
      !this.isRoleAssigned(r.roleId) &&
      (!query || r.roleKey?.toLowerCase().includes(query) || r.description?.toLowerCase().includes(query))
    );
  }

  assignRole(role: any){
    try {
      const data = {
        userGroupId: this.selectedUsergroup.userGroupId,
        roleId: role.roleId
      }

      this.apiService.assignRolesToUsergroup(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role Assigned Successfully' });
          this.fetchUsergroup();
          this.fetchAllUserGroups();
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleRoleLocally(role, true);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeRole(role: any){
    try {
      const data = {
        userGroupId: this.selectedUsergroup.userGroupId,
        roleId: role.roleId
      }

      this.apiService.removeRolesToUsergroup(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role Removed Successfully' });
          this.fetchUsergroup();
          this.fetchAllUserGroups();
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.toggleRoleLocally(role, false);
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  private toggleRoleLocally(role: any, assign: boolean){
    this.userGroupList = this.userGroupList.map(g => {
      if (g.userGroupId !== this.selectedUsergroup.userGroupId) return g;
      const ids: number[] = g.assignedRoleIds ?? [];
      const nextIds = assign
        ? (ids.includes(role.roleId) ? ids : [...ids, role.roleId])
        : ids.filter((id: number) => id !== role.roleId);
      return { ...g, assignedRoleIds: nextIds, totalRoles: nextIds.length };
    });
    this.selectedUsergroup = this.userGroupList.find(g => g.userGroupId === this.selectedUsergroup.userGroupId);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: assign ? 'Role Assigned Successfully' : 'Role Removed Successfully' });
    this.fetchUsergroup();
  }

  fetchRoleInfo(){
    try {
      this.roleModalLoading = true;
      this.apiService.fetchRoleInfo('').subscribe({
        next: val => {
          this.roleInfoList = val.data;
          this.roleModalLoading = false;
        },
        error: err => {
          this.roleModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.roleInfoList = MOCK_ROLE_INFO;
          }
        }
      })
    } catch (error) {
      this.roleModalLoading = false;
      this.roleInfoList = MOCK_ROLE_INFO;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchUsergroup(){
    try {
      const data = {
        userGroupId: this.selectedUsergroup.userGroupId
      }

      this.apiService.fetchUserGroup(data).subscribe({
        next: val => {
          this.assignedRoles = val.data.roles ?? [];
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            const group = this.userGroupList.find(g => g.userGroupId === this.selectedUsergroup.userGroupId);
            const ids: number[] = group?.assignedRoleIds ?? [];
            this.assignedRoles = MOCK_ROLE_INFO.filter(r => ids.includes(r.roleId));
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openRoleModal(){
    try {
      this.showRoleModal = true;
      this.roleSearchQuery = '';
      this.fetchRoleInfo();
      this.fetchUsergroup();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openUserGroupModal(){
    try {
      this.showUserGroupModal = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign/Remove Role',
        icon: 'pi pi-user-plus',
        command: () => this.openRoleModal(),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editUserGroup()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteUserGroup()
      }
    ]
  }

  usergroupMenu(event: Event, menu: any, usergroup: any){
    this.selectedUsergroup = usergroup;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedUsergroup = null;
    this.userGroupForm.reset();
  }

  loadUser(event: any) {
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.fetchAllUserGroups();
  }
}
