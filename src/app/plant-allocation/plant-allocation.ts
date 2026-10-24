import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule }  from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-plant-allocation',
  imports: [CommonModule, FloatLabelModule, SelectModule, TableModule, ButtonModule, InputTextModule, ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './plant-allocation.html',
  styleUrl: './plant-allocation.css',
})
export class PlantAllocation {
  selectedComponent: any = null;
  selectedQty = 0;
  remainingQty = 0;

  allocations: any[] = [];
  selectedComponents: any[] = [];

  private fb = inject(FormBuilder);

  constructor(private messageService: MessageService){}

  allocationForm = this.fb.group({
    qty: [0],
    plantName: [''],
    plantManager: ['']
  })

  ngOnInit(): void {
    const state = history.state;

    if (state?.components) {
      console.log(state.components);

      // this.selectedComponents = state.components;
      this.groupComponents(state.components);
    }
  }

  groupComponents(components: any[]){
    const map = new Map();

    components.forEach(item => {
      if (map.has(item.componentName)) {
        map.get(item.componentName).count += 1;
      } else {
        map.set(item.componentName, {
          componentName: item.componentName,
          count: 1
        });
      }
    });

    this.selectedComponents = Array.from(map.values());
  }

  componentChange(component: any){
    console.log(component);
    this.selectedComponent = component;
    this.selectedQty = component.count;
    this.remainingQty = component.count;
  }

  addAllocations(){
    const qty: number = this.allocationForm.get('qty')?.value ?? 0;
    // p-select without [optionValue] binds the whole { label, value } option object.
    const plantNameOption = this.allocationForm.get('plantName')?.value as any;
    const plantManagerOption = this.allocationForm.get('plantManager')?.value as any;

    if (!this.selectedComponent) {
      this.messageService.add({ severity: 'warn', summary: 'Select Component', detail: 'Please select a component before allocating.' });
      return;
    }
    if (!qty || qty <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Invalid Qty', detail: 'Please enter a quantity greater than 0.' });
      return;
    }
    if (qty > this.remainingQty) {
      this.messageService.add({ severity: 'warn', summary: 'Qty Exceeds Remaining', detail: `Only ${this.remainingQty} left to allocate for ${this.selectedComponent.componentName}.` });
      return;
    }
    if (!plantNameOption || !plantManagerOption) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Details', detail: 'Please select both plant and plant manager.' });
      return;
    }

    this.allocations.push({
      componentName: this.selectedComponent.componentName,
      qty,
      plantName: plantNameOption.label,
      plantManager: plantManagerOption.label
    });

    this.remainingQty -= qty;
    this.allocationForm.reset({ qty: 0, plantName: '', plantManager: '' });
  }

  getGrandTotal(){
    return this.allocations.reduce((sum, a) => sum + (a.qty || 0), 0);
  }

  submitAllocations(){
    if (!this.allocations.length) {
      this.messageService.add({ severity: 'warn', summary: 'Nothing to Submit', detail: 'Add at least one allocation before submitting.' });
      return;
    }

    console.log('Submitting allocations', this.allocations);

    this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Allocations submitted successfully.' });

    this.allocations = [];
    this.selectedComponent = null;
    this.selectedQty = 0;
    this.remainingQty = 0;
  }

  plantNameList = [
    {
      label: 'Chennai',
      value: 'Chennai'
    },
    {
      label: 'Tirichy',
      value: 'Tirichy'
    },
    {
      label: 'Pune',
      value: 'Pune'
    },
    {
      label: 'Gujarat',
      value: 'Gujarat'
    },
    {
      label: 'Tuticorin',
      value: 'Tuticorin'
    },
    {
      label: 'Bengaluru',
      value: 'Bengaluru'
    }
  ];

  plantManagerList = [
    {
      label: 'Suresh Reddy',
      value: 'Suresh Reddy'
    },
    {
      label: 'Lakshmi Devi',
      value: 'Lakshmi Devi'
    },
    {
      label: 'Anitha Rao',
      value: 'Anitha Rao'
    }
  ];


  removeAllocation(index: number, allocate: any){
    this.remainingQty += allocate.qty;
    this.allocations.splice(index, 1);
  }
}
