import { computed, inject, Injectable, signal } from '@angular/core';
import { DOTS_SCHEMA_CONFIGS } from '../../constants/select.constants';
import { CookieService } from '../../../../core/service';

@Injectable({
  providedIn: 'root'
})
export class SelectStateService {
  private cookieService = inject(CookieService);

  private _selectedValueNbDots = signal<number | null>(null);
  private _recordedSchema = signal<boolean>(false);

  readonly selectedValueNbDots = this._selectedValueNbDots.asReadonly();
  readonly recordedSchema = this._recordedSchema.asReadonly();

  readonly currentSchemaNbDotsMinMax = computed(() => {
    return !this._recordedSchema() ? (DOTS_SCHEMA_CONFIGS.find(d => (d.nbDotPerLC * d.nbDotPerLC) === this._selectedValueNbDots()) || null) : null
  })

  readonly isSelectedValueNbDots = computed(() => {
    return Number.isInteger(this._selectedValueNbDots());
  })

  public setSelectedValueNbDots(nb: number | null): void {
    this._selectedValueNbDots.set(nb);
  }

  public setRecordedSchema(): void {
    this._recordedSchema.set(this.cookieService.isCookiePresent());
  }
}
