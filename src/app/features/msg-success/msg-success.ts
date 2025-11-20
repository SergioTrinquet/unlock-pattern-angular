import { Component, Input, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-msg-success',
  standalone: true,
  imports: [],
  templateUrl: './msg-success.html',
  styleUrl: './msg-success.scss'
})
export class MsgSuccessComponent {
  @Input() screenSuccessToClose!: WritableSignal<boolean>;
  onClickScreenMsgSuccess() {
    this.screenSuccessToClose.set(true);
  }
}
