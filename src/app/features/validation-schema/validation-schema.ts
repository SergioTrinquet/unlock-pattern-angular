import { Component, inject } from '@angular/core';
import { TouchScreenService } from '../../shared/services/touch-screen/touch-screen.service';
import { AnimationService, GridStateService } from '../grid/services';
import { SelectControlService, SelectStateService } from '../select/services';
import { CookieService } from '../../core/service/cookie/cookie.service';
import { ResetSchemaService } from './services/reset-schema/reset-schema.service';

@Component({
  selector: 'app-validation-schema',
  imports: [],
  templateUrl: './validation-schema.html',
  styleUrl: './validation-schema.scss'
})
export class ValidationSchema {
  private touchScreenService = inject(TouchScreenService);
  private cookieService = inject(CookieService);
  private animationService = inject(AnimationService);
  private resetSchemaService = inject(ResetSchemaService);
  private selectStateService = inject(SelectStateService);
  private selectControlService = inject(SelectControlService);
  private gridStateService = inject(GridStateService);

  private capturedDots = this.gridStateService.capturedDots;

  protected onReset(): void {
    this.touchScreenService.vibrateOnTouch(100);
    this.resetSchemaService.triggerResetSchema(true);
    this.animationService.triggerContainerVibrateAnimation("timeVibrate")
      .subscribe({
        complete: () => this.resetSchemaService.triggerResetSchema(false)
      });
  }

  protected onValidate() {
    this.touchScreenService.vibrateOnTouch([100, 50, 100]);
    this.animationService.triggerGridAnimation("timePulse")
      .subscribe({
        complete: () => {
          const nbDotsGrid = this.selectStateService.selectedValueNbDots();
          if(nbDotsGrid) this.cookieService.setCookie(nbDotsGrid, this.capturedDots());

          this.animationService.triggerContainerShrinkAnimation("timeShrink")
            .subscribe({
              complete: () => this.selectControlService.resetSelectToDefault()
            });
        }
      });
  }
}
