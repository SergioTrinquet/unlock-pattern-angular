import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  // private utilsService = inject(UtilsService);
  // protected animateVibrateContainerTime: number = this.utilsService.getComputedStyles("--time-vibrate"); // A SUPPRIMER DES QUE POSSIBLE
  // protected animateShrinkContainerTime: number = this.utilsService.getComputedStyles("--time-shrink"); // A SUPPRIMER DES QUE POSSIBLE

  private _animateGrid = signal(false);
  private _animateContainerVibration = signal(false);
  private _animateContainerShrink = signal(false);

  readonly animateGrid = this._animateGrid.asReadonly();
  readonly animateContainerVibration = this._animateContainerVibration.asReadonly();
  readonly animateContainerShrink = this._animateContainerShrink.asReadonly();

  triggerGridAnimation(delay: number) {
    this._animateGrid.set(true);
    setTimeout(() => this._animateGrid.set(false), delay);
  }
  triggerContainerVibrateAnimation(delay: number) {
    this._animateContainerVibration.set(true);
    // setTimeout(() => this._animateContainerVibration.set(false), this.animateVibrateContainerTime);
    setTimeout(() => this._animateContainerVibration.set(false), delay);
  }
  triggerContainerShrinkAnimation(delay: number) {
    this._animateContainerShrink.set(true);
    // setTimeout(() => this._animateContainerShrink.set(false), this.animateShrinkContainerTime);
    setTimeout(() => this._animateContainerShrink.set(false), delay);
  }


  /// V2///
  /* 
  triggerContainerVibrateAnimation(className: string) {
    this.triggerAnimation(this._animateContainerVibration, className);
  } 
  private triggerAnimation(signal: WritableSignal<boolean>, className: string): void {
    // En fonction de la className, retrouver dans la constant 'ANIMATIONS' la 'duration' correspondante via un Type par exemple
    signal.set(true);
    setTimeout(() => signal.set(false), duration);
  } 
  */
  //////

}
