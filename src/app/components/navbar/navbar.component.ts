import { Component, OnInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="nav" [class.is-scrolled]="isScrolled()">
      <a routerLink="/" class="nav-logo" (click)="closeMenu()">
        <img src="PNG/logo_p.png" alt="Spain Growth" class="logo-desktop" width="571" height="87">
        <img src="PNG/logo.png" alt="Spain Growth" class="logo-mobile" width="145" height="112">
      </a>
      <div class="nav-links" [class.open]="menuOpen()">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Inicio</a>
        <a routerLink="/servicios" routerLinkActive="active" (click)="closeMenu()">Servicios</a>
        <a routerLink="/nosotros" routerLinkActive="active" (click)="closeMenu()">Nosotros</a>
        <a routerLink="/portafolio" routerLinkActive="active" (click)="closeMenu()">Portafolio</a>
        <a routerLink="/contacto" routerLinkActive="active" (click)="closeMenu()">Contacto</a>
      </div>
      <div class="nav-right">
        <button 
          class="theme-toggle" 
          type="button" 
          (click)="toggleTheme()"
          [attr.aria-label]="'Tema actual: ' + themeLabel() + '. Cambiar tema'"
          [attr.title]="'Tema: ' + themeLabel()"
        >
          <svg *ngIf="themePreference() === 'auto'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
          </svg>
          <svg *ngIf="themePreference() === 'light'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>
          <svg *ngIf="themePreference() === 'dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
          <span class="theme-label">{{ themeLabel() }}</span>
        </button>
        <a routerLink="/proyecto" class="btn btn-signal" (click)="closeMenu()">Tengo un proyecto</a>
        <button 
          class="nav-burger" 
          [class.open]="menuOpen()" 
          (click)="toggleMenu()" 
          aria-label="Abrir menú"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  private themeService = inject(ThemeService);

  readonly isScrolled = signal<boolean>(false);
  readonly menuOpen = signal<boolean>(false);

  get themePreference() {
    return this.themeService.themePreference;
  }

  themeLabel(): string {
    return this.themeService.getLabel();
  }

  toggleTheme(): void {
    this.themeService.cycleTheme();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => {
      const next = !open;
      if (typeof document !== 'undefined') {
        document.body.style.overflow = next ? 'hidden' : '';
      }
      return next;
    });
  }

  closeMenu(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 12);
    }
  }

  ngOnInit(): void {
    this.onWindowScroll();
  }
}
