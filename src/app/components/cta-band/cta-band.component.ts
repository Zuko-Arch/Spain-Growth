import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-cta-band',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  template: `
    <section class="section-tight">
      <div class="cta-band reveal">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <div class="hero-actions">
          <a routerLink="/proyecto" class="btn btn-signal btn-lg">Tengo un proyecto</a>
          <a routerLink="/contacto" class="btn btn-ghost-light btn-lg">Contactar</a>
        </div>
      </div>
    </section>
  `
})
export class CtaBandComponent {
  @Input() title = 'Hablemos de cómo hacer crecer tu marca.';
  @Input() description = 'Cuéntanos tu proyecto y te responderemos en menos de 24 horas laborables.';
}
