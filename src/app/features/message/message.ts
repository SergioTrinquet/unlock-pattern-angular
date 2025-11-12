import { Component, effect, inject } from '@angular/core';
import { MSG_LABELS } from './constants/message.constants';
import { CommonModule } from '@angular/common';
import { ValidationSchema } from '../validation-schema/validation-schema';
import { SelectStateService } from '../select/services/select-state/select-state.service';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, ValidationSchema],
  templateUrl: './message.html',
  styleUrl: './message.scss'
})
export class MessageComponent {
  private messageService = inject(MessageService)
  private selectStateService = inject( SelectStateService);

  private selectedValueNbDots = this.selectStateService.selectedValueNbDots;
  protected text = this.messageService.text;
  protected customClass = this.messageService.customClass;
  protected animUp = this.messageService.animUp;
  protected showButtons = this.messageService.showButtons;

  constructor() {
    effect(() => {              
      if(this.selectedValueNbDots()) {
        this.messageService.setComplementaryInfos();
      } else {
        this.messageService.removeComplementaryInfos();
      }
    })
  }
}
