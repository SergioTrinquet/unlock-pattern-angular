import { Component, inject } from '@angular/core';
import { TouchScreenService } from '../../shared/services/touch-screen/touch-screen.service';
import { AnimationBackgroundGridService, GridStateService } from '../grid/services';
import { SelectControlService, SelectStateService } from '../select/services';
import { CookieService } from '../../core/service/cookie/cookie.service';
import { ResetSchemaService } from './services/reset-schema/reset-schema.service';
import { AbortStrokesAnimationService } from '../../shared/services/abort-strokes-animation/abort-strokes-animation.service';

@Component({
  selector: 'app-validation-schema',
  standalone: true,
  imports: [],
  templateUrl: './validation-schema.html',
  styleUrl: './validation-schema.scss'
})
export class ValidationSchema {
  private touchScreenService = inject(TouchScreenService);
  private cookieService = inject(CookieService);
  private animationBackgroundGridService = inject(AnimationBackgroundGridService);
  private resetSchemaService = inject(ResetSchemaService);
  private selectStateService = inject(SelectStateService);
  private selectControlService = inject(SelectControlService);
  private gridStateService = inject(GridStateService);
  private abortStrokesAnimationService = inject(AbortStrokesAnimationService);

  private capturedDots = this.gridStateService.capturedDots;


  protected onReset(): void {
    this.touchScreenService.vibrateOnTouch(100);
    this.abortStrokesAnimationService.stopSequence();// Pour arrêter toute animation en cours avant de réinitialiser le schéma (ex: si l'utilisateur clique sur 'Reset' pendant que les traits du schéma sont en train de se colorer)
    this.resetSchemaService.triggerResetSchema(true);
    this.animationBackgroundGridService.triggerContainerVibrateAnimation("timeVibrate")
      .subscribe({
        complete: () => this.resetSchemaService.triggerResetSchema(false)
      });
  }

  protected onValidate(): void {
    this.touchScreenService.vibrateOnTouch([100, 50, 100]);
    this.animationBackgroundGridService.triggerGridAnimation("timePulse")
      .subscribe({
        complete: () => {
          const nbDotsGrid = this.selectStateService.selectedValueNbDots();
          if(nbDotsGrid) this.cookieService.setCookie(nbDotsGrid, this.capturedDots());

          this.animationBackgroundGridService.triggerContainerShrinkAnimation("timeShrink")
            .subscribe({
              complete: () => this.selectControlService.resetSelectToDefault()
            });
        }
      });
  }
}
