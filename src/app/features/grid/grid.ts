import { Component, computed, effect, ElementRef, inject, Input, OnDestroy, QueryList, signal, Signal, SimpleChanges, untracked, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectStateService } from '../select/services/select-state/select-state.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { Stroke, StrokeColor, StrokeColorationSequence } from './types/grid.type';
import { TouchScreenService } from '../../shared/services/touch-screen/touch-screen.service';
import { STROKE } from '../../app.constants';
import { MessageService } from '../message/services/message.service';
import { AnimationService, DrawingService, GridStateService, ResizeObserverService, SchemaValidityService } from './services';
import { SelectControlService } from '../select/services';
import { AbortAnimationService } from '../../shared/services/abort-animation/abort-animation.service';
import { ResetSchemaService } from '../validation-schema/services/reset-schema/reset-schema.service';
import { SCHEMA_ELEMENTS_COLOR_CLASS, STROKES_COLORATION_SEQUENCE, SEQUENCE_ANIMATION_DRAWING_SUCCESS } from './constants/grid.constants';
import { concat, concatMap, delay, finalize, from, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import vars from '../../../styles/variables.json';
import { SvgAnimationDirective } from './directives/svg-animation.directive';
import { MsgSuccessComponent } from '../msg-success/msg-success';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, SvgAnimationDirective, MsgSuccessComponent],
  templateUrl: './grid.html',
  styleUrl: './grid.scss'
    // , providers: [ResizeObserverService]
})
export class GridComponent implements OnDestroy {
  private utils = inject(UtilsService);
  private animationService = inject(AnimationService);
  private gridState = inject(GridStateService);
  private selectState = inject(SelectStateService);
  private touchScreenService = inject(TouchScreenService);
  private resizeObserverService = inject(ResizeObserverService);
  private schemaValidityService = inject(SchemaValidityService);
  private drawing = inject(DrawingService);
  private messageService = inject(MessageService);
  protected abortAnimationService = inject(AbortAnimationService);
  private resetSchemaService = inject(ResetSchemaService);
  private selectControlService = inject(SelectControlService);

  // private dotsCoord = this.gridState.dotsCoord;
  private dotsCoord = this.resizeObserverService.dotsCoord; // BONNE VERSION

  protected capturedDots = this.gridState.capturedDots;
  private capturedDotsLength = this.gridState.capturedDotsLength;
  protected canvas = this.resizeObserverService.canvas;
  protected isTouchScreen = this.touchScreenService.isTouchDevice;
  protected releasePointerCaptureOnTouchScreen = this.touchScreenService.releasePointerCaptureOnTouchScreen;
  protected gridAnimationClass = this.animationService.animateGrid;
  protected containerAnimationVibrateClass = this.animationService.animateContainerVibration;
  protected containerAnimationShrinkClass = this.animationService.animateContainerShrink;

  readonly nbDots: Signal<number[]> = computed(() => {
    const nb = this.selectState.selectedValueNbDots() ?? 0;
    return Array.from({ length: nb }, (_, i) => i + 1);
  });

  protected noEventsAvailableOnGrid = true;
  protected transitionTime = vars.transitionTime;

  private coordStrokes: Stroke[] = [];
  private ctx:CanvasRenderingContext2D | null = null;
  private strokeCurrentColor = STROKE.color[SCHEMA_ELEMENTS_COLOR_CLASS.default];
  protected isPointerMoveActive = false;
  protected dotColorClass: StrokeColor | "" = "";

  @ViewChild('container') containerRef!: ElementRef;
  @ViewChild('canvasTag') canvasRef!: ElementRef;
  @ViewChildren('dot') dotsRef!: QueryList<ElementRef<HTMLElement>>;

  @Input() selectedValue!: number | null;
  private flagCallResizeObservation = false;
  private resizeTimeout: ReturnType<typeof setTimeout> = 0;

  private abortFlashSchema$ = new Subject<void>(); // TEST: Voir si on ne peut-on pas utiliser 'abortAnimationService.stopSequence()' à la place !!

