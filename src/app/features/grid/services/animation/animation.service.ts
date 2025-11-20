import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CssVarsKeys, CssVarsValue } from '../../types/grid.type';
import { of, tap, delay, Observable, takeUntil, finalize } from 'rxjs';
import { AbortAnimationService } from '../../../../shared/services/abort-animation/abort-animation.service';
import vars from '../../../../../styles/variables.json';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private abortAnimationService = inject(AbortAnimationService);

  private _animateGrid = signal(false);
  private _animateContainerVibration = signal(false);
  private _animateContainerShrink = signal(false);

  readonly animateGrid = this._animateGrid.asReadonly();
  readonly animateContainerVibration = this._animateContainerVibration.asReadonly();
  readonly animateContainerShrink = this._animateContainerShrink.asReadonly();

  public triggerContainerShrinkAnimation(CssVarKey: CssVarsKeys): Observable<null> {
    return this.triggerAnimation(this._animateContainerShrink, CssVarKey);
  }

  public triggerGridAnimation(CssVarKey: CssVarsKeys): Observable<null> {
    return this.triggerAnimation(this._animateGrid, CssVarKey);
  }

  public triggerContainerVibrateAnimation(CssVarKey: CssVarsKeys): Observable<null> {
    return this.triggerAnimation(this._animateContainerVibration, CssVarKey);
  } 

  private triggerAnimation(signal: WritableSignal<boolean>, cssVarKeyName: CssVarsKeys): Observable<null> {
    const duration: CssVarsValue<typeof cssVarKeyName> = vars[cssVarKeyName];
    return of(null).pipe(
      tap(() => signal.set(true)),
      delay(duration),
      tap(() => signal.set(false)),
      takeUntil(this.abortAnimationService.getAbort()), // ✅ annule si abort$ émet avant la fin
      finalize(() => signal.set(false))
    );
  }
}
