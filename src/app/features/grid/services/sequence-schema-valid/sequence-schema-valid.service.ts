import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { of, tap, delay } from 'rxjs';
import { SEQUENCE_ANIMATION_DRAWING_SUCCESS } from '../../constants/grid.constants';
import { SvgAnimationDirective } from '../../directives/svg-animation.directive';
import { SelectControlService } from '../../../select/services';
import vars from '../../../../../styles/variables.json';

@Injectable({
  providedIn: 'root'
})
export class SequenceSchemaValidService {
  private selectControlService = inject(SelectControlService);
  private svg!: SvgAnimationDirective;

  private _cardFlipOver = signal<boolean>(false);
  readonly cardFlipOver = this._cardFlipOver.asReadonly();

  private _growCardAfterFlipOver = signal<boolean>(false);
  readonly growCardAfterFlipOver = this._growCardAfterFlipOver.asReadonly();

  private _screenMsgSuccess = signal<boolean>(false);
  readonly screenMsgSuccess = this._screenMsgSuccess.asReadonly();

  private _screenToAnimUp = signal<boolean>(false);
  readonly screenToAnimUp = this._screenToAnimUp.asReadonly();

  public registerSvgDirective(svgDirective: SvgAnimationDirective): void {
    this.svg = svgDirective;
  }

  private setSignal(varSignal: WritableSignal<boolean>, val: boolean): void {
    varSignal.set(val);
  }

  public runSequenceSchemaValid(): void {
    const { stepCardFlip, stepAnimSVG, stepDisplayMsgSuccess, stepDelayBeforeMsgSuccessClose } = SEQUENCE_ANIMATION_DRAWING_SUCCESS;
    of(null).pipe(
      tap(() => {
        this.svg.init();
        this.setSignal(this._cardFlipOver, true);
        this.svg.resetAnimations();
      }),
      delay(stepCardFlip),
      tap(() => this.svg.startAnimation()),
      delay(stepAnimSVG),
      tap(() => {
        this.setSignal(this._growCardAfterFlipOver, true);
        this.setSignal(this._screenMsgSuccess, true);
      }),
      delay(stepDisplayMsgSuccess),
      tap(() => {
        this.selectControlService.resetSelectToDefault();
        this.setSignal(this._cardFlipOver, false);
        this.setSignal(this._growCardAfterFlipOver, false);
      }),
      delay(stepDelayBeforeMsgSuccessClose),
      tap(() => this.screenDisappearance())
    ).subscribe();
  }

  public screenDisappearance(): void {
    this.setSignal(this._screenToAnimUp, true);
    setTimeout(() => {
      this.setSignal(this._screenToAnimUp, false);
      this.setSignal(this._screenMsgSuccess, false);
    }, vars.timeScreenSuccessVanish);
  }
}
  