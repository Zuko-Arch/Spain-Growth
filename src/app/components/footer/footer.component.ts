import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="wrap">
        <div class="footer-top">
          <div class="footer-brand">
            <a routerLink="/" class="nav-logo">
              <img src="PNG/logo_p.png" alt="Spain Growth" class="logo-desktop" width="571" height="87">
              <img src="PNG/logo.png" alt="Spain Growth" class="logo-mobile" width="145" height="112">
            </a>
            <p>Agencia de marketing y publicidad que impulsa el crecimiento de empresas, pymes y emprendedores en toda España a través de estrategia digital, creatividad y especialización técnica.</p>
          </div>
          <div class="footer-col">
            <h4>Navegación</h4>
            <a routerLink="/">Inicio</a>
            <a routerLink="/servicios">Servicios</a>
            <a routerLink="/nosotros">Nosotros</a>
            <a routerLink="/portafolio">Portafolio</a>
            <a routerLink="/contacto">Contacto</a>
          </div>
          <div class="footer-col">
            <h4>Servicios</h4>
            <a routerLink="/servicios">SEO Local + Google Business Profile</a>
            <a routerLink="/servicios">Automatización IA + Chatbots</a>
            <a routerLink="/servicios">Google Ads / SEM</a>
            <a routerLink="/servicios">Marketing Digital</a>
          </div>
          <div class="footer-col">
            <h4>Contacto</h4>
            <p>spaingrowth@gmail.com</p>
            <p>+34 669 56 47 87</p>
            <p>Valencia, España</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Spain Growth. Todos los derechos reservados.</span>
          <span>Diseñado y desarrollado con foco en resultados.</span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
