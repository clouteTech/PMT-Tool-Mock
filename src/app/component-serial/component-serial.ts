import { Component, inject } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { TableModule }  from 'primeng/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectModule } from 'primeng/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_COMPONENT_SERIAL_LIST: any[] = [
  { slNo: 1, componentName: 'Topflange', serialNumber: '-', status: 'CREATED', plantName: '-', productionManager: '-', planStart: '-', planFinish: '-' },
  { slNo: 2, componentName: 'Bottomflange', serialNumber: '-', status: 'CREATED', plantName: '-', productionManager: '-', planStart: '-', planFinish: '-' },
  { slNo: 3, componentName: 'Blade', serialNumber: 'B-001', status: 'ASSIGNED', plantName: 'Chennai', productionManager: 'PM-1', planStart: '2026-03-01', planFinish: '2026-03-02' },
  { slNo: 4, componentName: 'Blade', serialNumber: 'B-002', status: 'ASSIGNED', plantName: 'Chennai', productionManager: 'PM-1', planStart: '2026-03-01', planFinish: '2026-03-02' },
  { slNo: 5, componentName: 'Nacelle', serialNumber: 'N-001', status: 'IN_PROGRESS', plantName: 'Chennai', productionManager: 'PM-1', planStart: '2026-03-02', planFinish: '2026-03-05' },
  { slNo: 6, componentName: 'Hub', serialNumber: '-', status: 'CREATED', plantName: '-', productionManager: '-', planStart: '-', planFinish: '-' },
  { slNo: 7, componentName: 'Tower', serialNumber: 'T-001', status: 'COMPLETED', plantName: 'Trichy', productionManager: 'PM-2', planStart: '2026-02-20', planFinish: '2026-02-28' },
  { slNo: 8, componentName: 'Converter Panel', serialNumber: '-', status: 'CREATED', plantName: '-', productionManager: '-', planStart: '-', planFinish: '-' },
  { slNo: 9, componentName: 'Site Accessories', serialNumber: '-', status: 'CREATED', plantName: '-', productionManager: '-', planStart: '-', planFinish: '-' },
  { slNo: 10, componentName: 'SCADA', serialNumber: 'S-001', status: 'IN_PROGRESS', plantName: 'Chennai', productionManager: 'PM-1', planStart: '2026-03-04', planFinish: '2026-03-06' },
  { slNo: 11, componentName: 'Blade', serialNumber: 'B-003', status: 'ASSIGNED', plantName: 'Trichy', productionManager: 'PM-2', planStart: '2026-03-01', planFinish: '2026-03-02' },
  { slNo: 12, componentName: 'Tower', serialNumber: 'T-002', status: 'COMPLETED', plantName: 'Trichy', productionManager: 'PM-2', planStart: '2026-02-21', planFinish: '2026-03-01' },
];

@Component({
  selector: 'app-component-serial',
  imports: [MenuModule, TableModule, SelectModule, TagModule, ButtonModule, DialogModule, FloatLabelModule, InputTextModule, Shared],
  templateUrl: './component-serial.html',
  styleUrl: './component-serial.css',
})
export class ComponentSerial {
  showPlanDetailsModal = false;

  monthlyDemandPlanId = 0;

  items: MenuItem[] = [];
  actionItems: MenuItem[] = [];

  statuses!: any[];
  plantNameList: any[] = [];
  selectedComponents: any[] = [];
  componentSerialList: any[] = [];

