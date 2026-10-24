import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MenuItem, MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';
import { Router } from '@angular/router';


export interface WtgRow {
  wtgId: string;
  locationNo: string;
  maximoId: string;
}

export interface SummaryRow {
  projectCode: string;
  projectName: string;
  totalWtgs: number;
}

export interface ViewColumn {
  field: string;
  header: string;
  stepLabel: string;
  type: 'date' | 'text' | 'number';
  stepIdx: number;
}

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_FOUNDATION_PROJECTS: any[] = [
  { projectId: 1, projectCode: 'ENV-P101', projectName: 'Kutch Wind Farm Phase 1', totalWtgs: 12, customer: { customerId: 1, customerName: 'Adani Green Energy Ltd' } },
  { projectId: 2, projectCode: 'ENV-P102', projectName: 'Jaisalmer Cluster Phase 2', totalWtgs: 8, customer: { customerId: 2, customerName: 'ReNew Power Pvt Ltd' } },
  { projectId: 3, projectCode: 'ENV-P103', projectName: 'Bhuj Coastal Wind Project', totalWtgs: 15, customer: { customerId: 3, customerName: 'Tata Power Renewable Energy' } },
  { projectId: 4, projectCode: 'ENV-P104', projectName: 'Kayathar Wind Farm', totalWtgs: 6, customer: { customerId: 4, customerName: 'Suzlon Energy Ltd' } },
  { projectId: 5, projectCode: 'ENV-P105', projectName: 'Chitradurga Wind Corridor', totalWtgs: 10, customer: { customerId: 5, customerName: 'Greenko Energies Pvt Ltd' } },
  { projectId: 6, projectCode: 'ENV-P106', projectName: 'Kutch Bhuj Extension Phase 3', totalWtgs: 9, customer: { customerId: 6, customerName: 'CleanMax Enviro Energy' } },
  { projectId: 7, projectCode: 'ENV-P107', projectName: 'Rajkot Wind Energy Park', totalWtgs: 7, customer: { customerId: 7, customerName: 'Sembcorp Green Infra' } },
  { projectId: 8, projectCode: 'ENV-P108', projectName: 'Tuticorin Coastal Cluster', totalWtgs: 11, customer: { customerId: 8, customerName: 'Vestas Wind Technology India' } },
  { projectId: 9, projectCode: 'ENV-P109', projectName: 'Anantapur Wind Complex', totalWtgs: 14, customer: { customerId: 9, customerName: 'Torrent Power Ltd' } },
  { projectId: 10, projectCode: 'ENV-P110', projectName: 'Dhule Wind Energy Farm', totalWtgs: 5, customer: { customerId: 10, customerName: 'Continuum Green Energy' } },
];

const MOCK_FOUNDATION_WTG_DETAILS: any[] = [
  { location: { locationId: 1, locationCode: 'LOC-01', maximoId: 'MAX-001' }, projectWtg: { wtgCode: 'WTG-01' } },
  { location: { locationId: 2, locationCode: 'LOC-02', maximoId: 'MAX-002' }, projectWtg: { wtgCode: 'WTG-02' } },
  { location: { locationId: 3, locationCode: 'LOC-03', maximoId: 'MAX-003' }, projectWtg: { wtgCode: 'WTG-03' } },
  { location: { locationId: 4, locationCode: 'LOC-04', maximoId: 'MAX-004' }, projectWtg: { wtgCode: 'WTG-04' } },
  { location: { locationId: 5, locationCode: 'LOC-05', maximoId: 'MAX-005' }, projectWtg: { wtgCode: 'WTG-05' } },
  { location: { locationId: 6, locationCode: 'LOC-06', maximoId: 'MAX-006' }, projectWtg: { wtgCode: 'WTG-06' } },
  { location: { locationId: 7, locationCode: 'LOC-07', maximoId: 'MAX-007' }, projectWtg: { wtgCode: 'WTG-07' } },
  { location: { locationId: 8, locationCode: 'LOC-08', maximoId: 'MAX-008' }, projectWtg: { wtgCode: 'WTG-08' } },
  { location: { locationId: 9, locationCode: 'LOC-09', maximoId: 'MAX-009' }, projectWtg: { wtgCode: 'WTG-09' } },
  { location: { locationId: 10, locationCode: 'LOC-10', maximoId: 'MAX-010' }, projectWtg: { wtgCode: 'WTG-10' } },
];

