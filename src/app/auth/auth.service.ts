import { Injectable, signal } from '@angular/core';

export interface User {
  username: string;
  role: string;
  displayName: string;
}

const USERS: Record<string, User> = {
  'ari.g@cloute.co.in': {
    username: 'ari.g@cloute.co.in', role: 'Super Admin', displayName: 'Super Admin'
  }
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  login(username: string): boolean {
    const user = USERS[username];
    if (user) {
      this._user.set(user);
      sessionStorage.setItem('auth_user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    sessionStorage.removeItem('auth_user');
  }

  isLoggedIn(): boolean {
    if (this._user()) return true;
    const stored = sessionStorage.getItem('auth_user');
    if (stored) {
      try {
        this._user.set(JSON.parse(stored));
        return true;
      } catch { return false; }
    }
    return false;
  }

  restore(): void {
    const stored = sessionStorage.getItem('auth_user');
    if (stored) {
      try { this._user.set(JSON.parse(stored)); } catch {}
    }
  }

  setUser(email: string): void {
    const user: User = {
      username: email,
      displayName: 'Super Admin',
      role: 'User'
    };

    this._user.set(user);
    sessionStorage.setItem('auth_user', JSON.stringify(user));
  }
}