  private router = inject(Router);

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, 
    private messageService: MessageService, private apiService: Apiservice){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.actionItems = this.getActionItems();

    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      console.log(id);

      if (id) {
        this.monthlyDemandPlanId = Number(id);
        this.fetchAllComponentSerialList();
      }
    })

    this.statuses = [
      { label: 'CREATED', value: 'CREATED' },
      { label: 'COMPLETED', value: 'COMPLETED' },
      { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
      { label: 'ASSIGNED', value: 'ASSIGNED' }
    ];

    this.plantNameList = [
      { label: 'Chennai', value: 'Chennai' },
      { label: 'Trichy', value: 'Trichy' }
    ];
  }

  fetchAllComponentSerialList(){
    try {
      const data = {
        planId: this.monthlyDemandPlanId
      }

      console.log(data);

      this.apiService.fetchAllComponentSerialList(data).subscribe({
        next: val => {
          console.log(val);
          this.componentSerialList = val.data.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.componentSerialList = MOCK_COMPONENT_SERIAL_LIST;
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.componentSerialList = MOCK_COMPONENT_SERIAL_LIST;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  //   componentSerialList = [
  //   {
  //     slNo: 1,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 2,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 3,
  //     componentName: 'Blade',
  //     serialNumber: 'B-001',
  //     status: 'Assigned',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-01',
  //     planFinish: '2026-03-02'
  //   },
  //   {
  //     slNo: 4,
  //     componentName: 'Blade',
  //     serialNumber: 'B-002',
  //     status: 'Assigned',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-01',
  //     planFinish: '2026-03-02'
  //   },
  //   {
  //     slNo: 5,
  //     componentName: 'Blade',
  //     serialNumber: 'B-003',
  //     status: 'Assigned',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-01',
  //     planFinish: '2026-03-02'
  //   },
  //   {
  //     slNo: 6,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 7,
  //     componentName: 'Hub',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 8,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 9,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 10,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 11,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 12,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 13,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 14,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 15,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 16,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 17,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 18,
  //     componentName: 'Blade',
  //     serialNumber: 'B-004',
  //     status: 'Assigned',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-03',
  //     planFinish: '2026-03-04'
  //   },
  //   {
  //     slNo: 19,
  //     componentName: 'Blade',
  //     serialNumber: 'B-005',
  //     status: 'Assigned',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-03',
  //     planFinish: '2026-03-04'
  //   },
  //   {
  //     slNo: 20,
  //     componentName: 'Blade',
  //     serialNumber: 'B-006',
  //     status: 'Ready',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-03',
  //     planFinish: '2026-03-04'
  //   },
  //   {
  //     slNo: 21,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 22,
  //     componentName: 'Hub',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 23,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 24,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 25,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 26,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 27,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 28,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 29,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 30,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 31,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 32,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 33,
  //     componentName: 'Blade',
  //     serialNumber: 'B-007',
  //     status: 'Ready',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-05',
  //     planFinish: '2026-03-06'
  //   },
  //   {
  //     slNo: 34,
  //     componentName: 'Blade',
  //     serialNumber: 'B-008',
  //     status: 'Ready',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-05',
  //     planFinish: '2026-03-06'
  //   },
  //   {
  //     slNo: 35,
  //     componentName: 'Blade',
  //     serialNumber: 'B-009',
  //     status: 'Ready',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-05',
  //     planFinish: '2026-03-06'
  //   },
  //   {
  //     slNo: 36,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 37,
  //     componentName: 'Hub',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 38,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 39,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 40,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 41,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 42,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 43,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-07',
  //     planFinish: '2026-03-08'
  //   },
  //   {
  //     slNo: 44,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-07',
  //     planFinish: '2026-03-08'
  //   },
  //   {
  //     slNo: 45,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Chennai',
  //     productionManager: 'PM-1',
  //     planStart: '2026-03-07',
  //     planFinish: '2026-03-08'
  //   },
  //   {
  //     slNo: 46,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 47,
  //     componentName: 'Hub',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 48,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 49,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 50,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 51,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 52,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 53,
  //     componentName: 'Blade',
  //     serialNumber: 'B-013',
  //     status: 'Assigned',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '2026-03-01',
  //     planFinish: '2026-03-02'
  //   },
  //   {
  //     slNo: 54,
  //     componentName: 'Blade',
  //     serialNumber: 'B-014',
  //     status: 'Assigned',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '2026-03-01',
  //     planFinish: '2026-03-02'
  //   },
  //   {
  //     slNo: 55,
  //     componentName: 'Blade',
  //     serialNumber: 'B-015',
  //     status: 'Assigned',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '2026-03-01',
  //     planFinish: '2026-03-02'
  //   },
  //   {
  //     slNo: 56,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 57,
  //     componentName: 'Hub',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 58,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 59,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 60,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 61,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 62,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 63,
  //     componentName: 'Blade',
  //     serialNumber: 'B-016',
  //     status: 'Ready',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '2026-03-03',
  //     planFinish: '2026-03-04'
  //   },
  //   {
  //     slNo: 64,
  //     componentName: 'Blade',
  //     serialNumber: 'B-017',
  //     status: 'Ready',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '2026-03-03',
  //     planFinish: '2026-03-04'
  //   },
  //   {
  //     slNo: 65,
  //     componentName: 'Blade',
  //     serialNumber: 'B-018',
  //     status: 'Ready',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '2026-03-03',
  //     planFinish: '2026-03-04'
  //   },
  //   {
  //     slNo: 66,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 67,
  //     componentName: 'Hub',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 68,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 69,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 70,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 71,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 72,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 73,
  //     componentName: 'Blade',
  //     serialNumber: 'B-019',
  //     status: 'Ready',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '2026-03-05',
  //     planFinish: '2026-03-06'
  //   },
  //   {
  //     slNo: 74,
  //     componentName: 'Blade',
  //     serialNumber: 'B-020',
  //     status: 'Ready',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '2026-03-05',
  //     planFinish: '2026-03-06'
  //   },
  //   {
  //     slNo: 75,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 76,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 77,
  //     componentName: 'Hub',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 78,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 79,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 80,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 81,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 82,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 83,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 84,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 85,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 86,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 87,
  //     componentName: 'Hub',
  //   serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 88,
  //     componentName: 'Tower',
  //    serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 89,
  //     componentName: 'Tower',
  //     seriaserialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 90,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 91,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 92,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 93,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 94,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 95,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 96,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 97,
  //     componentName: 'Topflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 98,
  //     componentName: 'Bottomflange',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 99,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 100,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 101,
  //     componentName: 'Blade',
  //     serialNumber: '-',
  //     status: 'Allocated',
  //     plantName: 'Trichy',
  //     productionManager: 'PM-2',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 102,
  //     componentName: 'Nacelle',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 103,
  //     componentName: 'Hub',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 104,
  //     componentName: 'Tower',
  //    serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 105,
  //     componentName: 'Tower',
  //     seriaserialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 106,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 107,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 108,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 109,
  //     componentName: 'Tower',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 110,
  //     componentName: 'Converter Panel',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 111,
  //     componentName: 'Site Accessories',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  //   {
  //     slNo: 112,
  //     componentName: 'SCADA',
  //     serialNumber: '-',
  //     status: 'Created',
  //     plantName: '-',
  //     productionManager: '-',
  //     planStart: '-',
  //     planFinish: '-'
  //   },
  // ];

  getSafeSvg(svg: string): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getMenuItems(){
    return [
      {
        label: 'View',
        svgIcon: `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <path fill="currentColor" d="M21.92 11.6C19.9 6.91 16.1 4 12 4s-7.9 2.91-9.92 7.6a1 1 0 0 0 0 .8C4.1 17.09 7.9 20 12 20s7.9-2.91 9.92-7.6a1 1 0 0 0 0-.8M12 18c-3.17 0-6.17-2.29-7.9-6C5.83 8.29 8.83 6 12 6s6.17 2.29 7.9 6c-1.73 3.71-4.73 6-7.9 6m0-10a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2" />
          </svg>
        `,
        command: () => this.openPlanDetails()
      }
    ]
  }

  getActionItems(){
    return [
      {
        label: 'Plant Allocation',
        command: () => {
          const payload = this.selectedComponents.map(row => ({
            slNo: row.slNo,
            componentName: row.componentName
          }));

          this.router.navigate(['/plantAllocation'], {
            state: { components: payload }
          })
        }
      }
    ]
  }

    openPlanDetails(){
    try {
      this.showPlanDetailsModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getSeverity(status: string) {
    switch (status) {
        case 'CREATED':
            return 'info';
    
        case 'COMPLETED':
            return 'success';
    
        case 'IN_PROGRESS':
            return 'warn';
    
        case 'ASSIGNED':
            return 'success';

        default:
          return null;
    }
  }
}
