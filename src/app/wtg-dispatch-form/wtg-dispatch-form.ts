import { Component, inject } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-wtg-dispatch-form',
  imports: [Shared],
  templateUrl: './wtg-dispatch-form.html',
  styleUrl: './wtg-dispatch-form.css',
})
export class WtgDispatchForm {
  showDetails = false;

  selectedPCode: any;
  wtgDetails: any = {};

  dispatchConfigList: any[] = [];

  private fb = inject(FormBuilder);

  constructor(private messageService: MessageService){}

  dispatchConfigForm = this.fb.group({
    componentName: [''],
    planStartDate: [''],
    vehiclesCount: [0],
    deliveryDuration: [0],
    unloadDuration: [0]
  })

  pCodeDetailsMap: any = {
    'P-8001': {
      wtgType: 'WTG-A',
      capacity: '2.5 MW',
      towerType: 'Tower-X',
      bladeType: 'Blade-A',
      totalQty: 10
    },
    'P-8002': {
      wtgType: 'WTG-B',
      capacity: '3 MW',
      towerType: 'Tower-Y',
      bladeType: 'Blade-B',
      totalQty: 8
    }
  };

  projectChange(event: any){
    this.selectedPCode = event.value;

    if (this.selectedPCode) {
      this.wtgDetails = this.pCodeDetailsMap[this.selectedPCode];
      this.showDetails = true;
    }
  }

  addConfiguration(){
    try {
      console.log(this.dispatchConfigForm.value);

      const formValue = this.dispatchConfigForm.value;
      const selectedComponent = formValue.componentName;

      if(!selectedComponent) return;

      this.dispatchConfigList.push(this.dispatchConfigForm.value);

      this.componentList = this.componentList.filter(
        comp => comp.value !== selectedComponent
      );

      this.dispatchConfigForm.reset();

      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Dispatch Configuraion Added Successfully'});
    } catch (error) {
      console.log(error);
    }
  }

  removeConfiguration(index: number){
    try {
      const removedItem = this.dispatchConfigList[index];

      this.dispatchConfigList = this.dispatchConfigList.filter((_, i) => i !== index);

      const alreadyExists = this.componentList.some(
        comp => comp.value === removedItem.componentName
      );

      if (!alreadyExists) {
        this.componentList = [
          ...this.componentList,
          {
            label: removedItem.componentName,
            value: removedItem.componentName
          }
        ]
      }
  
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Dispatch Configuraion Removed Successfully'});
      
    } catch (error) {
      console.log(error);
    }
  }

  pCodeList = [
    {
      label: 'P-8001',
      value: 'P-8001'
    },
    {
      label: 'P-8002',
      value: 'P-8002'
    },
    {
      label: 'P-8003',
      value: 'P-8003'
    },
    {
      label: 'P-8004',
      value: 'P-8004'
    }
  ]

  componentList = [
    {
      label: 'Topflange',
      value: 'Topflange'
    },
    {
      label: 'Bottomflange',
      value: 'Bottomflange'
    },
    {
      label: 'Blade',
      value: 'Blade'
    },
    {
      label: 'Nacelle',
      value: 'Nacelle'
    },
    {
      label: 'Hub',
      value: 'Hub'
    },
    {
      label: 'Tower',
      value: 'Tower'
    },
    {
      label: 'Converter Panel',
      value: 'Converter Panel'
    },
    {
      label: 'Site Accessories',
      value: 'Site Accessories'
    },
    {
      label: 'SCADA',
      value: 'SCADA'
    }
  ]
}
