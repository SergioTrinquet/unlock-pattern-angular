import { AfterViewInit, Component, ElementRef, inject, input, OnInit } from '@angular/core';
import { SequenceSchemaValidService } from '../grid/services';
import JSConfetti from 'js-confetti';

@Component({
  selector: 'app-msg-success',
  standalone: true,
  imports: [],
  templateUrl: './msg-success.html',
  styleUrl: './msg-success.scss'
})
export class MsgSuccessComponent implements OnInit, AfterViewInit {
  private sequenceSchemaValidService = inject(SequenceSchemaValidService);
  private jsConfetti!: JSConfetti;
  readonly screenSuccessToAnimUp = input<boolean>(false);

  constructor(private el: ElementRef) {}

  protected onClickScreenMsgSuccess(): void {
    this.sequenceSchemaValidService.screenDisappearance();
  }

  ngOnInit() {
    // On attache JSConfetti sur le composant, pas sur tout le document
    this.jsConfetti = new JSConfetti({ canvas: this.getLocalCanvas() });
  }

  private getLocalCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.zIndex = '3';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // pour laisser cliquer au travers

    this.el.nativeElement.appendChild(canvas);

    return canvas;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.launchConfetti(), 1000)
  }

  private launchConfetti(): void {
    this.jsConfetti.addConfetti({
      confettiColors: [
        '#ff0a54', '#ffdd47ff', '#0198b3ff', '#2ac204ff', '#e602e6ff', '#ff8a04ff',
      ], 
      confettiNumber: 200,
    });
  }

}
