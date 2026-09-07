import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero-grid',
  standalone: true,
  template: `<canvas #canvas class="hero-grid-bg" aria-hidden="true"></canvas>`,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class HeroGridComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private rafId: number | null = null;
  private resizeObserver?: ResizeObserver;
  private resizeListener?: () => void;
  private moveListener?: (e: MouseEvent) => void;
  private leaveListener?: () => void;
  private container?: HTMLElement;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      // Small delay to ensure the DOM is fully rendered and container has dimensions
      setTimeout(() => this.initGrid(), 0);
    });
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    if (this.resizeListener) window.removeEventListener('resize', this.resizeListener);
    if (this.container && this.moveListener) {
      this.container.removeEventListener('mousemove', this.moveListener);
    }
    if (this.container && this.leaveListener) {
      this.container.removeEventListener('mouseleave', this.leaveListener);
    }
    if (this.moveListener) window.removeEventListener('mousemove', this.moveListener);
    if (this.leaveListener) window.removeEventListener('mouseleave', this.leaveListener);
  }

  private initGrid(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Walk up the DOM to find the actual container (.page-hero, .hero, or any ancestor with dimensions)
    let container: HTMLElement | null = canvas.parentElement;
    while (container) {
      const style = window.getComputedStyle(container);
      if (style.display !== 'contents' && container.offsetHeight > 0) break;
      container = container.parentElement;
    }
    // Fallback: use closest header or parent of host
    if (!container || container === document.body) {
      container = canvas.closest('header') as HTMLElement
        ?? canvas.closest('.page-hero') as HTMLElement
        ?? canvas.closest('.hero') as HTMLElement
        ?? canvas.parentElement?.parentElement as HTMLElement;
    }
    if (!container) return;
    this.container = container;

    const cellSize = 34;
    const gap = 8;
    const radius = 170;
    const radiusSq = radius * radius;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cells: Float32Array | null = null;
    let mouseX = -9999;
    let mouseY = -9999;

    const resize = () => {
      const rect = container!.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cellSize) + 1;
      rows = Math.ceil(height / cellSize) + 1;
      cells = new Float32Array(cols * rows);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    resize();

    // Use ResizeObserver for accurate container size tracking
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(resize);
      this.resizeObserver.observe(container);
    }

    this.resizeListener = resize;
    window.addEventListener('resize', resize, { passive: true });

    // Listen on container for mouse events (only fires while inside the hero)
    this.moveListener = onMove;
    this.leaveListener = onLeave;
    container.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('mouseleave', onLeave, { passive: true });

    const draw = () => {
      if (!cells) return;
      ctx.clearRect(0, 0, width, height);

      const size = cellSize - gap;

      // Resting grid: faint neutral dot pattern
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(240, 236, 227, .05)';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillRect(c * cellSize + gap / 2, r * cellSize + gap / 2, size, size);
        }
      }

      // Reactive glow trail: orange only, decays smoothly each frame
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const x = c * cellSize;
          const y = r * cellSize;
          const dx = (x + cellSize / 2) - mouseX;
          const dy = (y + cellSize / 2) - mouseY;
          const distSq = dx * dx + dy * dy;

          let target = 0;
          if (distSq < radiusSq) {
            const factor = 1 - Math.sqrt(distSq) / radius;
            target = Math.pow(factor, 1.8);
          }

          if (target > cells[idx]) {
            cells[idx] = target;
          } else {
            cells[idx] *= 0.92;
          }

          const val = cells[idx];
          if (val > 0.01) {
            const alpha = Math.min(val * 0.95, 0.9);
            ctx.fillStyle = `rgba(238, 115, 28, ${alpha})`;
            ctx.fillRect(x + gap / 2, y + gap / 2, size, size);
          }
        }
      }

      if (!reduceMotion) {
        this.rafId = requestAnimationFrame(draw);
      }
    };

    draw();
  }
}