const MOCK_FOUNDATION_ACTIVITIES: any[] = [
  { wtgCode: 'WTG-01', locationCode: 'LOC-01', maximoId: 'MAX-001',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-02', soilTestActualFinish: '2026-05-06', actualSbc: 18.5 } },
    excavation: { excavation: { excavationActualStart: '2026-05-08', excavationActualFinish: '2026-05-14' } },
    pcc: { pcc: { pccActual: '2026-05-16' } },
    flange: { flange: { bottomFlangeActual: '2026-05-18', topFlangeActual: '2026-05-19' } },
    reinforcement: { reinforcement: { reinforcementActualStart: '2026-05-20', reinforcementActualFinish: '2026-05-25' } },
    earthing: { earthing: { earthingStripActual: '2026-05-26' } },
    shuttering: { shuttering: { shutteringActual: '2026-05-28' } },
    raftCasting: { raftCasting: { raftCastingPlan: '2026-05-30', raftCastingActual: '2026-05-31', raftCastingForecast: '2026-05-30', raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: '2026-06-02', pedestalCastingActual: '2026-06-03', pedestalCastingForecast: '2026-06-02', pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: '2026-06-10', foundationCubeTest21Days: '2026-06-24', foundationCubeTest28Days: '2026-07-01' } },
    grouting: { grouting: { groutingActual: '2026-07-03' } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: '2026-07-10', groutingCubeTest28Days: '2026-07-31' } },
    backfilling: { backfilling: { backfillingActual: '2026-08-02' } },
    approachRoad: { approachRoad: { approachRoadActual: '2026-08-04' } },
    cranePlatform: { cranePlatform: { cranePlatformActual: '2026-08-06' } },
    locationClearance: { locationClearance: { locationClearanceActual: '2026-08-08' } } },
  { wtgCode: 'WTG-02', locationCode: 'LOC-02', maximoId: 'MAX-002',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-03', soilTestActualFinish: '2026-05-07', actualSbc: 19.2 } },
    excavation: { excavation: { excavationActualStart: '2026-05-09', excavationActualFinish: '2026-05-15' } },
    pcc: { pcc: { pccActual: '2026-05-17' } },
    flange: { flange: { bottomFlangeActual: '2026-05-19', topFlangeActual: '2026-05-20' } },
    reinforcement: { reinforcement: { reinforcementActualStart: '2026-05-21', reinforcementActualFinish: '2026-05-26' } },
    earthing: { earthing: { earthingStripActual: '2026-05-27' } },
    shuttering: { shuttering: { shutteringActual: '2026-05-29' } },
    raftCasting: { raftCasting: { raftCastingPlan: '2026-05-31', raftCastingActual: '2026-06-01', raftCastingForecast: '2026-05-31', raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: null, pedestalCastingActual: null, pedestalCastingForecast: '2026-06-05', pedestalCastingDelayReason: 'Rebar delivery delay' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: null, foundationCubeTest21Days: null, foundationCubeTest28Days: null } },
    grouting: { grouting: { groutingActual: null } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: null, groutingCubeTest28Days: null } },
    backfilling: { backfilling: { backfillingActual: null } },
    approachRoad: { approachRoad: { approachRoadActual: null } },
    cranePlatform: { cranePlatform: { cranePlatformActual: null } },
    locationClearance: { locationClearance: { locationClearanceActual: null } } },
  { wtgCode: 'WTG-03', locationCode: 'LOC-03', maximoId: 'MAX-003',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-04', soilTestActualFinish: '2026-05-08', actualSbc: 17.8 } },
    excavation: { excavation: { excavationActualStart: '2026-05-10', excavationActualFinish: '2026-05-16' } },
    pcc: { pcc: { pccActual: '2026-05-18' } },
    flange: { flange: { bottomFlangeActual: '2026-05-20', topFlangeActual: '2026-05-21' } },
    reinforcement: { reinforcement: { reinforcementActualStart: null, reinforcementActualFinish: null } },
    earthing: { earthing: { earthingStripActual: null } },
    shuttering: { shuttering: { shutteringActual: null } },
    raftCasting: { raftCasting: { raftCastingPlan: null, raftCastingActual: null, raftCastingForecast: '2026-06-01', raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: null, pedestalCastingActual: null, pedestalCastingForecast: null, pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: null, foundationCubeTest21Days: null, foundationCubeTest28Days: null } },
    grouting: { grouting: { groutingActual: null } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: null, groutingCubeTest28Days: null } },
    backfilling: { backfilling: { backfillingActual: null } },
    approachRoad: { approachRoad: { approachRoadActual: null } },
    cranePlatform: { cranePlatform: { cranePlatformActual: null } },
    locationClearance: { locationClearance: { locationClearanceActual: null } } },
  { wtgCode: 'WTG-04', locationCode: 'LOC-04', maximoId: 'MAX-004',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-05', soilTestActualFinish: '2026-05-09', actualSbc: 20.1 } },
    excavation: { excavation: { excavationActualStart: '2026-05-11', excavationActualFinish: '2026-05-17' } },
    pcc: { pcc: { pccActual: '2026-05-19' } },
    flange: { flange: { bottomFlangeActual: null, topFlangeActual: null } },
    reinforcement: { reinforcement: { reinforcementActualStart: null, reinforcementActualFinish: null } },
    earthing: { earthing: { earthingStripActual: null } },
    shuttering: { shuttering: { shutteringActual: null } },
    raftCasting: { raftCasting: { raftCastingPlan: null, raftCastingActual: null, raftCastingForecast: null, raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: null, pedestalCastingActual: null, pedestalCastingForecast: null, pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: null, foundationCubeTest21Days: null, foundationCubeTest28Days: null } },
    grouting: { grouting: { groutingActual: null } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: null, groutingCubeTest28Days: null } },
    backfilling: { backfilling: { backfillingActual: null } },
    approachRoad: { approachRoad: { approachRoadActual: null } },
    cranePlatform: { cranePlatform: { cranePlatformActual: null } },
    locationClearance: { locationClearance: { locationClearanceActual: null } } },
  { wtgCode: 'WTG-05', locationCode: 'LOC-05', maximoId: 'MAX-005',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-06', soilTestActualFinish: '2026-05-10', actualSbc: 18.9 } },
    excavation: { excavation: { excavationActualStart: null, excavationActualFinish: null } },
    pcc: { pcc: { pccActual: null } },
    flange: { flange: { bottomFlangeActual: null, topFlangeActual: null } },
    reinforcement: { reinforcement: { reinforcementActualStart: null, reinforcementActualFinish: null } },
    earthing: { earthing: { earthingStripActual: null } },
    shuttering: { shuttering: { shutteringActual: null } },
    raftCasting: { raftCasting: { raftCastingPlan: null, raftCastingActual: null, raftCastingForecast: null, raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: null, pedestalCastingActual: null, pedestalCastingForecast: null, pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: null, foundationCubeTest21Days: null, foundationCubeTest28Days: null } },
    grouting: { grouting: { groutingActual: null } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: null, groutingCubeTest28Days: null } },
    backfilling: { backfilling: { backfillingActual: null } },
    approachRoad: { approachRoad: { approachRoadActual: null } },
    cranePlatform: { cranePlatform: { cranePlatformActual: null } },
    locationClearance: { locationClearance: { locationClearanceActual: null } } },
  { wtgCode: 'WTG-06', locationCode: 'LOC-06', maximoId: 'MAX-006',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-07', soilTestActualFinish: '2026-05-11', actualSbc: 19.6 } },
    excavation: { excavation: { excavationActualStart: '2026-05-13', excavationActualFinish: '2026-05-19' } },
    pcc: { pcc: { pccActual: '2026-05-21' } },
    flange: { flange: { bottomFlangeActual: '2026-05-23', topFlangeActual: '2026-05-24' } },
    reinforcement: { reinforcement: { reinforcementActualStart: '2026-05-25', reinforcementActualFinish: '2026-05-30' } },
    earthing: { earthing: { earthingStripActual: '2026-05-31' } },
    shuttering: { shuttering: { shutteringActual: '2026-06-02' } },
    raftCasting: { raftCasting: { raftCastingPlan: '2026-06-04', raftCastingActual: '2026-06-05', raftCastingForecast: '2026-06-04', raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: '2026-06-07', pedestalCastingActual: '2026-06-08', pedestalCastingForecast: '2026-06-07', pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: '2026-06-15', foundationCubeTest21Days: '2026-06-29', foundationCubeTest28Days: '2026-07-06' } },
    grouting: { grouting: { groutingActual: '2026-07-08' } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: '2026-07-15', groutingCubeTest28Days: '2026-08-05' } },
    backfilling: { backfilling: { backfillingActual: '2026-08-07' } },
    approachRoad: { approachRoad: { approachRoadActual: '2026-08-09' } },
    cranePlatform: { cranePlatform: { cranePlatformActual: '2026-08-11' } },
    locationClearance: { locationClearance: { locationClearanceActual: '2026-08-13' } } },
  { wtgCode: 'WTG-07', locationCode: 'LOC-07', maximoId: 'MAX-007',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-08', soilTestActualFinish: '2026-05-12', actualSbc: 21.3 } },
    excavation: { excavation: { excavationActualStart: '2026-05-14', excavationActualFinish: '2026-05-20' } },
    pcc: { pcc: { pccActual: '2026-05-22' } },
    flange: { flange: { bottomFlangeActual: null, topFlangeActual: null } },
    reinforcement: { reinforcement: { reinforcementActualStart: null, reinforcementActualFinish: null } },
    earthing: { earthing: { earthingStripActual: null } },
    shuttering: { shuttering: { shutteringActual: null } },
    raftCasting: { raftCasting: { raftCastingPlan: null, raftCastingActual: null, raftCastingForecast: null, raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: null, pedestalCastingActual: null, pedestalCastingForecast: null, pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: null, foundationCubeTest21Days: null, foundationCubeTest28Days: null } },
    grouting: { grouting: { groutingActual: null } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: null, groutingCubeTest28Days: null } },
    backfilling: { backfilling: { backfillingActual: null } },
    approachRoad: { approachRoad: { approachRoadActual: null } },
    cranePlatform: { cranePlatform: { cranePlatformActual: null } },
    locationClearance: { locationClearance: { locationClearanceActual: null } } },
  { wtgCode: 'WTG-08', locationCode: 'LOC-08', maximoId: 'MAX-008',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-09', soilTestActualFinish: '2026-05-13', actualSbc: 18.2 } },
    excavation: { excavation: { excavationActualStart: null, excavationActualFinish: null } },
    pcc: { pcc: { pccActual: null } },
    flange: { flange: { bottomFlangeActual: null, topFlangeActual: null } },
    reinforcement: { reinforcement: { reinforcementActualStart: null, reinforcementActualFinish: null } },
    earthing: { earthing: { earthingStripActual: null } },
    shuttering: { shuttering: { shutteringActual: null } },
    raftCasting: { raftCasting: { raftCastingPlan: null, raftCastingActual: null, raftCastingForecast: null, raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: null, pedestalCastingActual: null, pedestalCastingForecast: null, pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: null, foundationCubeTest21Days: null, foundationCubeTest28Days: null } },
    grouting: { grouting: { groutingActual: null } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: null, groutingCubeTest28Days: null } },
    backfilling: { backfilling: { backfillingActual: null } },
    approachRoad: { approachRoad: { approachRoadActual: null } },
    cranePlatform: { cranePlatform: { cranePlatformActual: null } },
    locationClearance: { locationClearance: { locationClearanceActual: null } } },
  { wtgCode: 'WTG-09', locationCode: 'LOC-09', maximoId: 'MAX-009',
    soilTest: { soilTest: { soilTestActualStart: '2026-05-10', soilTestActualFinish: '2026-05-14', actualSbc: 19.9 } },
    excavation: { excavation: { excavationActualStart: '2026-05-16', excavationActualFinish: '2026-05-22' } },
    pcc: { pcc: { pccActual: '2026-05-24' } },
    flange: { flange: { bottomFlangeActual: '2026-05-26', topFlangeActual: '2026-05-27' } },
    reinforcement: { reinforcement: { reinforcementActualStart: '2026-05-28', reinforcementActualFinish: '2026-06-02' } },
    earthing: { earthing: { earthingStripActual: '2026-06-03' } },
    shuttering: { shuttering: { shutteringActual: '2026-06-05' } },
    raftCasting: { raftCasting: { raftCastingPlan: '2026-06-07', raftCastingActual: '2026-06-08', raftCastingForecast: '2026-06-07', raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: '2026-06-10', pedestalCastingActual: '2026-06-11', pedestalCastingForecast: '2026-06-10', pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: '2026-06-18', foundationCubeTest21Days: '2026-07-02', foundationCubeTest28Days: '2026-07-09' } },
    grouting: { grouting: { groutingActual: null } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: null, groutingCubeTest28Days: null } },
    backfilling: { backfilling: { backfillingActual: null } },
    approachRoad: { approachRoad: { approachRoadActual: null } },
    cranePlatform: { cranePlatform: { cranePlatformActual: null } },
    locationClearance: { locationClearance: { locationClearanceActual: null } } },
  { wtgCode: 'WTG-10', locationCode: 'LOC-10', maximoId: 'MAX-010',
    soilTest: { soilTest: { soilTestActualStart: null, soilTestActualFinish: null, actualSbc: null } },
    excavation: { excavation: { excavationActualStart: null, excavationActualFinish: null } },
    pcc: { pcc: { pccActual: null } },
    flange: { flange: { bottomFlangeActual: null, topFlangeActual: null } },
    reinforcement: { reinforcement: { reinforcementActualStart: null, reinforcementActualFinish: null } },
    earthing: { earthing: { earthingStripActual: null } },
    shuttering: { shuttering: { shutteringActual: null } },
    raftCasting: { raftCasting: { raftCastingPlan: null, raftCastingActual: null, raftCastingForecast: null, raftCastingDelayReason: '' } },
    pedestalCasting: { pedestalCasting: { pedestalCastingPlan: null, pedestalCastingActual: null, pedestalCastingForecast: null, pedestalCastingDelayReason: '' } },
    foundationCubeTest: { foundationCubeTest: { foundationCubeTest7Days: null, foundationCubeTest21Days: null, foundationCubeTest28Days: null } },
    grouting: { grouting: { groutingActual: null } },
    groutingCubeTest: { groutingCubeTest: { groutingCubeTest7Days: null, groutingCubeTest28Days: null } },
    backfilling: { backfilling: { backfillingActual: null } },
    approachRoad: { approachRoad: { approachRoadActual: null } },
    cranePlatform: { cranePlatform: { cranePlatformActual: null } },
    locationClearance: { locationClearance: { locationClearanceActual: null } } },
];


