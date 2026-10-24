import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-wtg-receiving',
  imports: [Shared],
  templateUrl: './wtg-receiving-project-summary.html',
  styleUrl: './wtg-receiving-project-summary.css',
})
export class WtgReceivingProjectSummary {
  items: MenuItem[] = [];

  chooseDownloadTemplate = false;
  chooseUploadTemplate = false;

  constructor(private messageService: MessageService){}

  wtgProjects = [
    {
      slNo: 1,
      openWtg: 'WTG-001',
      projectCode: 'P-8001',
      projectName: 'India_TataPower_Chennai_TamilNadu_Phase1_250MW',
      wtgCount: 2
    },
    {
      slNo: 2,
      openWtg: 'WTG-002',
      projectCode: 'P-8002',
      projectName: 'India_AdaniEnergy_Belagavi_Karnataka_Phase2_180MW',
      wtgCount: 5
    },
    {
      slNo: 3,
      openWtg: 'WTG-003',
      projectCode: 'P-8003',
      projectName: 'India_ReNewPower_Jaisalmer_Rajasthan_Phase1_320MW',
      wtgCount: 6
    },
    {
      slNo: 4,
      openWtg: 'WTG-004',
      projectCode: 'P-8004',
      projectName: 'India_Greenko_Kutch_Gujarat_Phase3_400MW',
      wtgCount: 3
    },
    {
      slNo: 5,
      openWtg: 'WTG-005',
      projectCode: 'P-8005',
      projectName: 'India_AzurePower_Pune_Maharashtra_Phase1_150MW',
      wtgCount: 4
    },
    {
      slNo: 6,
      openWtg: 'WTG-006',
      projectCode: 'P-8006',
      projectName: 'India_Suzlon_Jaisalmer_Rajasthan_Phase2_200MW',
      wtgCount: 3
    },
    {
      slNo: 7,
      openWtg: 'WTG-007',
      projectCode: 'P-8007',
      projectName: 'India_HeroFuture_Bhuj_Gujarat_Phase1_275MW',
      wtgCount: 5
    },
    {
      slNo: 8,
      openWtg: 'WTG-008',
      projectCode: 'P-8008',
      projectName: 'India_Continuum_Sangareddy_Telangana_Phase1_120MW',
      wtgCount: 2
    },
    {
      slNo: 9,
      openWtg: 'WTG-009',
      projectCode: 'P-8009',
      projectName: 'India_JSWEnergy_Devgadh_Rajasthan_Phase2_300MW',
      wtgCount: 6
    },
    {
      slNo: 10,
      openWtg: 'WTG-010',
      projectCode: 'P-8010',
      projectName: 'India_Torrent_Chitradurga_Karnataka_Phase1_180MW',
      wtgCount: 4
    }
  ];

  exportReceiving(){
    try {
      this.chooseDownloadTemplate = true;      
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  downloadTemplate(){
    try {
      this.messageService.add({
        severity: 'info',
        summary: 'Coming Soon',
        detail: 'Receiving template download will be available soon.'
      });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  uploadTemplate(){
    try {
        this.messageService.add({
          severity: 'info',
          summary: 'Coming Soon',
          detail: 'Receiving template upload will be available soon.'
        });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }


  openImportDialog(){
    try {
      this.chooseUploadTemplate = true;      
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // Stub handlers — wire to real edit/delete APIs once project CRUD is available here.
  receivingMenu(event: Event, menu: any, receiving: any) {
    this.items = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => console.log('edit', receiving) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('delete', receiving) },
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command: () => this.openImportDialog()
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: () => this.exportReceiving()
      }
    ];
    menu.toggle(event);
  }
}