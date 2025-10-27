import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SchemaNbDotsConfig } from './types/select.type';
import { DOTS_SCHEMA_CONFIGS, DEFAULT_SELECT_VALUE, SELECT_OPTIONS } from './constants/select.constants';
import { SelectStateService } from './services/select-state.service';

@Component({
  selector: 'app-select',
  imports: [],
  standalone: true,
  templateUrl: './select.html',
  styleUrl: './select.scss'
})
export class SelectComponent {
  private selectStateService = inject(SelectStateService);
  
  readonly defaultSelectValue: string = DEFAULT_SELECT_VALUE;
  readonly dotsSchemaConfig : SchemaNbDotsConfig[] = DOTS_SCHEMA_CONFIGS;
  readonly selectOptions: string[] = this.dotsSchemaConfig.map(config => SELECT_OPTIONS(config));
  
  @Output() valueChange = new EventEmitter<number | null>();
  
  onChangeSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue: number | null = parseInt(selectElement.value) || null;
    this.valueChange.emit(selectedValue);

    this.selectStateService.setSelectedValueNbDots(selectedValue);

    if(this.selectStateService.isSelectedValueNbDots()) {
        this.selectStateService.setRecordedSchema(); // Affectation var présence cookie
    } else {
        //removeComplementaryInfos();
    }
  }

}