const MOCK_FOUNDATION_VIEWALL: any[] = [
  { wtgCode: 'WTG-01', locationNo: 'LOC-01', maximoId: 'MAX-001' },
  { wtgCode: 'WTG-02', locationNo: 'LOC-02', maximoId: 'MAX-002' },
  { wtgCode: 'WTG-03', locationNo: 'LOC-03', maximoId: 'MAX-003' },
  { wtgCode: 'WTG-04', locationNo: 'LOC-04', maximoId: 'MAX-004' },
  { wtgCode: 'WTG-05', locationNo: 'LOC-05', maximoId: 'MAX-005' },
  { wtgCode: 'WTG-06', locationNo: 'LOC-06', maximoId: 'MAX-006' },
  { wtgCode: 'WTG-07', locationNo: 'LOC-07', maximoId: 'MAX-007' },
  { wtgCode: 'WTG-08', locationNo: 'LOC-08', maximoId: 'MAX-008' },
  { wtgCode: 'WTG-09', locationNo: 'LOC-09', maximoId: 'MAX-009' },
  { wtgCode: 'WTG-10', locationNo: 'LOC-10', maximoId: 'MAX-010' },
];

@Component({
  selector: 'app-foundation1',
    imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, DatePickerModule,
    TableModule, ToastModule, CardModule,
    AccordionModule, TagModule, TextareaModule,
    TooltipModule, StepperModule, InputNumberModule,
    DialogModule, Shared
  ],
  providers: [MessageService],
  templateUrl: './foundation.html',
  styleUrl: './foundation.css',
})
export class Foundation {
  pCode = 'P-8001';
  wtgQty = 2;

  stepCompleted: boolean[] = new Array(17).fill(false);
  activeStep = 0;

  locationOptions: any[] = [];

  stepForms: FormGroup[][] = [];
  wtgRows: WtgRow[] = [];

  // View Popup
  viewVisible = false;

  // Open WTG Popup
  wtgPopupVisible = false;
  wtgPopupActiveStep = 0;
  selectedSummaryRow: SummaryRow | null = null;

  items: MenuItem[] = [];
  displayImportDialog: boolean = false;

  selectedRow: any;

  selectedFile: any;

  selectedProject: any;

  prjWTGDetails: any[] = [];
  foundationActivitiesDetails: any[] = [];
  projectList: any[] = [];

  maxDate: Date | undefined;

  // Summary Table rows
  summaryRows: SummaryRow[] = [
    /* { projectCode: 'P-8001', projectName: 'India_TataPower_Chennai_TamilNadu_Phase1_250MW', totalWtgs: 2 },
    { projectCode: 'P-8002', projectName: 'India_AdaniEnergy_Belagavi_Karnataka_Phase2_180MW', totalWtgs: 5 },
    { projectCode: 'P-8003', projectName: 'India_ReNewPower_Jaisalmer_Rajasthan_Phase1_320MW', totalWtgs: 3 }, */
  ];

  touchedFields: { [key: string]: boolean } = {};

