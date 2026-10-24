import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule }    from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule }  from 'primeng/textarea';
import { AccordionModule } from 'primeng/accordion';
import { TableModule }     from 'primeng/table';
import { ToastModule }     from 'primeng/toast';
import { CardModule }      from 'primeng/card';
import { MenuItem, MessageService }  from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield'; 
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FluidModule } from 'primeng/fluid';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-allocation-approval',
  imports: [CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    AccordionModule, TableModule,
    ToastModule, CardModule,IconFieldModule,TagModule,InputIconModule,DialogModule,ConfirmDialogModule,
    FluidModule,ReactiveFormsModule,MultiSelectModule,CheckboxModule, RouterModule, MenuModule],
  providers: [MessageService],
  templateUrl: './allocation-approval.html',
  styleUrl: './allocation-approval.css',
})
export class AllocationApproval {
  items: MenuItem[] = [];

  showAllocatedComponents = false;
  showRejectModal = false;

  selectedAllocation: any;
  rejectReason = '';

  constructor(private messageService: MessageService){}

 allocationApprovalList = [
    {
      initiatedBy: 'Ravi Kumar',
      initiatedOn: '2026-03-25',
      planMonth: 'Apr 2026',
      plantName: 'Chennai',
      plantManager: 'Suresh Reddy',
      status: 'CREATED'
    },
    {
      initiatedBy: 'Meena Iyer',
      initiatedOn: '2026-03-20',
      planMonth: 'Apr 2026',
      plantName: 'Chennai',
      plantManager: 'Lakshmi Devi',
      status: 'CREATED'
    },
    {
      initiatedBy: 'Arjun Naik',
      initiatedOn: '2026-03-18',
      planMonth: 'May 2026',
      plantName: 'Tirichy',
      plantManager: 'Manjunath H',
      status: 'REVIEWED',
      reviewedBy: 'Ajith Kumar',
      reviewedOn: '2026-03-19'
    },
    {
      initiatedBy: 'Kiran Patel',
      initiatedOn: '2026-03-22',
      planMonth: 'Apr 2026',
      plantName: 'Pune',
      plantManager: 'Anitha Rao',
      status: 'CREATED'
    },
    {
      initiatedBy: 'Divya Menon',
      initiatedOn: '2026-03-15',
      planMonth: 'May 2026',
      plantName: 'Chennai',
      plantManager: 'Suresh Reddy',
      status: 'COMPLETED',
      reviewedBy: 'Mohan',
      reviewedOn: '2026-03-16',
      approvedBy: 'Mohan',
      approvedOn: '2026-03-17'
    },
    {
      initiatedBy: 'Ravi Kumar',
      initiatedOn: '2026-03-27',
      planMonth: 'May 2026',
      plantName: 'Tirichy',
      plantManager: 'Manjunath H',
      status: 'CREATED'
    },
    {
      initiatedBy: 'Suresh Reddy',
      initiatedOn: '2026-03-12',
      planMonth: 'Mar 2026',
      plantName: 'Pune',
      plantManager: 'Anitha Rao',
      status: 'In_PROGRESS',
      reviewedBy: 'Ajith Kumar',
      reviewedOn: '2026-03-13'
    },
    {
      initiatedBy: 'Meena Iyer',
      initiatedOn: '2026-03-28',
      planMonth: 'Jun 2026',
      plantName: 'Chennai',
      plantManager: 'Lakshmi Devi',
      status: 'CREATED'
    },
    {
      initiatedBy: 'Arjun Naik',
      initiatedOn: '2026-03-08',
      planMonth: 'Mar 2026',
      plantName: 'Tirichy',
      plantManager: 'Manjunath H',
      status: 'REVIEWED',
      reviewedBy: 'Mohan',
      reviewedOn: '2026-03-09'
    }
  ];

  allocatedComponentList = [
    {
      componentName: 'Nacelle',
      qty: '30',
    },
    {
      componentName: 'Hub',
      qty: '2',
    },
    {
      componentName: 'Tower',
      qty: '2',
    }
  ]

  getSeverity(status: string){
    switch(status){
      case 'CREATED':
        return 'info';

      case 'REVIEWED':
        return 'success';

      case 'In_PROGRESS':
        return 'warn';

      case 'COMPLETED':
        return 'success';

      case 'REJECTED':
        return 'danger';

      default:
        return 'info';
    }
  }

  review(item: any){
    item.status = 'REVIEWED';
    item.reviewedBy = this.getCurrentUser();
    item.reviewedOn = this.getToday();

    // item.menuItems = this.getMenuItems(item);

    // this.allocationApprovalList = [...this.allocationApprovalList];
  }

  acceptAllocation(){
    if (!this.selectedAllocation) return;

    this.selectedAllocation.status = 'COMPLETED';
    this.selectedAllocation.approvedBy = this.getCurrentUser();
    this.selectedAllocation.approvedOn = this.getToday();

    this.showAllocatedComponents = false;
    this.messageService.add({ severity: 'success', summary: 'Accepted', detail: 'Allocation accepted successfully.' });
  }

  rejectAllocation(){
    if (!this.selectedAllocation) return;

    this.selectedAllocation.status = 'REJECTED';
    this.selectedAllocation.rejectionReason = this.rejectReason;

    this.showRejectModal = false;
    this.rejectReason = '';
    this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Allocation rejected.' });
  }

  getMenuItems() {
    if (this.selectedAllocation?.status === 'CREATED') {
      return [
        {
          label: 'Review',
          icon: 'pi pi-eye',
          command: () => this.review(this.selectedAllocation),
        }
      ];
    }

    if (this.selectedAllocation?.status === 'REVIEWED') {
      return [
        {
          label: 'View Allocated Components',
          icon: 'pi pi-list',
          command: () => this.showAllocatedComponents = true
        },
        {
          label: 'Accept',
          icon: 'pi pi-check',
          command: () => this.showAllocatedComponents = true
        },
        {
          label: 'Reject',
          icon: 'pi pi-times',
          command: () => this.showRejectModal = true
        }
      ]
    }

    return [];
  }

  getCurrentUser() {
    return 'Mohan';
  }

  getToday() {
    return new Date().toLocaleDateString('en-GB');
  }

  openMenu(menu: any, event: any, allocation: any) {
    this.selectedAllocation = allocation;
    this.items = this.getMenuItems();
    menu.toggle(event);
  }
}
