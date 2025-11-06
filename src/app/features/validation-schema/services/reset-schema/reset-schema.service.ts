import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResetSchemaService {
  private _resetRequested = signal<boolean | null>(null);
  readonly resetRequested = this._resetRequested.asReadonly();

  public triggerResetSchema(val: boolean | null): void {
    this._resetRequested.set(val);
  }

}
