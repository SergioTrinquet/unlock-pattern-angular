import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbortStrokesAnimationService {
  private _abort$ = new Subject<void>();
  readonly abort$ = this._abort$;

  // Fonction pour arreter observable
  public stopSequence(): void {  console.log("Dans 'AbortStrokesAnimationService > stopSequence()'");
    this.abort$.next();
  }

  public getAbort(): Subject<void> {
    return this._abort$;
  }
}