  steps = [
    { id: 1, label: 'Soil Test', fields: ['soilTestStartDate', 'soilTestStartActual', 'soilTestStartDelayReason', 'soilTestEndDate', 'soilTestEndActual', 'soilTestEndDelayReason', 'designSBC', 'actualSBC'] },
    // { id: 2, label: 'Numbers (Design SBC / Actual SBC)', fields: ['designSBC', 'actualSBC'] },
    { id: 2, label: 'Excavation', fields: ['excavationStartDate', 'excavationEndDate', 'excavationStartActual', 'excavationFinishActual', 'excavationDelayReason'] },
    { id: 3, label: 'PCC', fields: ['pccDate', 'pccActual', 'pccDelayReason'] },
    { id: 4, label: 'Anchor Cage', fields: ['bottomFlangeDate', 'bottomFlangeActual'] },
    // { id: 5, label: 'Top Flange', fields: ['topFlangeDate', 'topFlangeActual', 'topBottomFlangeDelayReason'] },
    { id: 5, label: 'Reinforcement', fields: ['reinforcementStartDate', 'reinforcementStartActual', 'reinforcementFinishDate', 'reinforcementFinishActual', 'reinforcementDelayReason'] },
    { id: 6, label: 'Earthing Strip', fields: ['earthingStripDate', 'earthingStripActual', 'earthingStripDelayReason'] },
    { id: 7, label: 'Shuttering', fields: ['shutteringDate', 'shutteringActual', 'shutteringDelayReason'] },
    { id: 8, label: 'Foundation Casting Raft', fields: ['foundationCastingRaftDate', 'raftCastingActual', 'raftCastingDelayReason'] },
    { id: 9, label: 'Foundation Casting Pedestal', fields: ['foundationCastingPedestalDate', 'pedestalCastingActual', 'pedestalCastingDelayReason'] },
    { id: 10, label: 'Foundation Cube Test', fields: ['foundation7DayCubeTestDate', 'foundation21DayCubeTestDate', 'foundation28DayCubeTestDate', 'foundationCubeTestDelayReason'] },
    { id: 11, label: 'Grouting', fields: ['groutingDate', 'groutingActual', 'groutingDelayReason'] },
    { id: 12, label: 'Grouting Cube Test', fields: ['groutingCubeTest7Days', 'groutingCubeTest28Days', 'groutingCubeTestDelayReason'] },
    { id: 13, label: 'Backfilling', fields: ['backfillingDate', 'backfillingActual', 'backfillingDelayReason'] },
    { id: 14, label: 'Approach Road', fields: ['approachRoadDate', 'approachRoadActual', 'approachRoadDelayReason'] },
    { id: 15, label: 'Crane Platform', fields: ['cranePlatformDate', 'cranePlatformActual', 'cranePlatformDelayReason', 'locClearForErectionDate', 'locationClearanceActual', 'locClearForErectionDelayReason'] },
    { id: 16, label: 'Location Clearance', fields: ['locClearForErectionDate', 'locationClearanceActual', 'locClearForErectionDelayReason'] },
  ];

  stepColumnDefs: { [stepIdx: number]: { field: string; header: string; type: 'date' | 'text' | 'number' }[] } = {
    0: [
      // { field: 'soilTestStartDate', header: 'Soil Test Plan Start', type: 'date' },
      { field: 'soilTestActualStart', header: 'Soil Test Actual Start', type: 'date' },
      // { field: 'soilTestForecastStart', header: 'Soil Test Forecast Start', type: 'date' },
      // { field: 'soilTestStartDelayReason', header: 'Soil Test Start Delay Reason', type: 'text' },
      // { field: 'soilTestPlanFinish', header: 'Soil Test Plan Finish', type: 'date' },
      { field: 'soilTestActualFinish', header: 'Soil Test Actual Finish', type: 'date' },
      // { field: 'soilTestForecastFinish', header: 'Soil Test Forecast Finish', type: 'date' },
      // { field: 'soilTestFinishDelayReason', header: 'Soil Test Finish Delay Reason', type: 'text' },
      // { field: 'designSBC', header: 'Design SBC', type: 'number' },
      { field: 'actualSbc', header: 'Actual SBC (t/m²)', type: 'number' }
    ],
    // 1: [
    //   { field: 'designSBC', header: 'Design SBC', type: 'number' },
    //   { field: 'actualSBC', header: 'Actual SBC (t/m²)', type: 'number' },
    // ],
    1: [
      // { field: 'excavationPlanStart', header: 'Excavation Plan Start', type: 'date' },
      { field: 'excavationActualStart', header: 'Excavation Actual Start', type: 'date' },
      // { field: 'excavationForecastStart', header: 'Excavation Forecast Start', type: 'date' },
      // { field: 'excavationStartDelayReason', header: 'Excavation Start Delay Reason', type: 'text' },
      // { field: 'excavationPlanFinish', header: 'Excavation Plan Finish', type: 'date' },
      { field: 'excavationActualFinish', header: 'Excavation Actual Finish', type: 'date' },
      // { field: 'excavationForecastFinish', header: 'Excavation Forecast Finish', type: 'date' },
      // { field: 'excavationFinishDelayReason', header: 'Excavation Finish Delay Reason', type: 'text' },
    ],
    2: [
      // { field: 'pccPlan', header: 'PCC Plan', type: 'date' },
      { field: 'pccActual', header: 'PCC Actual', type: 'date' },
      // { field: 'pccForecast', header: 'PCC Forecast', type: 'date' },
      // { field: 'pccDelayReason', header: 'PCC Delay Reason', type: 'text' },
    ],
    3: [
      // { field: 'bottomFlangePlan', header: 'Bottom Flange Plan', type: 'date' },
      { field: 'bottomFlangeActual', header: 'Bottom Flange Actual', type: 'date' },
      // { field: 'bottomFlangeForecast', header: 'Bottom Flange Forecast', type: 'date' },
      // { field: 'bottomFlangeDelayReason', header: 'Bottom Flange Delay Reason', type: 'text' },
      // { field: 'topFlangePlan', header: 'Top Flange Plan', type: 'date' },
      { field: 'topFlangeActual', header: 'Top Flange Actual', type: 'date' },
      // { field: 'topFlangeForecast', header: 'Top Flange Forecast', type: 'date' },
      // { field: 'topFlangeDelayReason', header: 'Top Flange Delay Reason', type: 'text' },
    ],
    // 4: [
    //   { field: 'topFlangeDate', header: 'Top Flange Date', type: 'date' },
    //   { field: 'topFlangeActual', header: 'Top Flange Actual', type: 'date' },
    //   { field: 'topBottomFlangeDelayReason', header: 'Top/Bottom Flange Delay Reason', type: 'text' },
    // ],
    4: [
      // { field: 'reinforcementPlanStart', header: 'Reinforcement Plan Start', type: 'date' },
      { field: 'reinforcementActualStart', header: 'Reinforcement Actual Start', type: 'date' },
      // { field: 'reinforcementForecastStart', header: 'Reinforcement Forecast Start', type: 'date' },
      // { field: 'reinforcementStartDelayReason', header: 'Reinforcement Start Delay Reason', type: 'text' },
      // { field: 'reinforcementPlanFinish', header: 'Reinforcement Plan Finish', type: 'date' },
      { field: 'reinforcementActualFinish', header: 'Reinforcement Actual Finish', type: 'date' },
      // { field: 'reinforcementForecastFinish', header: 'Reinforcement Forecast Finish', type: 'date' },
      // { field: 'reinforcementFinishDelayReason', header: 'Reinforcement Finish Delay Reason', type: 'text' },
    ],
    5: [
      // { field: 'earthingStripPlan', header: 'Earthing Strip Plan', type: 'date' },
      { field: 'earthingStripActual', header: 'Earthing Strip Actual', type: 'date' },
      // { field: 'earthingStripForecast', header: 'Earthing Strip Forecast', type: 'date' },
      // { field: 'earthingStripDelayReason', header: 'Earthing Strip Delay Reason', type: 'text' },
    ],
    6: [
      // { field: 'shutteringPlan', header: 'Shuttering Plan', type: 'date' },
      { field: 'shutteringActual', header: 'Shuttering Actual', type: 'date' },
      // { field: 'shutteringForecast', header: 'Shuttering Forecast', type: 'date' },
      // { field: 'shutteringDelayReason', header: 'Shuttering Delay Reason', type: 'text' },
    ],
    7: [
      { field: 'raftCastingPlan', header: 'Foundation Casting Raft Plan', type: 'date' },
      { field: 'raftCastingActual', header: 'Foundation Casting Raft Actual', type: 'date' },
      { field: 'raftCastingForecast', header: 'Foundation Casting Raft Forecast', type: 'date' },
      { field: 'raftCastingDelayReason', header: 'Foundation Casting Raft Delay Reason', type: 'text' },
    ],
    8: [
      { field: 'pedestalCastingPlan', header: 'Foundation Casting Pedestal Plan', type: 'date' },
      { field: 'pedestalCastingActual', header: 'Foundation Casting Pedestal Actual', type: 'date' },
      { field: 'pedestalCastingForecast', header: 'Foundation Casting Pedestal Forecast', type: 'date' },
      { field: 'pedestalCastingDelayReason', header: 'Foundation Casting Pedestal Delay Reason', type: 'text' },
    ],
    9: [
      { field: 'foundationCubeTest7Days', header: 'Foundation 7 Days Cube Test Date', type: 'date' },
      { field: 'foundationCubeTest21Days', header: 'Foundation 21 Days Cube Test Date', type: 'date' },
      { field: 'foundationCubeTest28Days', header: 'Foundation 28 Days Cube Test Date', type: 'date' },
      // { field: 'foundationCubeTestDelayReason', header: 'Foundation Cube Test Delay Reason', type: 'text' },
    ],
    10: [
      // { field: 'groutingPlan', header: 'Grouting Plan', type: 'date' },
      { field: 'groutingActual', header: 'Grouting Actual', type: 'date' },
      // { field: 'groutingForecast', header: 'Grouting Forecast', type: 'date' },
      // { field: 'groutingDelayReason', header: 'Grouting Delay Reason', type: 'text' },
    ],
    11: [
      { field: 'groutingCubeTest7Days', header: 'Grouting 7 Days Cube Test Date', type: 'date' },
      { field: 'groutingCubeTest28Days', header: 'Grouting 28 Days Cube Test Date', type: 'date' },
      // { field: 'groutingCubeTestDelayReason', header: 'Grouting Cube Test Delay Reason', type: 'text' },
    ],
    12: [
      // { field: 'backfillingPlan', header: 'Backfilling Plan', type: 'date' },
      { field: 'backfillingActual', header: 'Backfilling Actual', type: 'date' },
      // { field: 'backfillingForecast', header: 'Backfilling Forecast', type: 'date' },
      // { field: 'backfillingDelayReason', header: 'Backfilling Delay Reason', type: 'text' },
    ],
    13: [
      // { field: 'approachRoadPlan', header: 'Approach Road Plan', type: 'date' },
      { field: 'approachRoadActual', header: 'Approach Road Actual', type: 'date' },
      // { field: 'approachRoadForecast', header: 'Approach Road Forecast', type: 'date' },
      // { field: 'approachRoadDelayReason', header: 'Approach Road Delay Reason', type: 'text' },
    ],
    14: [
      // { field: 'cranePlatformPlan', header: 'Crane Platform Plan', type: 'date' },
      { field: 'cranePlatformActual', header: 'Crane Platform Actual', type: 'date' },
      // { field: 'cranePlatformForecast', header: 'Crane Platform Forecast', type: 'date' },
      // { field: 'cranePlatformDelayReason', header: 'Crane Platform Delay Reason', type: 'text' }
    ],
    15: [
      // { field: 'locClearForErectionPlan', header: 'Loc Clear for Erection Plan', type: 'date' },
      { field: 'locationClearanceActual', header: 'Loc Clear for Erection Actual', type: 'date' },
      // { field: 'locClearForErectionForecast', header: 'Loc Clear for Erection Forecast', type: 'date' },
      // { field: 'locClearForErectionDelayReason', header: 'Loc Clear for Erection Delay Reason', type: 'text' },
    ]
  };

