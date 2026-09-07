import { Component, AfterViewInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { HeroGridComponent } from '../../components/hero-grid/hero-grid.component';

declare const lucide: any;

@Component({
  selector: 'app-proyecto',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ScrollRevealDirective, HeroGridComponent],
  templateUrl: './proyecto.component.html',
})
export class ProyectoComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  readonly submitted = signal(false);

  formData = {
    nombre: '',
    empresa: '',
    correo: '',
    telefono: '',
    pais: 'España',
    tipo_servicio: '',
    presupuesto: '',
    descripcion: ''
  };

  presupuestos: string[] = [
    'Menos de 1.000€',
    '1.000€ – 3.000€',
    '3.000€ – 10.000€',
    'Más de 10.000€',
    'Prefiero comentarlo'
  ];

  selectPresupuesto(val: string): void {
    this.formData.presupuesto = val;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        const successEl = document.getElementById('project-success');
        successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }
}
