import { Component, effect, inject } from '@angular/core';
import { DELETE_SCHEMA_LABEL } from '../select/constants/select.constants';
import { CookieService } from '../../core/service';
import { SelectStateService } from '../select/services/select-state.service';

@Component({
  selector: 'app-delete-schema',
  imports: [],
  standalone: true,
  templateUrl: './delete-schema.html',
  styleUrl: './delete-schema.scss'
})
export class DeleteSchemaComponent {
  private selectState = inject(SelectStateService);

  constructor() {
    // Affichage lien de suppression du schéma enregistré
    effect(() => {
      const val = this.selectState.recordedSchema() && this.selectState.selectedValueNbDots() ? true : false;
      this.displayLink(val);
    })
  }

  private cookieService = inject(CookieService);

  readonly linkLabel = DELETE_SCHEMA_LABEL;
  protected display = false;

  protected deleteRecordSchema(): void {
    this.cookieService.deleteCookie();
    // goBackToStartStep();
    this.displayLink(false);
  }

  displayLink(val: boolean): void {
      this.display = val;
  }
}
