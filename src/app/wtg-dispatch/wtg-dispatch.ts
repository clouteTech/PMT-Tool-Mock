import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-wtg-dispatch',
  imports: [Shared],
  templateUrl: './wtg-dispatch.html',
  styleUrl: './wtg-dispatch.css',
})
export class WtgDispatch {
  items: MenuItem[] = [];

  showDispatchDetailsModal = false;
  selectedDispatch: any = {};

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService){}

  chooseDownloadTemplate = false;
  chooseUploadTemplate = false;

  wtgDispatchPlanList = [
    {
      pCode: "P-8001",
      component: "Blade",
      subComponent: "Root Section",
      dispatchPlanStart: "2026-03-31",
      dispatchActualStart: "2026-03-30",
      dispatchForecastStart: "2026-03-30",
      dispatchStartDelayReason: "No Delay",
      dispatchPlanFinish: "2026-03-31",
      dispatchActualFinish: "2026-03-31",
      dispatchForecastFinish: "2026-03-31",
      dispatchFinishDelayReason: "No Delay",
      frameNo: "FRM-001",
      rootFrameNo: "RF-001",
      tipFrameNo: "TF-001",
      transporter: "ABC Logistics",
      invoiceNumber: "INV-2026-0001",
      invoiceDate: "2026-03-31",
      vehicleNo: "TN-11-AB-1001",
      lrNumber: "LR-0001",
      lrDate: "2026-03-31",
      dcNo: "DC-0001",
      dcDate: "2026-03-31",
      vehicleInDate: "2026-04-01",
      deliveryPlan: "2026-04-02",
      deliveryActual: "2026-04-02",
      deliveryForecast: "2026-04-02",
      deliveryDelayReason: "No Delay"
    },
    {
      pCode: "P-8002",
      component: "Tower",
      subComponent: "Root Section",
      dispatchPlanStart: "2026-04-03",
      dispatchActualStart: "2026-04-02",
      dispatchForecastStart: "2026-04-02",
      dispatchStartDelayReason: "No Delay",
      dispatchPlanFinish: "2026-04-03",
      dispatchActualFinish: "2026-04-03",
      dispatchForecastFinish: "2026-04-03",
      dispatchFinishDelayReason: "No Delay",
      frameNo: "FRM-002",
      rootFrameNo: "-",
      tipFrameNo: "-",
      transporter: "XYZ Transport",
      invoiceNumber: "INV-2026-0002",
      invoiceDate: "2026-04-03",
      vehicleNo: "TN-12-AB-1002",
      lrNumber: "LR-0002",
      lrDate: "2026-04-03",
      dcNo: "DC-0002",
      dcDate: "2026-04-03",
      vehicleInDate: "2026-04-04",
      deliveryPlan: "2026-04-05",
      deliveryActual: "2026-04-05",
      deliveryForecast: "2026-04-05",
      deliveryDelayReason: "No Delay"
    },
    {
      pCode: "P-8005",
      component: "Converter Panel",
      subComponent: "Root Section",
      dispatchPlanStart: "2026-04-12",
      dispatchActualStart: "2026-04-11",
      dispatchForecastStart: "2026-04-11",
      dispatchStartDelayReason: "No Delay",
      dispatchPlanFinish: "2026-04-12",
      dispatchActualFinish: "2026-04-12",
      dispatchForecastFinish: "2026-04-12",
      dispatchFinishDelayReason: "No Delay",
      frameNo: "FRM-005",
      rootFrameNo: "-",
      tipFrameNo: "-",
      transporter: "XYZ Transport",
      invoiceNumber: "INV-2026-0005",
      invoiceDate: "2026-04-12",
      vehicleNo: "TN-15-AB-1005",
      lrNumber: "LR-0005",
      lrDate: "2026-04-12",
      dcNo: "DC-0005",
      dcDate: "2026-04-12",
      vehicleInDate: "2026-04-13",
      deliveryPlan: "2026-04-14",
      deliveryActual: "2026-04-14",
      deliveryForecast: "2026-04-14",
      deliveryDelayReason: "No Delay"
    },
    {
      pCode: "P-8006",
      component: "Blade",
      subComponent: "Root Section",
      dispatchPlanStart: "2026-04-15",
      dispatchActualStart: "2026-04-14",
      dispatchForecastStart: "2026-04-14",
      dispatchStartDelayReason: "No Delay",
      dispatchPlanFinish: "2026-04-15",
      dispatchActualFinish: "2026-04-15",
      dispatchForecastFinish: "2026-04-15",
      dispatchFinishDelayReason: "No Delay",
      frameNo: "FRM-006",
      rootFrameNo: "RF-006",
      tipFrameNo: "TF-006",
      transporter: "FastMove Cargo",
      invoiceNumber: "INV-2026-0006",
      invoiceDate: "2026-04-15",
      vehicleNo: "TN-16-AB-1006",
      lrNumber: "LR-0006",
      lrDate: "2026-04-15",
      dcNo: "DC-0006",
      dcDate: "2026-04-15",
      vehicleInDate: "2026-04-16",
      deliveryPlan: "2026-04-17",
      deliveryActual: "2026-04-17",
      deliveryForecast: "2026-04-17",
      deliveryDelayReason: "No Delay"
    },
    {
      pCode: "P-8007",
      component: "Tower",
      subComponent: "Root Section",
      dispatchPlanStart: "2026-04-18",
      dispatchActualStart: "2026-04-17",
      dispatchForecastStart: "2026-04-17",
      dispatchStartDelayReason: "No Delay",
      dispatchPlanFinish: "2026-04-18",
      dispatchActualFinish: "2026-04-18",
      dispatchForecastFinish: "2026-04-18",
      dispatchFinishDelayReason: "No Delay",
      frameNo: "FRM-007",
      rootFrameNo: "-",
      tipFrameNo: "-",
      transporter: "ABC Logistics",
      invoiceNumber: "INV-2026-0007",
      invoiceDate: "2026-04-18",
      vehicleNo: "TN-17-AB-1007",
      lrNumber: "LR-0007",
      lrDate: "2026-04-18",
      dcNo: "DC-0007",
      dcDate: "2026-04-18",
      vehicleInDate: "2026-04-19",
      deliveryPlan: "2026-04-20",
      deliveryActual: "2026-04-20",
      deliveryForecast: "2026-04-20",
      deliveryDelayReason: "No Delay"
    },
    {
      pCode: "P-8008",
      component: "Nacelle",
      subComponent: "Root Section",
      dispatchPlanStart: "2026-04-21",
      dispatchActualStart: "2026-04-20",
      dispatchForecastStart: "2026-04-20",
      dispatchStartDelayReason: "No Delay",
      dispatchPlanFinish: "2026-04-21",
      dispatchActualFinish: "2026-04-21",
      dispatchForecastFinish: "2026-04-21",
      dispatchFinishDelayReason: "No Delay",
      frameNo: "FRM-008",
      rootFrameNo: "-",
      tipFrameNo: "-",
      transporter: "XYZ Transport",
      invoiceNumber: "INV-2026-0008",
      invoiceDate: "2026-04-21",
      vehicleNo: "TN-18-AB-1008",
      lrNumber: "LR-0008",
      lrDate: "2026-04-21",
      dcNo: "DC-0008",
      dcDate: "2026-04-21",
      vehicleInDate: "2026-04-22",
      deliveryPlan: "2026-04-23",
      deliveryActual: "2026-04-23",
      deliveryForecast: "2026-04-23",
      deliveryDelayReason: "No Delay"
    },
    {
      pCode: "P-8009",
      component: "Hub",
      subComponent: "Root Section",
      dispatchPlanStart: "2026-04-24",
      dispatchActualStart: "2026-04-23",
      dispatchForecastStart: "2026-04-23",
      dispatchStartDelayReason: "No Delay",
      dispatchPlanFinish: "2026-04-24",
      dispatchActualFinish: "2026-04-24",
      dispatchForecastFinish: "2026-04-24",
      dispatchFinishDelayReason: "No Delay",
      frameNo: "FRM-009",
      rootFrameNo: "-",
      tipFrameNo: "-",
      transporter: "FastMove Cargo",
      invoiceNumber: "INV-2026-0009",
      invoiceDate: "2026-04-24",
      vehicleNo: "TN-10-AB-1009",
      lrNumber: "LR-0009",
      lrDate: "2026-04-24",
      dcNo: "DC-0009",
      dcDate: "2026-04-24",
      vehicleInDate: "2026-04-25",
      deliveryPlan: "2026-04-26",
      deliveryActual: "2026-04-26",
      deliveryForecast: "2026-04-26",
      deliveryDelayReason: "No Delay"
    },
    {
      pCode: "P-8010",
      component: "Converter Panel",
      subComponent: "Root Section",
      dispatchPlanStart: "2026-04-27",
      dispatchActualStart: "2026-04-26",
      dispatchForecastStart: "2026-04-26",
      dispatchStartDelayReason: "No Delay",
      dispatchPlanFinish: "2026-04-27",
      dispatchActualFinish: "2026-04-27",
      dispatchForecastFinish: "2026-04-27",
      dispatchFinishDelayReason: "No Delay",
      frameNo: "FRM-010",
      rootFrameNo: "-",
      tipFrameNo: "-",
      transporter: "ABC Logistics",
      invoiceNumber: "INV-2026-0010",
      invoiceDate: "2026-04-27",
      vehicleNo: "TN-11-AB-1010",
      lrNumber: "LR-0010",
      lrDate: "2026-04-27",
      dcNo: "DC-0010",
      dcDate: "2026-04-27",
      vehicleInDate: "2026-04-28",
      deliveryPlan: "2026-04-29",
      deliveryActual: "2026-04-29",
      deliveryForecast: "2026-04-29",
      deliveryDelayReason: "No Delay"
    },
  ];

  exportDispatch(){
    try {
      this.chooseDownloadTemplate = true;      
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

  downloadTemplate(){
    try {
      this.messageService.add({
        severity: 'info',
        summary: 'Coming Soon',
        detail: 'Dispatch template download will be available soon.'
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
          detail: 'Dispatch template upload will be available soon.'
        });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editDispatch(dispatch: any){
    this.selectedDispatch = dispatch;
    this.showDispatchDetailsModal = true;
  }

  submitDispatchDetails(){
    if (!this.selectedDispatch?.pCode) return;

    this.showDispatchDetailsModal = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Dispatch details updated.' });
  }

  deleteDispatch(dispatch: any){
    this.confirmationService.confirm({
      message: `Do you want to delete the dispatch record for ${dispatch.pCode} (${dispatch.frameNo})?`,
      header: 'Delete Dispatch Record',
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
        this.wtgDispatchPlanList = this.wtgDispatchPlanList.filter(d => d !== dispatch);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Dispatch record deleted.' });
      }
    });
  }

  // Stub handlers — wire to real edit/delete APIs once dispatch plan CRUD is available.
  dispatchMenu(event: Event, menu: any, dispatch: any) {
    this.items = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => console.log('edit', dispatch) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('delete', dispatch) },
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command: () => this.openImportDialog()
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: () => this.exportDispatch()
      }
    ];
    menu.toggle(event);
  }
}