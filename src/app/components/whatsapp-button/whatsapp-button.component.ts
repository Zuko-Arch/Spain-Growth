import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  template: `
    <a class="wa-float" href="https://wa.me/34669564787" target="_blank" rel="noopener noreferrer" aria-label="Hablar por WhatsApp">
      <span class="wa-pulse"></span>
      <i class="fa-brands fa-whatsapp"></i>
    </a>
  `
})
export class WhatsappButtonComponent {}
