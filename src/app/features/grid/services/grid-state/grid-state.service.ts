import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridStateService {
  private _capturedDots = signal<number[]>([]);
  readonly capturedDots = this._capturedDots.asReadonly();

  readonly capturedDotsLength = computed(() => this._capturedDots().length);

  setCapturedDots(idxs: number[]): void {
    const newDots = [...idxs];
    this._capturedDots.set(newDots);
  }
}
