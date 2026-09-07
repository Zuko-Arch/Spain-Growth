import { Component, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { HeroGridComponent } from '../../components/hero-grid/hero-grid.component';
import { CtaBandComponent } from '../../components/cta-band/cta-band.component';

declare const lucide: any;

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, HeroGridComponent, CtaBandComponent],
  templateUrl: './portafolio.component.html',
})
export class PortafolioComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }
}
