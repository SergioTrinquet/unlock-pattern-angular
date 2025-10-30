import { inject, Injectable } from '@angular/core';
import { GridStateService } from '../grid-state/grid-state.service';
import { SelectStateService } from '../../../select/services/select-state/select-state.service';
import { COOKIE_NAME_PREFIX } from '../../../../app.constants';
import { CookieService } from '../../../../core/service/cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class SchemaValidityService {
  private gridState = inject(GridStateService);
  private selectState = inject(SelectStateService);
  private cookieService = inject(CookieService);
  private capturedDots = this.gridState.capturedDots;
  private capturedDotsLength = this.gridState.capturedDotsLength;
  private currentSchemaNbDotsMinMax = this.selectState.currentSchemaNbDotsMinMax;
  private recordedSchema = this.selectState.recordedSchema;
  private selectedValueNbDots = this.selectState.selectedValueNbDots;

  public checkSchemaValidity(): boolean {
    let validSchema = false;
    if(!this.recordedSchema()) {
        // Check si nb saisie points est bien entre nb min et nb max 
        if(this.capturedDotsLength() < this.currentSchemaNbDotsMinMax()!.nbDotMin || this.capturedDotsLength() > this.currentSchemaNbDotsMinMax()!.nbDotMax) { validSchema = false }
        if(this.capturedDotsLength() >= this.currentSchemaNbDotsMinMax()!.nbDotMin && this.capturedDotsLength() <= this.currentSchemaNbDotsMinMax()!.nbDotMax) { validSchema = true }
    } else { 
        // Check si saisie points correspond à valeur cookie
        validSchema = JSON.parse(this.cookieService.getCookieValue(`${COOKIE_NAME_PREFIX}${this.selectedValueNbDots()}`) ?? "")?.combination.join(",") === this.capturedDots().join(",") 
        ? true 
        : false;
    }
    return validSchema;
  }
}
