import { Component, ElementRef, inject, input, OnInit } from '@angular/core';
import JSConfetti from 'js-confetti';
import { SequenceSchemaValidService } from '../grid/services';

@Component({
  selector: 'app-msg-success',
  standalone: true,
  imports: [],
  templateUrl: './msg-success.html',
  styleUrl: './msg-success.scss'
})
export class MsgSuccessComponent implements OnInit {
  private sequenceSchemaValidService = inject(SequenceSchemaValidService);
  readonly screenSuccessToAnimUp = input<boolean>(false);

  onClickScreenMsgSuccess() {
    this.sequenceSchemaValidService.screenDisappearance();
  }


  ////// TEST AJOUT CONFETTIS /////
  constructor(private el: ElementRef) {}
  private jsConfetti!: JSConfetti;
  ngOnInit() {
    // On attache JSConfetti sur le composant, pas sur tout le document
    this.jsConfetti = new JSConfetti({ canvas: this.getLocalCanvas() });
  }

  private getLocalCanvas(): HTMLCanvasElement {
    // On crée le canvas dans le DOM du composant
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.zIndex = '3';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // pour laisser cliquer au travers

    // On l'insère dans le composant
    this.el.nativeElement.appendChild(canvas);

    return canvas;
  }

  ngAfterViewInit(): void {
    this.launchConfetti();
  }

  protected launchConfetti(): void {
    this.jsConfetti.addConfetti({
      confettiColors: [
        '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7',
      ], 
      confettiNumber: 200,
    });
  }
  ////// TEST AJOUT CONFETTIS /////

}
