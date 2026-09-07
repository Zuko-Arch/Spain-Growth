import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Spain Growth — Agencia de Marketing y Publicidad'
  },
  {
    path: 'inicio',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'servicios',
    loadComponent: () => import('./pages/servicios/servicios.component').then((m) => m.ServiciosComponent),
    title: 'Servicios — Spain Growth'
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/nosotros/nosotros.component').then((m) => m.NosotrosComponent),
    title: 'Nosotros — Spain Growth'
  },
  {
    path: 'portafolio',
    loadComponent: () => import('./pages/portafolio/portafolio.component').then((m) => m.PortafolioComponent),
    title: 'Portafolio — Spain Growth'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.component').then((m) => m.ContactoComponent),
    title: 'Contacto — Spain Growth'
  },
  {
    path: 'proyecto',
    loadComponent: () => import('./pages/proyecto/proyecto.component').then((m) => m.ProyectoComponent),
    title: 'Tengo un proyecto — Spain Growth'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
