import { inject, Injectable, signal } from '@angular/core';
import { SelectStateService } from '../../select/services/select-state.service';
import { SchemaNbDotsConfig } from '../../select/types/select.type';
import { MSG_CSS_CLASS, MSG_LABELS, DELAY_TO_DISPLAY } from '../constants/message.constants';
import { of, tap, delay, Subject, takeUntil } from 'rxjs';
import { UtilsService } from '../../../shared/services/utils/utils.service';
import { GridStateService } from '../../grid/services';
import { SchemaValidityService } from '../../grid/services/schema-validity/schema-validity.service';
import { message } from '../types/message.type';
import { AbortAnimationService } from '../../../shared/services/abort-animation/abort-animation.service';
import vars from '../../../../styles/variables.json';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private selectStateService = inject( SelectStateService);
  private gridStateService = inject( GridStateService);
  private schemaValidityService = inject(SchemaValidityService);
  private abortAnimationService = inject(AbortAnimationService);//
  
  private isSchemaRecorded = this.selectStateService.recordedSchema;
  private currentSchemaNbDotsMinMax = this.selectStateService.currentSchemaNbDotsMinMax;
  private capturedDotsLength = this.gridStateService.capturedDotsLength;

  private messageTimeout: ReturnType<typeof setTimeout> = null!;
  private previousInfoText: string | undefined = undefined;

  setComplementaryInfos(calledFromClick?: MouseEvent["type"] | PointerEvent["type"] | undefined): void {  
    // console.log("Dans 'setComplementaryInfos > calledFromClick': ", calledFromClick); //TEST
    const currentSchemaNbDots: SchemaNbDotsConfig | null = this.currentSchemaNbDotsMinMax();
    const captureDotsLength = this.capturedDotsLength();

    clearTimeout(this.messageTimeout); // Plus utile avec RxJs !

    // A la sélection d'une Grid OU qd tracé supprimé et que donc pas de points capturés
    if(!captureDotsLength) this.displayComplementaryInfos({text: `${this.isSchemaRecorded() ? MSG_LABELS.draw : MSG_LABELS.creation}`, anim: true});

    const isSchemaValid = this.schemaValidityService.checkSchemaValidity();
    if(calledFromClick) {
      if(!this.isSchemaRecorded()) {
        if(isSchemaValid) {
          this.displayComplementaryInfos({showButtons: true, anim: true});
          // handleButtonsClick();
        }
        if(currentSchemaNbDots && captureDotsLength < currentSchemaNbDots.nbDotMin) {
          this.displayComplementaryInfos({text: `${MSG_LABELS.invalid}${MSG_LABELS.notEnoughPoints}`, className: MSG_CSS_CLASS.invalid, anim: true});
          //this.messageTimeout = setTimeout(() => { this.displayComplementaryInfos({text: MSG_LABELS.creation, anim: true}) }, DELAY_TO_DISPLAY.labelAfterNotEnoughDots);
          // ou
          this.displayComplementaryInfos({text: MSG_LABELS.creation, anim: true, delay: DELAY_TO_DISPLAY.labelAfterNotEnoughDots})
        }
      } else {
        if(!isSchemaValid) {
          this.displayComplementaryInfos({text: MSG_LABELS.invalid, className: MSG_CSS_CLASS.invalid, anim: true});
          // this.messageTimeout = setTimeout(() => { this.displayComplementaryInfos({text: MSG_LABELS.draw, anim: true}) }, DELAY_TO_DISPLAY.labelAfterInvalidSchema);
          // ou
          this.displayComplementaryInfos({text: MSG_LABELS.draw, anim: true, delay: DELAY_TO_DISPLAY.labelAfterInvalidSchema}) // EN COURS DE DEVPOUR REMPLACER LE setTimeout()
        }
      }
    }

    if(!this.isSchemaRecorded()) {
      if(isSchemaValid) {
        this.displayComplementaryInfos({text: MSG_LABELS.valid, className: MSG_CSS_CLASS.valid, anim: true});
      }

      // Msg points survolés = nb max de points autorisés
      if(currentSchemaNbDots && (captureDotsLength === currentSchemaNbDots.nbDotMax)) {
          this.displayComplementaryInfos({text: MSG_LABELS.maxPointsReached, className: MSG_CSS_CLASS.valid, anim: true});
          // this.messageTimeout = setTimeout(() => {
          //     this.displayComplementaryInfos({showButtons: true, anim: true});
          //     // handleButtonsClick();
          // }, DELAY_TO_DISPLAY.buttonsAfterValidSchema);
          // ou
          this.displayComplementaryInfos({showButtons: true, anim: true, delay: DELAY_TO_DISPLAY.buttonsAfterValidSchema});
      }
    }
  }



  private animationMsg: number = vars.animationMsg;

  private _text = signal<string>('');
  private _customClass = signal<string>("");
  private _animUp = signal<string>("");
  private _showButtons = signal<boolean | undefined>(undefined);

  readonly text = this._text.asReadonly();
  readonly customClass = this._customClass.asReadonly();
  readonly animUp = this._animUp.asReadonly();
  readonly showButtons = this._showButtons.asReadonly();

  setText(text: string): void {
    this._text.set(text);
  }
  setCustomClass(className: string): void {
    this._customClass.set(className);
  }
  setAnimUp(className: string): void {
    this._animUp.set(className);
  }
  setShowButtons(val: boolean): void {
    this._showButtons.set(val);
  }


  private displayComplementaryInfos(pm: message): void {
    // console.log("%cpm.text: ", 'background-color: lightblue; color: #000;', pm.text); //TEST
    if(pm.text === this.previousInfoText) { /* console.log("%cMeme Text que precedemment : Ne pas faire d'anim! Sortir de la fonction", 'background-color: lightcoral; color: #000;'); */ return; }
    this.previousInfoText = pm.text;

    const flagAnimation = !!pm.anim; 
    if(flagAnimation) {
      // Version avec setTimeout() : Fonctionne!
      /* if(!pm.className) this.setCustomClass(MSG_CSS_CLASS.default);
      this.setAnimUp(MSG_CSS_CLASS.animation);
      if(!!pm.className) this.setCustomClass(pm.className);
      setTimeout(() => { 
        if(pm.showButtons && !pm.text) this.setShowButtons(pm.showButtons);
        if(!pm.showButtons && pm.text) this.setText(pm.text); 
      }, this.animationMsg / 2);
      setTimeout(() => { this.setAnimUp("") }, this.animationMsg); */

      // Version avec RxJs : Fonctionne !
      /* of(null).pipe(
        tap(() => {
          if(!pm.className) this.setCustomClass(MSG_CSS_CLASS.default);
          this.setAnimUp(MSG_CSS_CLASS.animation);
          if(!!pm.className) this.setCustomClass(pm.className)
        }),
        delay(this.animationMsg / 2),
        tap(() => {
          if(pm.showButtons && !pm.text) this.setShowButtons(pm.showButtons);
          if(!pm.showButtons && pm.text) this.setText(pm.text);
        }),
        delay(this.animationMsg / 2),
        tap(() => this.setAnimUp(""))
      ).subscribe(); */

      ////// Version avc RxJs + delay : Fonctionne ! //////
      let obs$ = of(null);
      if(pm.delay) { console.log("%cDelay avant affichage du message: " + pm.delay + " ms", 'background-color: lightgreen; color: #000;');
        obs$ = obs$.pipe(delay(pm.delay));
      }
      obs$ = obs$.pipe(
        tap(() => {
          if(!pm.className) this.setCustomClass(MSG_CSS_CLASS.default);
          this.setAnimUp(MSG_CSS_CLASS.animation);
          if(!!pm.className) this.setCustomClass(pm.className)
        }),
        delay(this.animationMsg / 2),
        tap(() => {
          if(pm.showButtons && !pm.text) this.setShowButtons(pm.showButtons);
          if(!pm.showButtons && pm.text) this.setText(pm.text);
        }),
        delay(this.animationMsg / 2),
        tap(() => this.setAnimUp(""))
      );
      if(pm.delay) { console.log("%cDelay avant affichage du message PHASE 2: " + pm.delay + " ms", 'background-color: lightgreen; color: #000;');
        obs$ = obs$.pipe(
          takeUntil(this.abortAnimationService.abort$) // ✅ annule si abort$ émet avant la fin
        );
      }
      obs$.subscribe();
      ////////////////////

    } else {  
        if(pm.showButtons && !(pm.text || pm.text == "")) this.setShowButtons(pm.showButtons);
        if((pm.text || pm.text == "") && !pm.showButtons) this.setText(pm.text);
    }
  }

  public removeComplementaryInfos() {
    this.displayComplementaryInfos({ text: "" });
  }

}
