import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { SchemaNbDotsConfig } from './types/select.type';
import { DOTS_SCHEMA_CONFIGS, DEFAULT_SELECT_VALUE, SELECT_OPTIONS } from './constants/select.constants';
import { SelectControlService, SelectStateService } from './services';

@Component({
  selector: 'app-select',
  imports: [],
  standalone: true,
  templateUrl: './select.html',
  styleUrl: './select.scss'
})
export class SelectComponent implements AfterViewInit {
  private selectStateService = inject(SelectStateService);
  private selectControlService = inject(SelectControlService);
  
  readonly defaultSelectValue: string = DEFAULT_SELECT_VALUE;
  readonly dotsSchemaConfig : SchemaNbDotsConfig[] = DOTS_SCHEMA_CONFIGS;
  readonly selectOptions: string[] = this.dotsSchemaConfig.map(config => SELECT_OPTIONS(config));
  
  @ViewChild('select') selectRef!: ElementRef<HTMLSelectElement>;

  @Output() valueChange = new EventEmitter<number | null>();

  ngAfterViewInit() {
    this.selectControlService.register(this.selectRef.nativeElement);
  }

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
