import { Injectable } from '@angular/core';

export interface WtgDefault {
  wtg: string;
  cap: number;
  tower: string;
  blade: string;
  qty: number;
}

export interface WtgRow {
  wtg: string;
  cap: number;
  tower: string;
  blade: string;
  qty: number;
  mon: number[];
}

export interface ProjectEntry {
  uid: number;
  projectCode: string;
  spv: string;
  rows: WtgRow[];
}

// ── Exact data from HTML demo ──
const DB_CUSTOMERS: Record<string, string[]> = {
  ReNew:   ['P-1719', 'P-1854', 'P-2001'],
  Adani:   ['P-2101', 'P-2202', 'P-2305'],
  Greenko: ['P-3001', 'P-3102'],
  NTPC:    ['P-4001', 'P-4220'],
  JSW:     ['P-5001', 'P-5110', 'P-5230']
};

const DB_SPVS: Record<string, string[]> = {
  'P-1719': ['SPV 1', 'SPV 2', 'SPV 3'],
  'P-1854': ['SPV 10', 'SPV 11'],
  'P-2001': ['SPV 5'],
  'P-2101': ['SPV A', 'SPV B'],
  'P-2202': ['SPV C', 'SPV D', 'SPV E'],
  'P-2305': ['SPV F'],
  'P-3001': ['SPV G', 'SPV H'],
  'P-3102': ['SPV I'],
  'P-4001': ['SPV J', 'SPV K'],
  'P-4220': ['SPV L'],
  'P-5001': ['SPV M', 'SPV N'],
  'P-5110': ['SPV O'],
  'P-5230': ['SPV P', 'SPV Q']
};

const DB_DEFAULTS: Record<string, WtgDefault[]> = {
  'SPV 1':  [
    { wtg: 'EN182', cap: 5,   tower: '140HH-474T', blade: 'Big',   qty: 10 },
    { wtg: 'EN156', cap: 3.3, tower: '120HH-304T', blade: 'Small', qty: 10 }
  ],
  'SPV 2':  [
    { wtg: 'EN182', cap: 5,   tower: '140HH-474T', blade: 'Big',   qty: 8 },
    { wtg: 'EN156', cap: 3.3, tower: '120HH-304T', blade: 'Small', qty: 5 }
  ],
  'SPV 3':  [{ wtg: 'EN132', cap: 2.4, tower: '120HH-304T', blade: 'Small', qty: 12 }],
  'SPV 10': [
    { wtg: 'EN132', cap: 2.4, tower: '120HH-304T', blade: 'Small', qty: 15 },
    { wtg: 'EN182', cap: 5,   tower: '140HH-474T', blade: 'Big',   qty: 9 },
    { wtg: 'EN156', cap: 3.3, tower: '120HH-304T', blade: 'Small', qty: 6 }
  ],
  'SPV 11': [{ wtg: 'EN182', cap: 5, tower: '140HH-474T', blade: 'Big', qty: 7 }]
};

export const CUSTOMERS = Object.keys(DB_CUSTOMERS);
export const YEARS = ['2025', '2026', '2027', '2028'];

@Injectable({ providedIn: 'root' })
export class DataService {

  getProjects(customer: string): string[] {
    return DB_CUSTOMERS[customer] ?? [];
  }

  getSPVs(projectCode: string): string[] {
    return DB_SPVS[projectCode] ?? [];
  }

  getDefaultRows(spv: string): WtgRow[] {
    const defs = DB_DEFAULTS[spv];
    if (defs) {
      return defs.map(d => ({ ...d, mon: Array(12).fill(0) }));
    }
    return [{ wtg: 'EN182', cap: 5, tower: '140HH-474T', blade: 'Big', qty: 0, mon: Array(12).fill(0) }];
  }

  getMonthLabels(year: string): string[] {
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      .map(m => `${m} ${year}`);
  }
}
