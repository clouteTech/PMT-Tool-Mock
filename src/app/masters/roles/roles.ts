import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_ROLES: any[] = [
  { roleId: 1, roleKey: 'SUPER_ADMIN', action: 'ALL', resource: 'ALL', description: 'Full system access' },
  { roleId: 2, roleKey: 'PLANT_ADMIN', action: 'WRITE', resource: 'PLANT', description: 'Manage plant operations' },
  { roleId: 3, roleKey: 'PROJECT_MANAGER', action: 'WRITE', resource: 'PROJECT', description: 'Manage project lifecycle' },
  { roleId: 4, roleKey: 'QUALITY_INSPECTOR', action: 'READ', resource: 'QC', description: 'Quality inspection access' },
  { roleId: 5, roleKey: 'LOGISTICS_COORDINATOR', action: 'WRITE', resource: 'LOGISTICS', description: 'Coordinate crane and transport logistics' },
  { roleId: 6, roleKey: 'FINANCE_MANAGER', action: 'READ', resource: 'FINANCE', description: 'View financial reports' },
  { roleId: 7, roleKey: 'STORE_KEEPER', action: 'WRITE', resource: 'INVENTORY', description: 'Manage inventory records' },
  { roleId: 8, roleKey: 'HR_MANAGER', action: 'WRITE', resource: 'HR', description: 'Manage employee records' },
  { roleId: 9, roleKey: 'SITE_ENGINEER', action: 'WRITE', resource: 'INSTALLATION', description: 'Manage installation activities' },
  { roleId: 10, roleKey: 'VIEWER', action: 'READ', resource: 'ALL', description: 'Read only access across modules' },
];

@Component({
  selector: 'app-roles',
  imports: [Shared],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {
  first = 0;

  rows = 10;

  page = 0;
  size = 10;

  roleList: any[] = [];

  items: MenuItem[] = [];

  constructor(private confirmationService: ConfirmationService,
    private apiService: Apiservice, private messageService: MessageService){}

  ngOnInit(): void {
    this.fetchAllRoles();
  }

  fetchAllRoles(){
    try {
      const data = {
        search: null,
        resource: null,
        action: null,
        page: this.page,
        size: this.size
      }

      this.apiService.fetchAllRoles(data).subscribe({
        next: val => {
          this.roleList = val.data.content;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.roleList = MOCK_ROLES;
          }
        }
      })
    } catch (error) {
      this.roleList = MOCK_ROLES;
    }
  }

  pageChange(event: any) {
    this.first = event.first;
    // this.rows = event.rows;

    this.page = event.first / event.rows;
    this.size = event.rows;
  }

  // Stub handlers — wire to real edit/delete APIs once role CRUD is available.
  roleMenu(event: Event, menu: any, role: any) {
    this.items = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => console.log('edit', role) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('delete', role) }
    ];
    menu.toggle(event);
  }
}
