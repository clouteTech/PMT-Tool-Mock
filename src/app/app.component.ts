import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarOpen = signal(true);
  showLogoutConfirm = false;
  showMastersMenu = false;
showAllocationMenu = false;
  currentRoute = '';
  activeMenu = 'create';
  private routeSub!: Subscription;

  @ViewChild('sbNav') sbNav?: ElementRef<HTMLDivElement>;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.restore();
    this.currentRoute = this.router.url;
    this.updateActiveMenu(this.router.url);

    this.routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentRoute = e.urlAfterRedirects;
        this.updateActiveMenu(e.urlAfterRedirects);
      });

    if (window.innerWidth <= 768) {
      this.sidebarOpen.set(false);
    }
    if (window.innerWidth <= 768) this.sidebarOpen.set(false);//plant all
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  private updateActiveMenu(url: string) {
    const routeMenuMap: { segment: string; menu: string }[] = [
      { segment: 'create-project',      menu: 'create' },
      { segment: 'yearly-demand-plans', menu: 'yearlyDemandPlans' },
      { segment: 'dashboard',           menu: 'demand' },
      { segment: 'saleDemand',          menu: 'saleDemand' },
      { segment: 'monthlyDemandPlan',   menu: 'monthlyDemandPlan' },
      { segment: 'allocationApproval',  menu: 'allocationApproval' },
      { segment: 'WTGProduction',       menu: 'WTGProduction' },
      { segment: 'wtg-quality',         menu: 'WTGQuality' },
      { segment: 'wtg-dispatch',        menu: 'WTGDispatch' },
      { segment: 'wtg-receiving',       menu: 'WTGReceiving' },
      { segment: 'foundation1',         menu: 'Foundation1' },
      { segment: 'foundation',          menu: 'Foundation' },
      { segment: 'commisioning1',       menu: 'Commisioning1' },
      { segment: 'commisioning',        menu: 'Commisioning' },
      { segment: 'installation',        menu: 'installation' },
      { segment: 'components',          menu: 'components' },
      { segment: 'tower-types',         menu: 'towerType' },
      { segment: 'blade-types',         menu: 'bladeType' },
      { segment: 'wtg-types',           menu: 'wtgType' },
      { segment: 'grid-connectivities', menu: 'gridConnectivities' },
      { segment: 'wtg-capacities',      menu: 'wtgCapacities' },
      { segment: 'ppa-types',           menu: 'ppaTypes' },
      { segment: 'plants',              menu: 'plants' },
      { segment: 'customers',           menu: 'customers' },
      { segment: 'zones',               menu: 'zone' },
      { segment: 'departments',         menu: 'department' },
      { segment: 'clusters',            menu: 'clusters' },
      { segment: 'company-users',       menu: 'companyUsers' },
      { segment: 'user-groups',         menu: 'userGroups' },
      { segment: 'roles',               menu: 'roles' },
{ segment: 'plant-allocation', menu: 'plant-allocation' },
{ segment: 'view-allocation', menu: 'view-allocation' },
    ];

    const match = routeMenuMap.find(r => url.includes(r.segment));
    if (match) {
      this.activeMenu = match.menu;
      // Auto-open Masters submenu when a master route is active
      const masterMenus = ['components','towerType','bladeType','wtgType','gridConnectivities',
        'wtgCapacities','ppaTypes','plants','customers','zone','department',
        'clusters','companyUsers','userGroups','roles'];
      if (masterMenus.includes(match.menu)) {
        if (!this.showMastersMenu) {
          this.showMastersMenu = true;
          setTimeout(() => {
            const el = this.sbNav?.nativeElement;
            if (el) el.scrollTop = el.scrollHeight;
          });
        }
      }
    }
  }

  get isLoginRoute(): boolean {
    return this.currentRoute.startsWith('/login') || this.currentRoute === '/';
  }

  navigate(menu: string) {
    this.activeMenu = menu;
    if (menu === 'demand') this.router.navigate(['/dashboard']);
    if (menu === 'yearlyDemandPlans') this.router.navigate(['/yearly-demand-plans']);
    else if (menu === 'saleDemand') this.router.navigate(['/saleDemand']);
    else if (menu === 'create') this.router.navigate(['/create-project']);
    else if (menu === 'monthlyDemandPlan') this.router.navigate(['/monthlyDemandPlan']);
    else if (menu === 'allocationApproval') this.router.navigate(['/allocationApproval']);
    else if (menu === 'WTGProduction') this.router.navigate(['/WTGProduction']);
    else if(menu === 'WTGQuality') this.router.navigate(['/wtg-quality']);
    else if(menu === 'WTGDispatch') this.router.navigate(['/wtg-dispatch']);
    else if(menu === 'WTGReceiving') this.router.navigate(['/wtg-receiving']);
    else if(menu === 'Foundation') this.router.navigate(['/foundation']);
    else if(menu === 'Commisioning') this.router.navigate(['/commissioning']);
    else if(menu === 'components') this.router.navigate(['/components']);
    else if(menu === 'towerType') this.router.navigate(['/tower-types']);
    else if(menu === 'bladeType') this.router.navigate(['/blade-types']);
    else if(menu === 'wtgType') this.router.navigate(['/wtg-types']);
    else if(menu === 'gridConnectivities') this.router.navigate(['/grid-connectivities']);
    else if(menu === 'wtgCapacities') this.router.navigate(['/wtg-capacities']);
    else if(menu === 'ppaTypes') this.router.navigate(['/ppa-types']);
    else if(menu === 'plants') this.router.navigate(['/plants']);
    else if(menu === 'customers') this.router.navigate(['/customers']);
    else if(menu === 'zone') this.router.navigate(['/zones']);
    else if(menu === 'cranes') this.router.navigate(['/cranes']);
    else if(menu === 'crane-suppliers') this.router.navigate(['/crane-suppliers']);
    else if(menu === 'department') this.router.navigate(['/departments']);
    else if(menu === 'clusters') this.router.navigate(['/clusters']);
    else if(menu === 'installation') this.router.navigate(['/installation']);
    else if(menu === 'companyUsers') this.router.navigate(['/company-users']);
    else if(menu === 'userGroups') this.router.navigate(['/user-groups']);
    else if(menu === 'roles') this.router.navigate(['/roles']);
    if (window.innerWidth <= 768) this.sidebarOpen.set(false);
else if (menu === 'plant-allocation') {
  this.router.navigate(['/plant-allocation']);
}
else if (menu === 'view-allocation') {
  this.router.navigate(['/view-allocation']);
}
  }

  toggleMastersMenu() {
    this.showMastersMenu = !this.showMastersMenu;
    if (this.showMastersMenu) {
      setTimeout(() => {
        const el = this.sbNav?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    }
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar()  { this.sidebarOpen.set(false); }
  confirmLogout() { this.showLogoutConfirm = true; }
  cancelLogout()  { this.showLogoutConfirm = false; }


  // plant-all

toggleAllocationMenu() {
  this.showAllocationMenu = !this.showAllocationMenu;
}

  doLogout() {
    this.showLogoutConfirm = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  
}