import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule }    from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule }  from 'primeng/textarea';
import { SelectModule }    from 'primeng/select';
import { DatePickerModule }from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { TableModule }     from 'primeng/table';
import { ToastModule }     from 'primeng/toast';
import { CardModule }      from 'primeng/card';
import { MessageService }  from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield'; 
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FluidModule } from 'primeng/fluid';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-component-allocation',
  imports: [ CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    SelectModule, DatePickerModule,
    AccordionModule, TableModule,
    ToastModule, CardModule,IconFieldModule,TagModule,InputIconModule,DialogModule,ConfirmDialogModule,
    FluidModule,ReactiveFormsModule,MultiSelectModule,CheckboxModule],
  templateUrl: './component-allocation.html',
  styleUrl: './component-allocation.css',
})
export class ComponentAllocation {
 componentAllocationList = [
  {
    slNo: 1,
    component: 'Blade',
    plantName: 'Plant A',
    plantManager: 'Ravi Kumar',
    projectCode: 'P-8001',
    allocatedQuantity: 25
  },
  {
    slNo: 2,
    component: 'Nacelle',
    plantName: 'Plant B',
    plantManager: 'Suresh Reddy',
    projectCode: 'P-8002',
    allocatedQuantity: 15
  },
  {
    slNo: 3,
    component: 'Hub',
    plantName: 'Plant C',
    plantManager: 'Manjunath H',
    projectCode: 'P-8003',
    allocatedQuantity: 10
  },
  {
    slNo: 4,
    component: 'Tower',
    plantName: 'Plant D',
    plantManager: 'Lakshmi Devi',
    projectCode: 'P-8004',
    allocatedQuantity: 30
  },
  {
    slNo: 5,
    component: 'Converter Panel',
    plantName: 'Plant E',
    plantManager: 'Arjun Naik',
    projectCode: 'P-8005',
    allocatedQuantity: 20
  },
  {
    slNo: 6,
    component: 'Blade',
    plantName: 'Plant B',
    plantManager: 'Suresh Reddy',
    projectCode: 'P-8006',
    allocatedQuantity: 18
  },
  {
    slNo: 7,
    component: 'Nacelle',
    plantName: 'Plant C',
    plantManager: 'Manjunath H',
    projectCode: 'P-8007',
    allocatedQuantity: 12
  },
  {
    slNo: 8,
    component: 'Hub',
    plantName: 'Plant A',
    plantManager: 'Ravi Kumar',
    projectCode: 'P-8008',
    allocatedQuantity: 22
  },
  {
    slNo: 9,
    component: 'Tower',
    plantName: 'Plant D',
    plantManager: 'Lakshmi Devi',
    projectCode: 'P-8009',
    allocatedQuantity: 16
  },
  {
    slNo: 10,
    component: 'Converter Panel',
    plantName: 'Plant E',
    plantManager: 'Arjun Naik',
    projectCode: 'P-8010',
    allocatedQuantity: 24
  }
];
}
