import { Component, AfterViewInit, ElementRef, ViewChild, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

declare const lucide: any;

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [RouterLink, CommonModule, ScrollRevealDirective],
  templateUrl: './servicios.component.html',
})
export class ServiciosComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideoRef?: ElementRef<HTMLVideoElement>;
  private platformId = inject(PLATFORM_ID);
  private videoObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      const video = this.heroVideoRef?.nativeElement;
      if (video) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          video.removeAttribute('autoplay');
          video.pause();
        } else if ('IntersectionObserver' in window) {
          this.videoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            });
          }, { threshold: 0 });
          this.videoObserver.observe(video);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.videoObserver?.disconnect();
  }
}
