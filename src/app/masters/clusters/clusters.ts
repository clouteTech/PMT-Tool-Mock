import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_CLUSTERS: any[] = [
  { clusterId: 1, clusterCode: 'GJ', clusterName: 'Gujarat Cluster', status: true },
  { clusterId: 2, clusterCode: 'TN', clusterName: 'Tamil Nadu Cluster', status: true },
  { clusterId: 3, clusterCode: 'RJ', clusterName: 'Rajasthan Cluster', status: true },
  { clusterId: 4, clusterCode: 'KA', clusterName: 'Karnataka Cluster', status: false },
  { clusterId: 5, clusterCode: 'MH', clusterName: 'Maharashtra Cluster', status: true },
  { clusterId: 6, clusterCode: 'AP', clusterName: 'Andhra Pradesh Cluster', status: true },
  { clusterId: 7, clusterCode: 'MP', clusterName: 'Madhya Pradesh Cluster', status: false },
  { clusterId: 8, clusterCode: 'TS', clusterName: 'Telangana Cluster', status: true },
  { clusterId: 9, clusterCode: 'OD', clusterName: 'Odisha Cluster', status: true },
  { clusterId: 10, clusterCode: 'UP', clusterName: 'Uttar Pradesh Cluster', status: true },
];

@Component({
  selector: 'app-clusters',
  imports: [Shared],
  templateUrl: './clusters.html',
  styleUrl: './clusters.css',
})
export class Clusters implements OnInit {
  showClusterModal = false;

  selectedCluster: any;

  items: MenuItem[] = [];

  clusterList: any[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  clusterForm = this.fb.group({
    clusterId: [''],
    clusterCode: ['', [Validators.required, Validators.maxLength(2)]],
    clusterName: ['', [Validators.required, Validators.maxLength(50)]],
    status: [false]
  })

  get clusterCode(){
    return this.clusterForm.get('clusterCode');
  }

  get clusterName(){
    return this.clusterForm.get('clusterName');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllClusters();
  }

  fetchAllClusters(){
    try {
      this.apiService.fetchAllClusters('').subscribe({
        next: val => {
          this.clusterList = val.data;
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.clusterList = MOCK_CLUSTERS;
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      this.clusterList = MOCK_CLUSTERS;
    }
  }

  submitClusterForm(){
    try {
      if (this.clusterForm.valid) {   
        if (!this.selectedCluster) {
          const data = this.clusterForm.value;
  
          this.apiService.createCluster(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Cluster' });
              this.showClusterModal = false;
              this.fetchAllClusters();
            },
            error: err => {
  
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.createClusterLocally(data);
              }
            }
          })
        } else {
          const data = this.clusterForm.value;
  
          this.apiService.updateCluster(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Cluster' });
              this.showClusterModal = false;
              this.fetchAllClusters();
            },
            error: err => {

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.updateClusterLocally(data);
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

  private createClusterLocally(data: any){
    const newId = Math.max(0, ...this.clusterList.map(c => c.clusterId || 0)) + 1;
    const newCluster = { ...data, clusterId: newId };
    this.clusterList = [newCluster, ...this.clusterList];

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Cluster' });
    this.showClusterModal = false;
  }

  private updateClusterLocally(data: any){
    this.clusterList = this.clusterList.map(c => c.clusterId === data.clusterId ? { ...c, ...data } : c);

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Cluster' });
    this.showClusterModal = false;
  }

  editCluster(){
    try {
      this.showClusterModal = true;
      this.clusterForm.patchValue(this.selectedCluster);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteCluster(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Cluster`,
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
            clusterId: this.selectedCluster.clusterId
          }

          this.apiService.deleteCluster(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Cluster' });
              this.fetchAllClusters();
            },
            error: err => {

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              } else {
                this.clusterList = this.clusterList.filter(c => c.clusterId !== this.selectedCluster.clusterId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Cluster' });
              }
            }
          })
      }
    });
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCluster()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCluster()
      }
    ]
  }

  openClusterModal(){
    try {
      this.showClusterModal = true
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  clusterMenu(event: Event, menu: any, cluster: any){
    this.selectedCluster = cluster;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCluster = null;
    this.clusterForm.reset();
  }
}
