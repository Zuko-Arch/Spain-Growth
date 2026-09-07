import { Component, OnInit, AfterViewInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { HeroGridComponent } from '../../components/hero-grid/hero-grid.component';

declare const lucide: any;

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollRevealDirective, HeroGridComponent],
  templateUrl: './contacto.component.html',
})
export class ContactoComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  readonly submitted = signal(false);

  formData = {
    nombre: '',
    empresa: '',
    correo: '',
    telefono: '',
    servicio: '',
    mensaje: ''
  };

  servicesList: string[] = [
    'SEO Local + Google Business Profile',
    'Automatización IA + Chatbots',
    'Google Ads / SEM',
    'Ciberseguridad',
    'Marketing Digital',
    'Integraciones',
    'Data & Analytics',
    'Infra & DevOps',
    'Desarrollo Web',
    'Otro'
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const servicioParam = params['servicio'];
      if (servicioParam) {
        const found = this.servicesList.find(
          (s) => s.toLowerCase() === servicioParam.toLowerCase()
        );
        if (found) {
          this.formData.servicio = found;
        } else {
          this.formData.servicio = servicioParam;
        }
      }
    });
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
        const successEl = document.getElementById('contact-success');
        successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }
}
