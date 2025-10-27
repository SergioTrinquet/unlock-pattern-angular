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

  resizeObservation(el: HTMLElement): void {    
    // on détruit un ancien observer si déjà existant
    this.disconnect();

    this.observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        this._canvas.set({ 
          width: entry.contentRect.width, 
          height: entry.contentRect.height, 
          top: entry.target.getBoundingClientRect().top, 
          left: entry.target.getBoundingClientRect().left 
        });
      }
    });

    this.observer.observe(el);
  }

  disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }


  //////// TEST /////////
  // Méthode appelée depuis le composant pour donner les éléments des points
  setDotsElements(elements: HTMLElement[]): void {
    this._dotsElements.set(elements);
  }

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
          
      console.log("%c---getCanvasSizeAndDotsCoord()----", "background-color: orange; color: black", dotsCoord);
      return dotsCoord;
    } else {
      return [];}
  })
  ///////////////////////

}