  chooseDownloadTemplate:boolean = false;
  chooseUploadTemplate:boolean = false;
  downloadLineItem:any;
  DocName:any = "";
  uploadLocationTemplate:boolean = false;

    private requiredFields: { [key: number]: string[] } = {
    0: [
      'soilTestActualStart',
      'soilTestActualFinish',
      'actualSbc'
    ],

    1: [
      'excavationActualStart',
      'excavationActualFinish'
    ],

    2: [
      'pccActual'
    ],

    3: [
      'bottomFlangeActual',
      'topFlangeActual'
    ],

    4: [
      'reinforcementActualStart',
      'reinforcementActualFinish'
    ],

    5: [
      'earthingStripActual'
    ],

    6: [
      'shutteringActual'
    ],

    7: [
      'raftCastingPlan',
      'raftCastingActual',
      'raftCastingForecast',
      'raftCastingDelayReason'
    ],

    8: [
      'pedestalCastingPlan',
      'pedestalCastingActual',
      'pedestalCastingForecast',
      'pedestalCastingDelayReason'
    ],

    9: [
      'foundationCubeTest7Days',
      'foundationCubeTest21Days',
      'foundationCubeTest28Days'
    ],

    10: [
      'groutingActual'
    ],

    11: [
      'groutingCubeTest7Days',
      'groutingCubeTest28Days'
    ],

    12: [
      'backfillingActual'
    ],

    13: [
      'approachRoadActual'
    ],

    14: [
      'cranePlatformActual'
    ],

    15: [
      'locationClearanceActual'
    ]
  };

  validationAttempted: {
    [stepIdx: number]: {
      [rowIdx: number]: {
        [field: string]: boolean
      }
    }
  } = {};

  stepConfig: {
    [key: number]: {
      key: string;
      api: (payload: any) => any;
    };
  } = {
    0: {
      key: 'soilTest',
      api: (payload: any) => this.apiService.createFoundationSoilTest(payload)
    },
    1: {
      key: 'excavation',
      api: (payload: any) => this.apiService.createFoundationExcavation(payload)
    },
    2: {
      key: 'pcc',
      api: (payload: any) => this.apiService.createFoundationPCC(payload)
    },
    3: {
      key: 'flange',
      api: (payload: any) => this.apiService.createFoundationFlange(payload)
    },
    4: {
      key: 'reinforcement',
      api: (payload: any) => this.apiService.createFoundationReinforcement(payload)
    },
    5: {
      key: 'earthing',
      api: (payload: any) => this.apiService.createFoundationEarthing(payload)
    }, 
    6: {
      key: 'shuttering',
      api: (payload: any) => this.apiService.createFoundationShuttering(payload)
    },
    7: {
      key: 'raftCasting',
      api: (payload: any) => this.apiService.createFoundationRaftCasting(payload)
    },
    8: {
      key: 'pedestalCasting',
      api: (payload: any) => this.apiService.createFoundationPedestalCasting(payload)
    },
    9: {
      key: 'foundationCubeTest',
      api: (payload: any) => this.apiService.createFoundationCubeTest(payload)
    },
    10: {
      key: 'grouting',
      api: (payload: any) => this.apiService.createFoundationGrouting(payload)
    },
    11: {
      key: 'groutingCubeTest',
      api: (payload: any) => this.apiService.createFoundationGroutingCubeTest(payload)
    },
    12: {
      key: 'backfilling',
      api: (payload: any) => this.apiService.createFoundationBackfilling(payload)
    },
    13: {
      key: 'approachRoad',
      api: (payload: any) => this.apiService.createFoundationApproachRoad(payload)
    },
    14: {
      key: 'cranePlatform',
      api: (payload: any) => this.apiService.createFoundationCranePlatform(payload)
    },
    15: {
      key: 'locationClearance',
      api: (payload: any) => this.apiService.createFoundationLocationClearance(payload)
    }
  };

