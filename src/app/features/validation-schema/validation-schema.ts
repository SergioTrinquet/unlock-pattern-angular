import { Component, inject } from '@angular/core';
import { TouchScreenService } from '../../shared/services/touch-screen/touch-screen.service';
import { CookieService } from '../../core/service'
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

  protected onRedo(): void {
    this.TouchScreenService.vibrateOnTouch(100);
    // colorationSchema(true, STROKE.color.error);
    this.animationService.triggerContainerVibrateAnimation("timeVibrate")
      .subscribe({
        complete: () => { 
          console.log("Animation Vibrate terminée !!!!");
          // removeSchemaDrawing();
          // setComplementaryInfos();
        }
      });

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
    this.animationService.triggerGridAnimation("timePulse")
      .subscribe({
        complete: () => {
          console.log("Animation Pulse terminée !!!!");

          this.animationService.triggerGridAnimation("timeShrink")
            .subscribe({
              complete: () => console.log("Animation Vibrate terminée !!!!")
            });
        }
      });

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
