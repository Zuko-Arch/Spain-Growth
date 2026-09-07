import { Component, AfterViewInit, ElementRef, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { CtaBandComponent } from '../../components/cta-band/cta-band.component';

declare const lucide: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, ScrollRevealDirective, CtaBandComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideoRef?: ElementRef<HTMLVideoElement>;
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      this.startVideo();
    }
  }

  private startVideo(): void {
    const video = this.heroVideoRef?.nativeElement;
    if (!video) return;

    // Asegurar atributos de reproducción automática
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = () => {
      video.play().catch(() => {
        // Si el navegador bloquea autoplay, intentar de nuevo tras interacción del usuario
        const resume = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', resume);
          document.removeEventListener('touchstart', resume);
        };
        document.addEventListener('click', resume, { once: true });
        document.addEventListener('touchstart', resume, { once: true });
      });
    };

    // Intentar reproducir inmediatamente
    playVideo();

    // Fallback: reproducir en cuanto el video tenga datos suficientes
    video.addEventListener('canplay', playVideo, { once: true });
  }
}

