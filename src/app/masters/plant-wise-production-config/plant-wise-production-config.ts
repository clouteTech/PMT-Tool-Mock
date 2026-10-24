import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-plant-wise-production-config',
  imports: [Shared],
  templateUrl: './plant-wise-production-config.html',
  styleUrl: './plant-wise-production-config.css',
})
export class PlantWiseProductionConfig {
  assignedComponents: any[] = [];
  productionConfigList: any[] = [];

  private fb = inject(FormBuilder);

  assignComponentForm = this.fb.group({
    componentName: this.fb.control<string[] | null>([])
  });

  productionConfigForm = this.fb.group({
    selectedComponent: this.fb.control<string | null>(null),
    duration: [0],
    units: [0],
    productionDays: [0]
  });

  constructor(private messageService: MessageService){}

  assignComponents() {
    try {
      const selectedComponents = this.assignComponentForm.get('componentName')?.value ?? [];

      selectedComponents.forEach((comp: string) => {
        const alreadyExists = this.assignedComponents.some(c => c.value === comp);

        if (!alreadyExists) {
          this.assignedComponents.push({
            label: comp,
            value: comp
          });
        }
      });
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Component(s) Assigned Successfully'});

      this.assignComponentForm.reset();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  addConfiguration(){
    try {
      const formValue = this.productionConfigForm.value;

      const selectedComponent = formValue.selectedComponent;

      if(!selectedComponent) return;

      this.productionConfigList = [
        ...this.productionConfigList,
        formValue
      ];

      this.assignedComponents = this.assignedComponents.filter(
        comp => comp.value !== selectedComponent
      );

      this.productionConfigForm.reset();

      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Production Configuraion Added Successfully'});
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeProductionConfig(index: number){
    try {
      const removedItem = this.productionConfigList[index];

      this.productionConfigList = this.productionConfigList.filter((_, i) => i !== index);

      const alreadyExists = this.assignedComponents.some(
        comp => comp.value === removedItem.selectedComponent
      );

      if (!alreadyExists) {
        this.assignedComponents = [
          ...this.assignedComponents,
          {
            label: removedItem.selectedComponent,
            value: removedItem.selectedComponent
          }
        ]
      }

      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Production Configuraion Removed Successfully'});

    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

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
