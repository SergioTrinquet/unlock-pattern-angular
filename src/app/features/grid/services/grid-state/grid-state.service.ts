import { computed, Injectable, signal } from '@angular/core';
import { Dot } from '../../types/grid.type';

@Injectable({
  providedIn: 'root'
})
export class GridStateService {
  private _dotsCoord = signal<Dot[]>([]);
  readonly dotsCoord = this._dotsCoord.asReadonly();

  private _capturedDots = signal<number[]>([]);
  readonly capturedDots = this._capturedDots.asReadonly();

  readonly capturedDotsLength = computed(() => this._capturedDots().length);

  setDotsCood(dots: Dot[]): void {
    this._dotsCoord.set(dots);
  }

  setCapturedDots(idxs: number[]): void {
    const newDots = [...idxs];
    this._capturedDots.set(newDots);
  }
}
