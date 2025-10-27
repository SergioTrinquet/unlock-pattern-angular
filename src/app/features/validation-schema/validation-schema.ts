import { Component, inject } from '@angular/core';
import { TouchScreenService } from '../../shared/services/touch-screen/touch-screen.service';
import { CookieService } from '../../core/service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { AnimationService } from '../grid/services';

@Component({
  selector: 'app-validation-schema',
  imports: [],
  templateUrl: './validation-schema.html',
  styleUrl: './validation-schema.scss'
})
export class ValidationSchema {
  private TouchScreenService = inject(TouchScreenService);
  // private cookieService = inject(CookieService);
  private animationService = inject(AnimationService);
  private utilsService = inject(UtilsService);

  protected onRedo(): void {
    this.TouchScreenService.vibrateOnTouch(100);

    const vibrateGridTime = this.utilsService.getComputedStyles("--time-vibrate");
    this.animationService.triggerContainerVibrateAnimation(vibrateGridTime); // MODIFIER SERVICE POUR NE PAS AVOIR A PASSER LA DUREE DE L4ANIM EN PARAMETRE
    /* 
    colorationSchema(true, STROKE.color.error);
    s.container.addEventListener("animationend", (e) => {
        if (e.animationName === "vibrate") {
            s.container.classList.remove("vibrate");
            removeSchemaDrawing();
            setComplementaryInfos();
        }
    }, { once: true }); */
  }

  protected onValidate() {
    this.TouchScreenService.vibrateOnTouch([100, 50, 100]);

    const pulseGridTime = this.utilsService.getComputedStyles("--time-pulse");
    this.animationService.triggerGridAnimation(pulseGridTime);  // MODIFIER SERVICE POUR NE PAS AVOIR A PASSER LA DUREE DE L4ANIM EN PARAMETRE

    // this.cookieService.setCookie(this.state.selectedValueNbDots(), s.captureDots); // Création cookie

    /* s.gridPoints.classList.add("pulse");
    s.gridPoints.addEventListener("animationend", () => {
        s.gridPoints.classList.remove("pulse");
        s.container.classList.add("shrink");
        this.cookieService.setCookie(this.state.selectedValueNbDots(), s.captureDots); // Création cookie
    }, { once: true }); */

    /* s.container.addEventListener("animationend", (e) => {
        if (e.animationName === animationShrink) {
            s.container.classList.remove("shrink");
            goBackToStartStep();
        }
    }); */
  }
}
