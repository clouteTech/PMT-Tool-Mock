import { Component } from '@angular/core';
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-wtg-receiving-sub-components',
  imports: [Shared],
  templateUrl: './wtg-receiving.html',
  styleUrl: './wtg-receiving.css',
})
export class WtgReceiving {
  componentDetails = [
    {
      pCode: 'P-8001',
      components: 'Top Flange',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'Bottom Flange',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    },
    {
      pCode: 'P-8001',
      components: 'Nacelle',
      subComponent: 'Root Section',
      locationId: 'ENV 2',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'Hub',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    },
    {
      pCode: 'P-8001',
      components: 'Blade 1',
      subComponent: 'Root Section',
      locationId: 'ENV 2',
      maximoId: 'Maximo 2'
    },
    {
      pCode: 'P-8001',
      components: 'Blade 2',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'Blade 3',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'Tower 1',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'Tower 2',
      subComponent: 'Root Section',
      locationId: 'ENV 2',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'Tower 3',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'Tower 4',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    },
    {
      pCode: 'P-8001',
      components: 'Tower 5',
      subComponent: 'Root Section',
      locationId: 'ENV 2',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'Converter Panel',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    },
    {
      pCode: 'P-8001',
      components: 'Site Accessories',
      subComponent: 'Root Section',
      locationId: 'ENV 2',
      maximoId: 'Maximo 1'
    },
    {
      pCode: 'P-8001',
      components: 'SCADA',
      subComponent: 'Root Section',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    }
  ];

  wtgList = [
    {
      id: 1,
      wtgCode: 'WTG-001',
      componentDetails: this.componentDetails
    },
    {
      id: 2,
      wtgCode: 'WTG-002',
      componentDetails: this.componentDetails
    }
  ];

  componentConditionList = [
    {
      label: 'Good',
      value: 'Good'
    },
    {
      label: 'Damage',
      value: 'Damage'
    }
  ]

  returnStatusList = [
    {
      label: 'Returned',
      value: true
    },
    {
      label: 'Pending',
      value: false
    }
  ]
}