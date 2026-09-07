import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemePreference = 'auto' | 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'spain-growth-theme';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly themePreference = signal<ThemePreference>('auto');
  readonly resolvedTheme = signal<'light' | 'dark'>('light');

  constructor() {
    if (this.isBrowser) {
      try {
        const saved = localStorage.getItem(this.storageKey) as ThemePreference;
        if (saved && ['auto', 'light', 'dark'].includes(saved)) {
          this.themePreference.set(saved);
        }
      } catch (e) {
        // Storage access error handling
      }

      this.applyCurrentTheme();

      // Check auto theme periodically
      setInterval(() => {
        if (this.themePreference() === 'auto') {
          this.applyCurrentTheme();
        }
      }, 15 * 60 * 1000);
    }
  }

  private getAutoTheme(): 'light' | 'dark' {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 7 ? 'dark' : 'light';
  }

  private resolve(pref: ThemePreference): 'light' | 'dark' {
    return pref === 'auto' ? this.getAutoTheme() : pref;
  }

  private applyCurrentTheme(): void {
    if (!this.isBrowser) return;
    const pref = this.themePreference();
    const resolved = this.resolve(pref);
    this.resolvedTheme.set(resolved);

    document.documentElement.dataset['theme'] = resolved;
    document.documentElement.dataset['themePreference'] = pref;
  }

  cycleTheme(): void {
    const cycle: ThemePreference[] = ['auto', 'light', 'dark'];
    const current = this.themePreference();
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    
    this.themePreference.set(next);
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.storageKey, next);
      } catch (e) {}
    }
    this.applyCurrentTheme();
  }

  getLabel(): string {
    const pref = this.themePreference();
    switch (pref) {
      case 'light': return 'Claro';
      case 'dark': return 'Oscuro';
      default: return 'Auto';
    }
  }
}
