import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-customer-wise-quality-config',
  imports: [Shared],
  templateUrl: './customer-wise-quality-config.html',
  styleUrl: './customer-wise-quality-config.css',
})
export class CustomerWiseQualityConfig {
  qualityConfigList: any[] = [];

  private fb = inject(FormBuilder);

  constructor(private messageService: MessageService){}
  
  qualityConfigurationForm = this.fb.group({
    componentName: [''],
    inspectionLagDays: [0],
    mdccLagDays: [0]
  })

  addConfiguration(){
    try {
      const formValue = this.qualityConfigurationForm.value;
      const selectedComponent = formValue.componentName;

      if(!selectedComponent) return;

      this.qualityConfigList.push(this.qualityConfigurationForm.value);

      this.componentList = this.componentList.filter(
        comp => comp.value !== selectedComponent
      );

      this.qualityConfigurationForm.reset();
  
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Quality Configuraion Added Successfully'});
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeQualityConfig(index: number) {
    try {
      const removedItem = this.qualityConfigList[index];

      this.qualityConfigList = this.qualityConfigList.filter((_, i) => i !== index);

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

      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Quality Configuraion Removed Successfully'});
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitAllConfigurations(){
    try {
      if (this.componentList.length > 0) {
        const pending = this.componentList.map(c => c.label).join(', ');

        this.messageService.add({severity: 'warn', summary: 'Incomplete Configuration', detail: `Please configure all components: ${pending}`});

        return;
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'All components configured successfully'
      });
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