  constructor() {
    // Partie avant dans fonction 'HandleDotHover()'
    effect(() => { console.log("Effect() pour stopper le dessin du schéma");
      if(!this.selectState.recordedSchema()) {
        if(this.capturedDotsLength() === this.selectState.currentSchemaNbDotsMinMax()?.nbDotMax) this.stopDrawingSchema();
      } else {
        if(this.capturedDotsLength() === this.selectState.selectedValueNbDots()) this.stopDrawingSchema();
      }
    //  if(!untracked(this.selectState.recordedSchema)) {
    //     if(this.capturedDotsLength() === untracked(this.selectState.currentSchemaNbDotsMinMax)?.nbDotMax) this.stopDrawingSchema();
    //   } else {
    //     if(this.capturedDotsLength() === untracked(this.selectState.selectedValueNbDots)) this.stopDrawingSchema();
    //   }
    })


   effect(() => {
      if (this.canvas().height > 0) {
        // Custom debounce
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          // this.getDotsCoord(this.dotsRef); // Anicenne version qd dotsCoord dans GridStateService
          this.redrawStrokesAfterResize();
        }, 200);
      }
    });

    // Qd click sur bouton 'Refaire le schéma'
    effect(() => {   console.log("Effect() bouton 'Refaire le schéma'", this.resetSchemaService.resetRequested());
      if(this.resetSchemaService.resetRequested() !== null) {
        if(this.resetSchemaService.resetRequested()) {
          this.abortFlashSchema$.next(); //
          this.colorationSchema("error")
        } else {
          this.removeSchemaDrawing();
          queueMicrotask(() => this.resetSchemaService.triggerResetSchema(null));
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext("2d")
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedValue']) {
      const prev = changes['selectedValue'].previousValue;
      const curr = changes['selectedValue'].currentValue;
      if(curr !== prev && !!prev) { // Qd ni 1er chargement de page, ni qd précédente value correspond à value select par defaut et que value selected est différente de la précédente value
        // console.log("Appel resetGrid()"); 
        this.resetGrid();   
      }
      if(curr) {
        // console.log("Appel initGrid()"); 
        this.initGrid();
      }
    }
  }

  redrawStrokesAfterResize(): void {  
    this.coordStrokes = [];
    const untrackedCapturedDots = untracked(this.capturedDots);
    if(untrackedCapturedDots.length === 0) return;
    for(let i = 0; i < untrackedCapturedDots.length; i++) {
      if(i > 0) {
        const previousDot = untrackedCapturedDots[i - 1];    
        const currentDot = untrackedCapturedDots[i];
        const segment: Stroke = {
          // start: { x: this.dotsCoord()[previousDot].left, y: this.dotsCoord()[previousDot].top },
          // end: { x: this.dotsCoord()[currentDot].left, y: this.dotsCoord()[currentDot].top }

          start: { x: untracked(this.dotsCoord)[previousDot].left, y: untracked(this.dotsCoord)[previousDot].top },
          end: { x: untracked(this.dotsCoord)[currentDot].left, y: untracked(this.dotsCoord)[currentDot].top }
        }  
        this.coordStrokes.push(segment);
      }
    }    
    if(this.ctx) {
      // Gestion du cas ou redimentionnement fenetre sans click pour arrter le tracé : On checke si tracé valide ou pas
      //this.stopDrawingSchema();

      // this.drawing.refreshCanvas(this.ctx); // ?
      this.drawing.draw(this.ctx, this.coordStrokes, this.strokeCurrentColor);
    }
  }

  /* getDotsCoord(dots: QueryList<ElementRef>): void { 
    const dotsArray = dots.toArray().map(ref => ref.nativeElement);
    const DotDistanceCenter = dotsArray[0].getBoundingClientRect().width / 2;
    let dotsCoord: Dot[] = [];
    dotsArray.forEach((dot) => {
        const boundingDot = dot.getBoundingClientRect();
        dotsCoord.push({
            "top": boundingDot.top - (this.canvas().top ?? 0) + DotDistanceCenter,
            "left": boundingDot.left - (this.canvas().left ?? 0) + DotDistanceCenter
        });
    }) 
        
    this.gridState.setDotsCood(dotsCoord);
    console.log("%c---getCanvasSizeAndDotsCoord()----", "background-color: yellow; color: black", dotsCoord);
  } */

  
  handleDotHover(idDot: number): void {
    this.touchScreenService.vibrateOnTouch(70);

    if(!this.capturedDots().includes(idDot)) {
      // Gestion Data pour le tracé : Alimentation 'coordStrokes' avec des objets comportant point début et point fin
      const actualSegment: Stroke = {
          start: { x: this.dotsCoord()[idDot].left, y: this.dotsCoord()[idDot].top },
          end: { x: null, y: null }
      } 
      if(this.capturedDots().length > 0) { 
          this.coordStrokes.pop();
          const previousIdDot = this.capturedDots()[this.capturedDots().length - 1];     
          const previousSegment: Stroke = {
              start: { x: this.dotsCoord()[previousIdDot].left, y: this.dotsCoord()[previousIdDot].top },
              end: { x: this.dotsCoord()[idDot].left, y: this.dotsCoord()[idDot].top }
          }  
          this.coordStrokes = [...this.coordStrokes, previousSegment, actualSegment];
      } else {
          this.coordStrokes.push(actualSegment);
          this.isPointerMoveActive = true;
      }
      // console.log("%c>>> handleDotHover() : isPointerMoveActive", "background-color: blue; color: white", this.isPointerMoveActive);
      this.gridState.setCapturedDots([...this.capturedDots(), idDot]);


      ////////////////////
      /* if(!this.selectState.recordedSchema()) {
        if(this.capturedDotsLength() === this.selectState.currentSchemaNbDotsMinMax()?.nbDotMax) this.stopDrawingSchema();
      } else {
        if(this.capturedDotsLength() === this.selectState.selectedValueNbDots()) this.stopDrawingSchema();
      } */
      ////////////////////
    }
  }

  isDrawingSchema(e: MouseEvent | PointerEvent): void {
    const cursorPositionInCanvas = this.drawing.getCursorPositionOnCanvas(e);
    // Ajout cordonnées du curseur sur fin dernier segment du schema
    this.coordStrokes[this.coordStrokes.length - 1].end = { x: cursorPositionInCanvas.x, y: cursorPositionInCanvas.y };
    if(this.ctx) {
      this.drawing.refreshCanvas(this.ctx);
      this.drawing.draw(this.ctx, this.coordStrokes, this.strokeCurrentColor);
    }
  }

  stopDrawingSchema(e?: MouseEvent | PointerEvent) {
    if(this.capturedDotsLength()) {
      this.isPointerMoveActive = false;   console.log("%c>>> stopDrawingSchema() : isPointerMoveActive = false", "background-color: green; color: white");

      this.coordStrokes.pop();
      if(this.ctx) {
        this.drawing.refreshCanvas(this.ctx);
        this.drawing.draw(this.ctx, this.coordStrokes, this.strokeCurrentColor);
      }
      
      this.messageService.setComplementaryInfos(e?.type); // Update infos à afficher
      this.noEventsAvailableOnGrid = true; // Désactivation du click sur container qui arrete le dessin pendant l'anim du tracé + event sur survol de points pour créer le tracé

      const isSchemaValid = this.schemaValidityService.checkSchemaValidity();
      this.flashSchema(isSchemaValid)
      ///
      .pipe(takeUntil(this.abortFlashSchema$))
      ///
        .subscribe({
          complete: () => {
            console.log('🎬 Animation "flashSchema" complète');

            // Si phase de création de schéma + schéma tracé est valide, alors traits et coloration restent, sinon ils disparaissent
            if(!(!this.selectState.recordedSchema() && isSchemaValid)) { // Tous les cas de figure sauf schema pas enregistré et valide !!
              this.removeSchemaDrawing(); 
            }
            if(this.selectState.recordedSchema() && isSchemaValid) { 
            //     if (!animationSuccessModule) animationSuccessModule = await import("./animationSuccess.js");
            console.log("On va déclencher 'runSequenceSchemaValid()'")  
            this.runSequenceSchemaValid();
            } 
          }
        })

    }
  }



  ///////////// A METTRE DANS UN SERVICE !! //////////////
  @ViewChild(SvgAnimationDirective) svgAnimationDirective!: SvgAnimationDirective;
  protected flipOver = false;
  protected growAfterFlipOver = false;
  protected screenMsgSuccess = false;
  protected screenToClose = signal(false);
  runSequenceSchemaValid() {
    const { stepCardFlip, stepAnimSVG, stepDisplayMsgSuccess, stepDelayBeforeMsgSuccessClose } = SEQUENCE_ANIMATION_DRAWING_SUCCESS;
    of(null).pipe(
      tap(() => {
        this.svgAnimationDirective.init();
        this.flipOver = true;
        this.svgAnimationDirective.resetAnimations();
      }),
      delay(stepCardFlip),
      tap(() => this.svgAnimationDirective.startAnimation()),
      delay(stepAnimSVG),
      tap(() => {
        this.growAfterFlipOver = true;
        this.screenMsgSuccess = true;
      }),
      delay(stepDisplayMsgSuccess),
      tap(() => {
        this.selectControlService.resetSelectToDefault();
        this.flipOver = false;
        this.growAfterFlipOver = false;
      }),
      delay(stepDelayBeforeMsgSuccessClose),
      tap(() => {
        this.screenToClose.set(true); 
        setTimeout(() => {
          this.screenToClose.set(false);
          this.screenMsgSuccess = false;
        }, vars.timeScreenSuccessVanish);
      })
    ).subscribe();
  }
  ////////// FIN : A METTRE DANS UN SERVICE !! ///////////


  // PEUT ETRE VIRER UNE DES 2 FONCTIONS CI-DESSOUS CAR PAS UTILE
  removeSchemaDrawing() {  console.log("%c>>> removeSchemaDrawing()", "background-color: deeppink; color: white");
    this.resetSchema();
    this.noEventsAvailableOnGrid = false; // Réactivation events sur container pour dessiner
  }
  resetSchema() { console.log("%c>>> resetSchema()", "background-color: red; color: white");
    if(this.ctx) this.drawing.refreshCanvas(this.ctx); // Retrait du tracé
    this.coordStrokes = []; // Réinitialisation coord.
    this.gridState.setCapturedDots([]); // Réinitialisation data points survolés
    
    this.dotColorClass = "";
    this.strokeCurrentColor = STROKE.color[SCHEMA_ELEMENTS_COLOR_CLASS.default]; // Trait schéma avec couleur par défaut

    //this.isPointerMoveActive = false; console.log("%c>>> resetSchema() : isPointerMoveActive = false", "background-color: green; color: white");// Cas ou dessin en cours sans click de fin, puis changement dans le select, puis retour sur la grille : Permet de réinitialiser le isPointerMoveActive
    this.abortAnimationService.stopSequence();
  }


  
  flashSchema(isSchemaValid: boolean): Observable<null> {   // console.log("%cDans flashSchema()", "background-color: red; color: #fff;")
    const sequence: StrokeColorationSequence[] = STROKES_COLORATION_SEQUENCE.map(p => ({
      ...p, // copie les propriétés
      color: (p.color === "custom" ? (isSchemaValid ? SCHEMA_ELEMENTS_COLOR_CLASS.valid : SCHEMA_ELEMENTS_COLOR_CLASS.error) : p.color) // écrase la valeur
    }));

    const sequence$ = from(sequence).pipe(
      concatMap((step) => {
        this.colorationSchema(step.color);
        return of(null).pipe(delay(step.duration));
        // ou
        // return of(step).pipe(
        //   tap(()=> this.colorationSchema(step.color)),
        //   delay(step.duration))
      }),
      takeUntil(this.abortAnimationService.getAbort()), // ✅ annule si abort$ émet avant la fin
      // takeUntil(this.abortAnimationService.getAbort() || this.abortFlashSchema$), // ✅ annule si abort$ émet avant la fin
      finalize(() => console.log("Animation complète !!"))
    )

    return sequence$;
  }

  colorationSchema(colorClass: StrokeColor): void {
    this.dotColorClass = colorClass;
    this.strokeCurrentColor = STROKE.color[colorClass];
    if(this.ctx) this.drawing.draw(this.ctx, this.coordStrokes, this.strokeCurrentColor);
  }


  // Fonction TEST pour arreter observable qui colore les traits ou tt autre animation gérée en RxJs avec un 'abort$'
  stopSequenceAnimation(): void {
    this.abortAnimationService.stopSequence();
  }


  initGrid(): void {
    this.utils.setCustomProperties({'--nb-points-par-lgn-col': Math.sqrt(this.selectState.selectedValueNbDots()!)}); // Affectation var CSS pour positionnement grille de points
    
    this.noEventsAvailableOnGrid = true;
    setTimeout(() => {
      this.resizeObserverService.setDotsElements(this.dotsRef.map(p => p.nativeElement));
      this.noEventsAvailableOnGrid = false;
      if(!this.flagCallResizeObservation) {
        setTimeout(() => this.resizeObserverService.resizeObservation(this.containerRef.nativeElement), 50); // setTimeout pour laisser le temps au DOM de se mettre à jour
        this.flagCallResizeObservation = true;
      }
      
        // if(s.isTouchScreen) s.container.addEventListener('pointerdown', releasePointerCaptureOnTouchScreen);
    }, this.transitionTime);
  }

  resetGrid(): void {
    this.resetSchema();
    if(this.flagCallResizeObservation){ 
      this.resizeObserverService.disconnect(); 
      this.flagCallResizeObservation = false;
    }
  }

  ngOnDestroy(): void {
    this.resizeObserverService.disconnect();
  }

}
