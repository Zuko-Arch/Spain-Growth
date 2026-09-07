import { Component, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { HeroGridComponent } from '../../components/hero-grid/hero-grid.component';

declare const lucide: any;

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [RouterLink, CommonModule, ScrollRevealDirective, HeroGridComponent],
  templateUrl: './nosotros.component.html',
})
export class NosotrosComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }
}
