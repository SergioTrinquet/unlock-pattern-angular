import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TouchScreenService {
  /* private _isTouchDevice = signal<boolean>(this.detectTouch());
  readonly isTouchDevice = this._isTouchDevice.asReadonly(); */
  readonly isTouchDevice = this.detectTouch();

  private detectTouch(): boolean {
    return navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  }
  
  public vibrateOnTouch(periodInMs: number[] | number = 100): void {
    if ('vibrate' in navigator) navigator.vibrate(periodInMs);
  }

  public releasePointerCaptureOnTouchScreen(e: PointerEvent): void {
    if (e.target instanceof HTMLElement) {
      const el: HTMLElement = e.target;
      el.releasePointerCapture(e.pointerId);
    }
  }

  // NE PAS OUBLIER => A FAIRE !!!! : Coloration de l'entete du browser pour le mobile uniquement
  /* changeThemeColor(color) {
    let metaTag = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', color);
  }
  changeThemeColor(themeColor); */
}
