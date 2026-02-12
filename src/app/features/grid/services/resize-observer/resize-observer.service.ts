import { computed, Injectable, signal } from '@angular/core';
import { Canvas, Dot } from '../../types/grid.type';

@Injectable({
  providedIn: 'root'
})
export class ResizeObserverService {
  private _canvas = signal<Canvas>({  height: 0, width: 0 });
  readonly canvas = this._canvas.asReadonly();
  private _dotsElements = signal<HTMLElement[]>([]);
  private observer?: ResizeObserver;

  readonly dotsCoord = computed(() => {
    if(this._canvas().height > 0) {
      const dotsArray = this._dotsElements();
      const DotDistanceCenter = dotsArray[0].getBoundingClientRect().width / 2;
      let dotsCoord: Dot[] = [];
      dotsArray.forEach((dot) => {
          const boundingDot = dot.getBoundingClientRect();
          dotsCoord.push({
              "top": boundingDot.top - (this._canvas().top ?? 0) + DotDistanceCenter,
              "left": boundingDot.left - (this._canvas().left ?? 0) + DotDistanceCenter
          });
      }) 
      return dotsCoord;
    } else {
      return [];
    }
  })

 public resizeObservation(container: HTMLElement, viewport: HTMLElement): void {    
    // on détruit un ancien observer si déjà existant
    this.disconnect();

    if (!container) return;

    this.observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const rect = container.getBoundingClientRect();   
        // console.log("%ccontainer ResizeObserver:", "background-color: purple;color: yellow;", rect);
        this._canvas.set({ 
          width: rect.width, 
          height: rect.height, 
          top: rect.top, 
          left: rect.left 
        });
      }
    });

    this.observer.observe(viewport);
  }

  public disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  public setDotsElements(elements: HTMLElement[]): void {
    this._dotsElements.set(elements);
  }
}