  constructor(private fb: FormBuilder, private messageService: MessageService,
    private apiService:Apiservice, private router: Router) {}

  ngOnInit() {
    // Build enough WTG rows to cover the maximum totalWtgs across all summary rows
   /*  const maxWtg = Math.max(this.wtgQty, ...this.summaryRows.map(r => r.totalWtgs));
    for (let i = 1; i <= maxWtg; i++) {
      this.wtgRows.push({
        wtgId: `WTG-${String(i).padStart(2, '0')}`,
        locationNo: `LOC-${String(i).padStart(2, '0')}`,
        maximoId: `MAX-${String(i).padStart(3, '0')}`
      });
    }

    // Build step forms for ALL rows (maxWtg) so every summary row's WTGs have forms
    for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
      const cols = this.stepColumnDefs[stepIdx];
      const rowForms: FormGroup[] = this.wtgRows.map(() => {
        const group: any = {};
        cols.forEach(col => { group[col.field] = [null]; });
        return this.fb.group(group);
      });
      this.stepForms.push(rowForms);
    }

    this.items = this.getMenuItems("");
    this.getProjectList(); */
    // Don't build wtgRows/stepForms here anymore — wait for API
  this.items = this.getMenuItems("");
  this.getProjectList();

  const today = new Date();
  this.maxDate = new Date(today);
}

  private getFieldKey(stepIdx: number, rowIdx: number, field: string): string {
    return `${stepIdx}_${rowIdx}_${field}`;
  }

  markFieldTouched(stepIdx: number, rowIdx: number, field: string): void {
    const key = this.getFieldKey(stepIdx, rowIdx, field);
    this.touchedFields[key] = true;
  }

  isFieldInvalid(stepIdx: number, rowIdx: number, field: string): boolean {
    const key = this.getFieldKey(stepIdx, rowIdx, field);

    if (!this.touchedFields[key]) {
      return false;
    }

    const value = this.getStepFormValue(stepIdx, rowIdx, field);

    return value === null ||
          value === undefined ||
          value === '';
  }

  isStepValid(stepIdx: number, rowIdx: number): boolean {
    const form = this.stepForms[stepIdx]?.[rowIdx];

    if (!form) {
      return false;
    }

    const requiredFields = this.requiredFields[stepIdx] || [];

    return requiredFields.every(field => {
      const control = form.get(field);

      return control && control.valid;
    });
  }

// Call this after you know the WTG count from the selected row
rebuildWtgRowsAndForms(totalWtgs: number) {
  this.wtgRows = [];
  this.stepForms = [];

  for (let i = 1; i <= totalWtgs; i++) {
    this.wtgRows.push({
      wtgId: `WTG-${String(i).padStart(2, '0')}`,
      locationNo: `LOC-${String(i).padStart(2, '0')}`,
      maximoId: `MAX-${String(i).padStart(3, '0')}`
    });
  }

  for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
    const cols = this.stepColumnDefs[stepIdx];
    const rowForms: FormGroup[] = this.wtgRows.map(() => {
      const group: any = {};
      cols.forEach(col => { group[col.field] = [null]; });
      return this.fb.group(group);
    });
    this.stepForms.push(rowForms);
  }
  }

  getProjectList(){
    try{
      let data = {
        "search": null,
        "customerId": null,
        "clusterId": null,
        "zoneId": null,
        "projectManagerId": null,
        "projectTerm": null,
        "probability": null,
        "page": 0,
        "size": 10,
        "sortBy": "createdOn",
        "sortDirection": "asc"
      }
      this.apiService.projectSearch(data)
      .subscribe({
        next:(res)=>{
          // this.summaryRows = res.data.content
          this.projectList = res.data.content;
        },error:(err)=>{
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.projectList = MOCK_FOUNDATION_PROJECTS;
          }
        }
      })
    }catch(e){
      this.projectList = MOCK_FOUNDATION_PROJECTS;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });
    }
  }
  // ─── ROW-LEVEL UNLOCK LOGIC ───────────────────────────────────────────────
  /**
   * A specific row in stepIdx is enabled only if the SAME rowIdx
   * in the previous step has ALL fields fully filled.
   * Step 0 rows are always enabled.
   */
  isRowEnabled(stepIdx: number, rowIdx: number): boolean {
    /* if (stepIdx === 0) return true;
    return this.isPreviousStepRowFullyFilled(stepIdx - 1, rowIdx); */
    return true;
  }

  isPreviousStepRowFullyFilled(stepIdx: number, rowIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    if (!this.stepForms[stepIdx]?.[rowIdx]) return false;
    return cols.every(col => {
      const val = this.stepForms[stepIdx][rowIdx].get(col.field)?.value;
      return val !== null && val !== undefined && val !== '';
    });
  }

  isStepEnabled(stepIdx: number): boolean {
    /* if (stepIdx === 0) return true;
    return this.stepCompleted[stepIdx - 1] || this.isAnyRowFullyFilledInStep(stepIdx - 1); */
    return true;
  }

  isAnyRowFullyFilledInStep(stepIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    return this.stepForms[stepIdx]?.some(rowForm =>
      cols.every(col => {
        const val = rowForm.get(col.field)?.value;
        return val !== null && val !== undefined && val !== '';
      })
    ) ?? false;
  }

  isAnyRowFilledInStep(stepIdx: number): boolean {

    const cols = this.stepColumnDefs[stepIdx];

    return this.stepForms[stepIdx]?.some((rowForm, rowIndex) => {

      return cols.some(col => {

        const val = rowForm.get(col.field)?.value;

        return val != null && val !== '';
      });

    }) ?? false;
  }

  getStepFormValue(stepIdx: number, rowIdx: number, field: string): any {
    return this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
  }

  setStepFormValue(stepIdx: number, rowIdx: number, field: string, value: any) {

    this.stepForms?.[stepIdx]?.[rowIdx]?.get(field)?.setValue(value);
  }

  isStepRowsFilled(stepIdx: number): boolean {
    return this.isAnyRowFilledInStep(stepIdx);
  }

  formatDate(date: any): string | null {
    if(!date) return null;

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getStepPayload(stepIdx: number) {
  const key = this.stepConfig[stepIdx].key;

  return this.prjWTGDetails
    .map((wtg: any, rowIdx: number) => ({
      wtg,
      rowIdx
    }))
    .filter(({ rowIdx }) => {
      const form = this.stepForms[stepIdx]?.[rowIdx];

      if (!form) return false;

      return Object.values(form.value).some(v =>
        v !== null &&
        v !== '' &&
        v !== undefined
      );
    })
    .map(({ wtg, rowIdx }) => {

      const form = this.stepForms[stepIdx][rowIdx];

      const formValue = { ...form.value };

      Object.keys(formValue).forEach(field => {
        if (formValue[field] instanceof Date) {
          formValue[field] = this.formatDate(formValue[field]);
        }
      });

      return {
        locationId: wtg.location?.locationId ?? 0,
        [key]: formValue
      };
    });
}

  markStepComplete(stepIdx: number) {
    try {
      const payload = this.getStepPayload(stepIdx);

      this.stepConfig[stepIdx].api(payload).subscribe({
        next: (val: any) => {
          this.stepCompleted[stepIdx] = true;

          if (stepIdx + 1 < this.steps.length) {
            this.wtgPopupActiveStep = stepIdx + 1;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Step Saved',
            detail: `${this.steps[stepIdx].label} data saved successfully.`
          });
        },
        error: (err: any) => {

          this.messageService.add({
            severity: 'error',
            summary: 'Save Failed',
            detail: err?.error?.detail || 'Unable to save data.'
          });
        }
      })
      
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // onSubmit() {
  //   const allData: any = { pCode: this.pCode, wtgQty: this.wtgQty, steps: [] };
  //   this.steps.forEach((step, stepIdx) => {
  //     allData.steps.push({
  //       stepLabel: step.label,
  //       rows: this.wtgRows.map((wtg, rowIdx) => ({
  //         wtgId: wtg.wtgId,
  //         locationNo: wtg.locationNo,
  //         maximoId: wtg.maximoId,
  //         ...this.stepForms[stepIdx][rowIdx].value
  //       }))
  //     });
  //   });
  //   console.log('Foundation Submit:', allData);
  //   this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Foundation data submitted successfully!' });
  // }

  getCompletedCount(): number {
    return this.stepCompleted.filter(Boolean).length;
  }

  getStepStatus(stepIdx: number): 'completed' | 'active' | 'disabled' {
    if (this.stepCompleted[stepIdx]) return 'completed';
    if (this.isStepEnabled(stepIdx)) return 'active';
    return 'disabled';
  }

  trackByIndex(index: number): number {
    return index;
  }

  // ─── VIEW POPUP ───────────────────────────────────────────────────────────

  openViewPopup() {
    this.viewVisible = true;
  }

  closeViewPopup() {
    this.viewVisible = false;
  }

  /** Opens View All Data from inside the Open WTG popup — keeps selectedSummaryRow set */
  openViewAllDataFromWtg() {
    this.viewVisible = true;
    this.viewAllData();
  }

  patchFoundationData(data: any[]) {

    if (!this.stepForms.length) {
      console.warn('stepForms are not created yet');
      return;
    }

    data.forEach((wtg: any, rowIdx: number) => {

      const stepDataMap: any = {
        0: wtg.soilTest?.soilTest,
        1: wtg.excavation?.excavation,
        2: wtg.pcc?.pcc,
        3: wtg.flange?.flange,
        4: wtg.reinforcement?.reinforcement,
        5: wtg.earthing?.earthing,
        6: wtg.shuttering?.shuttering,
        7: wtg.raftCasting?.raftCasting,
        8: wtg.pedestalCasting?.pedestalCasting,
        9: wtg.foundationCubeTest?.foundationCubeTest,
        10: wtg.grouting?.grouting,
        11: wtg.groutingCubeTest?.groutingCubeTest,
        12: wtg.backfilling?.backfilling,
        13: wtg.approachRoad?.approachRoad,
        14: wtg.cranePlatform?.cranePlatform,
        15: wtg.locationClearance?.locationClearance
      };

      this.steps.forEach((step, stepIdx) => {

        const apiData = stepDataMap[stepIdx];

        if (!apiData) {
          return;
        }

        const form = this.stepForms[stepIdx]?.[rowIdx];

        if (!form) {
          // console.warn(
          //   `Form missing: step ${stepIdx}, row ${rowIdx}`
          // );
          return;
        }

        const patchObj: any = {};

        this.stepColumnDefs[stepIdx].forEach(col => {

          const value = apiData[col.field];

          if (value !== undefined && value !== null) {

            patchObj[col.field] =
              col.type === 'date'
                ? new Date(value)
                : value;
          }
        });

        form.patchValue(patchObj);
      });
    });
  }

  viewAllData(){
    try{
      let data = {
        projectId: this.selectedProject.projectId
      }
      this.apiService.foundationActivities(data)
      .subscribe({
        next:(res)=>{
          // If res.data is empty or null, skip binding
          if (!res.data || res.data.length === 0) return;

          this.foundationActivitiesDetails = res.data;

          this.patchFoundationData(res.data);

          if (this.stepForms.length) {
            this.patchFoundationData(res.data);
          }

          // this.rebuildWtgRowsAndForms(res.data.length);

          // this.bindApiDataToStepForms(res.data);
        },error:(err)=>{
           if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.foundationActivitiesDetails = MOCK_FOUNDATION_ACTIVITIES;
          }
        }
      })
    }catch(e){
      this.foundationActivitiesDetails = MOCK_FOUNDATION_ACTIVITIES;
      this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please Try Again'
        });
    }
  }

  getTotalViewColumns(): number {
    return this.getViewStepGroups()
      .reduce((sum, grp) => sum + grp.colCount, 0);
  }

bindApiDataToStepForms(data: any[]) {

  data.forEach((wtgData: any, rowIdx: number) => {

    if (this.wtgRows[rowIdx]) {
      if (wtgData.wtgCode)      this.wtgRows[rowIdx].wtgId      = wtgData.wtgCode;
      if (wtgData.locationCode) this.wtgRows[rowIdx].locationNo = wtgData.locationCode;
    } else {
      console.warn(`wtgRows[${rowIdx}] does not exist!`);
    }

    const stepDataMap: { [stepIdx: number]: any } = {
      0:  wtgData.soilTest?.soilTest,
      1:  wtgData.excavation?.excavation,
      2:  wtgData.pcc?.pcc,
      3:  wtgData.flange?.flange,
      4:  wtgData.reinforcement?.reinforcement,
      5:  wtgData.earthing?.earthing,
      6:  wtgData.shuttering?.shuttering,
      7:  wtgData.raftCasting?.raftCasting,
      8:  wtgData.pedestalCasting?.pedestalCasting,
      9:  wtgData.foundationCubeTest?.foundationCubeTest,
      10: wtgData.grouting?.grouting,
      11: wtgData.groutingCubeTest?.groutingCubeTest,
      12: wtgData.backfilling?.backfilling,
      13: wtgData.approachRoad?.approachRoad,
      14: wtgData.cranePlatform?.cranePlatform,
      15: wtgData.locationClearance?.locationClearance,
    };

    // Only log step 0 for WTG-006 (rowIdx 5)
    if (rowIdx === 5) {
      // console.log('stepDataMap[0] (soilTest):', stepDataMap[0]);
      // console.log('stepForms[0][5] exists:', !!this.stepForms[0]?.[5]);
    }

    this.steps.forEach((step, stepIdx) => {
      const cols = this.stepColumnDefs[stepIdx];
      if (!this.stepForms[stepIdx]?.[rowIdx]) {
        console.warn(`stepForms[${stepIdx}][${rowIdx}] missing!`);
        return;
      }

      const apiStepData = stepDataMap[stepIdx];
      if (!apiStepData) return;

      const patchObj: any = {};
      cols.forEach(col => {
        const apiKey = Object.keys(apiStepData).find(
          k => k.toLowerCase() === col.field.toLowerCase()
        );
        const val = apiKey ? apiStepData[apiKey] : undefined;

        if (rowIdx === 5 && stepIdx === 0) {
          // console.log(`col.field: ${col.field}, apiKey: ${apiKey}, val: ${val}`);
        }

        if (val !== undefined && val !== null) {
          patchObj[col.field] = (col.type === 'date' && typeof val === 'string')
            ? new Date(val)
            : val;
        }
      });

      if (rowIdx === 5 && stepIdx === 0) {
        // console.log('patchObj for WTG-006 step 0:', patchObj);
        // console.log('form value BEFORE patch:', this.stepForms[0][5].value);
      }

      this.stepForms[stepIdx][rowIdx].patchValue(patchObj);

      if (rowIdx === 5 && stepIdx === 0) {
        // console.log('form value AFTER patch:', this.stepForms[0][5].value);
      }
    });
  });
} 

  createForms(){
    try {
      this.stepForms = [];

      for(let stepIdx = 0; stepIdx < this.steps.length; stepIdx++){
        const cols = this.stepColumnDefs[stepIdx];

        const rowForms = this.prjWTGDetails.map(() => {
          const group: any = {};

          cols.forEach(col => {

            const isRequired =
              this.requiredFields[stepIdx]?.includes(col.field);

            group[col.field] = [
              null,
              isRequired ? Validators.required : []
            ];
          });

          return this.fb.group(group);
        });
        this.stepForms.push(rowForms);
      }
    } catch (error) {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchPrjWTGDetails(){
    try {
      const data = {
        projectId: this.selectedProject.projectId
      }

      this.apiService.fetchPrjWTGDetails(data).subscribe({
        next: val => {
          this.prjWTGDetails = val.data.filter(
            (wtg: any) => wtg.location && wtg.location.locationId
          );

          this.createForms();

          if (this.foundationActivitiesDetails.length) {
            this.patchFoundationData(
              this.foundationActivitiesDetails
            );
          }
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.prjWTGDetails = MOCK_FOUNDATION_WTG_DETAILS;
            this.createForms();

            if (this.foundationActivitiesDetails.length) {
              this.patchFoundationData(
                this.foundationActivitiesDetails
              );
            }
          }
        }
      })
    } catch (error){

      this.prjWTGDetails = MOCK_FOUNDATION_WTG_DETAILS;
      this.createForms();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }


  openWtgPopup(row: any) {
    this.selectedProject = row;
    this.selectedSummaryRow = row;
    this.wtgPopupActiveStep = 0;
    this.wtgPopupVisible = true;
    this.viewAllData();
    this.fetchPrjWTGDetails();
  }

  closeWtgPopup() {
    this.wtgPopupVisible = false;
    this.selectedSummaryRow = null;
  }

  /**
   * Returns plain WtgRow[] for the VIEW ALL DATA popup (read-only).
   * Sliced to only the WTG count of the currently selected summary row.
   */
  getViewWtgRows(): WtgRow[] {
    const count = this.selectedSummaryRow?.totalWtgs ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count);
  }

  /**
   * Returns plain WtgRow[] for the OPEN WTG POPUP (editable steps).
   * Sliced to only the WTG count of the currently selected summary row.
   * rowIndex from p-table is used directly as the form index.
   */
  getWtgPopupRows(): WtgRow[] {
    const count = this.selectedSummaryRow?.totalWtgs ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count);
  }

  getAllViewColumns(): ViewColumn[] {
    const cols: ViewColumn[] = [];
    this.steps.forEach((step, stepIdx) => {
      this.stepColumnDefs[stepIdx].forEach(col => {
        cols.push({ field: col.field, header: col.header, stepLabel: step.label, type: col.type, stepIdx });
      });
    });
    return cols;
  }

  getViewStepGroups(): { stepIdx: number; label: string; colCount: number }[] {
    return this.steps.map((step, stepIdx) => ({
      stepIdx,
      label: `Step ${step.id}: ${step.label}`,
      colCount: this.stepColumnDefs[stepIdx].length
    }));
  }

  getViewValue(stepIdx: number, rowIdx: number, field: string, type: 'date' | 'text' | 'number'): string {
    const val = this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    if (val === null || val === undefined || val === '') return '—';
    if (type === 'date' && val instanceof Date) {
      const d = val as Date;
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}-${mm}-${d.getFullYear()}`;
    }
    return String(val);
  }

  hasViewValue(stepIdx: number, rowIdx: number, field: string): boolean {
    const val = this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    return val !== null && val !== undefined && val !== '';
  }

  getLocationOptions(): any[] {
    const count = this.selectedSummaryRow?.totalWtgs ?? this.wtgRows.length;

    return this.wtgRows.slice(0, count).map(r => ({
      label: r.locationNo,
      value: r.locationNo
    }));
  }

  getMaximoOptions(): any[] {
    const count = this.selectedSummaryRow?.totalWtgs ?? this.wtgRows.length;

    return this.wtgRows.slice(0, count).map(r => ({
      label: r.maximoId,
      value: r.maximoId
    }));
  }

  getMenuItems(row:any){
    return [
      {
        label: 'View Project WTG Details',
        icon: 'pi pi-eye',
        command: () => this.router.navigate(['/project',
          row.projectId,
          'wtg-location'],
          {
            state: {
              project: row
            }
          }
        )
      },
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command:() =>  this.openImportDialog(row,'Import')
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command:() =>  this.exportFoundation(row,'Export')
      }
    ]
  }

  openImportDialog(row: any,chooseTye:any) {
  this.selectedRow = row;
  /* this.displayImportDialog = true; */
  this.chooseUploadTemplate = true;
  
}

onFileSelect(event: any) {
  this.selectedFile = event.target.files[0];
}


  exportFoundation(val:any,chooseTye:any){
    try{
      if(val){
        this.chooseDownloadTemplate = true;
        this.downloadLineItem = val;
      }
     /*  */
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  downloadTemplate(val:any){
    try{
      if(val == 'foundation'){
         let data = {
        "projectId": this.downloadLineItem.projectId
      }
      this.apiService.foundationExport(data)
      .subscribe({
        next: (val: Blob) => {
          const url = window.URL.createObjectURL(val);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Production_Quality_${`FoundationTracker`}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
         // this.selectedDprProject = [];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Production & Quality excel template downloaded successfully.' });
          this.chooseDownloadTemplate = false;
        },
        error: async(err) => {
          if (err.error instanceof Blob) {
            const text = await err.error.text();
            const json = JSON.parse(text);

            this.messageService.add({severity: 'error', summary: 'Error', detail: json.detail || 'Something went wrong' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail || 'Something went wrong' });
          }
        }
      })
      }else if(val == 'location'){
        let data = {
        "projectId": this.downloadLineItem.projectId
      }
      this.apiService.locationExport(data)
      .subscribe({
        next: (val: Blob) => {
          const url = window.URL.createObjectURL(val);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${`Location Template`}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
         // this.selectedDprProject = [];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Location template downloaded successfully.' });
          this.chooseDownloadTemplate = false;
        },
        error: async(err) => {
          if (err.error instanceof Blob) {
            const text = await err.error.text();
            const json = JSON.parse(text);

            this.messageService.add({severity: 'error', summary: 'Error', detail: json.detail || 'Something went wrong' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail || 'Something went wrong' });
          }
        }
      })
      }
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  uploadTemplate(val:any){
    try{
      if(val == 'foundation'){
       
     this.displayImportDialog = true;
      }else if(val == 'location'){
        this.uploadLocationTemplate = true;
        
      } 
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }


  onUpload(event: any) {

    this.selectedFile = event.files[0]

    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select file'
      });
      return;
    }

  const formData = new FormData();

  formData.append('file', this.selectedFile);

  formData.append('projectId', this.selectedRow.projectId);

  this.apiService.foundationImport(formData)
    .subscribe({
      next: (res) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File uploaded successfully'
        });

        this.displayImportDialog = false;

        this.selectedFile = null;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.detail
        });
      }
    });
}

onUploadLocation(event: any) {

    this.selectedFile = event.files[0]

  if (!this.selectedFile) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select file'
    });
    return;
  }

  const formData = new FormData();

  formData.append('file', this.selectedFile);

  formData.append('projectId', this.selectedRow.projectId);

  this.apiService.locationImport(formData)
    .subscribe({
      next: (res) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File uploaded successfully'
        });

        this.uploadLocationTemplate = false;

        this.selectedFile = null;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.detail
        });
      }
    });
}
}
