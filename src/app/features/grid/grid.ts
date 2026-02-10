import { Component, computed, effect, ElementRef, inject, Input, OnDestroy, QueryList, Signal, SimpleChanges, untracked, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectStateService } from '../select/services/select-state/select-state.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { Stroke, StrokeColor, StrokeColorationSequence } from './types/grid.type';
import { TouchScreenService } from '../../shared/services/touch-screen/touch-screen.service';
import { MessageService } from '../message/services/message.service';
import { AnimationBackgroundGridService, DrawingService, GridStateService, ResizeObserverService, SchemaValidityService, SequenceSchemaValidService } from './services';
import { AbortStrokesAnimationService } from '../../shared/services/abort-strokes-animation/abort-strokes-animation.service';
import { ResetSchemaService } from '../validation-schema/services/reset-schema/reset-schema.service';
import { SCHEMA_ELEMENTS_COLOR_CLASS, STROKES_COLORATION_SEQUENCE } from './constants/grid.constants';
import { STROKE } from '../../app.constants';
import { concatMap, delay, finalize, from, Observable, of, takeUntil } from 'rxjs';
import { SvgAnimationDirective } from './directives/svg-animation.directive';
import { MsgSuccessComponent } from '../msg-success/msg-success';
import vars from '../../../styles/variables.json';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, SvgAnimationDirective, MsgSuccessComponent],
  templateUrl: './grid.html',
  styleUrl: './grid.scss'
})
export class GridComponent implements OnDestroy {
  private utils = inject(UtilsService);
  private animationBackgroundGridService = inject(AnimationBackgroundGridService);
  private gridState = inject(GridStateService);
  private selectState = inject(SelectStateService);
  private touchScreenService = inject(TouchScreenService);
  private resizeObserverService = inject(ResizeObserverService);
  private schemaValidityService = inject(SchemaValidityService);
  private drawing = inject(DrawingService);
  private messageService = inject(MessageService);
  private resetSchemaService = inject(ResetSchemaService);
  private sequenceSchemaValidService = inject(SequenceSchemaValidService);
  protected abortStrokesAnimationService = inject(AbortStrokesAnimationService);

  private dotsCoord = this.resizeObserverService.dotsCoord;
  private capturedDotsLength = this.gridState.capturedDotsLength;
  protected canvas = this.resizeObserverService.canvas;
  protected capturedDots = this.gridState.capturedDots;
  protected isTouchScreen = this.touchScreenService.isTouchDevice;
  protected releasePointerCaptureOnTouchScreen = this.touchScreenService.releasePointerCaptureOnTouchScreen;
  protected gridAnimationClass = this.animationBackgroundGridService.animateGrid;
  protected containerAnimationVibrateClass = this.animationBackgroundGridService.animateContainerVibration;
  protected containerAnimationShrinkClass = this.animationBackgroundGridService.animateContainerShrink;
  protected flipOver = this.sequenceSchemaValidService.cardFlipOver;
  protected growAfterFlipOver = this.sequenceSchemaValidService.growCardAfterFlipOver;
  protected screenMsgSuccess = this.sequenceSchemaValidService.screenMsgSuccess;
  protected screenToAnimUp = this.sequenceSchemaValidService.screenToAnimUp;

  readonly nbDots: Signal<number[]> = computed(() => {
    const nb = this.selectState.selectedValueNbDots() ?? 0;
    return Array.from({ length: nb }, (_, i) => i + 1);
  });

  @ViewChild('container') containerRef!: ElementRef;
  @ViewChild('canvasTag') canvasRef!: ElementRef;
  @ViewChildren('dot') dotsRef!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild(SvgAnimationDirective) svgAnimationDirective!: SvgAnimationDirective;

  @Input() selectedValue!: number | null;

  private root: HTMLElement = document.documentElement;
  private coordStrokes: Stroke[] = [];
  private ctx:CanvasRenderingContext2D | null = null;
  private strokeCurrentColor = STROKE.color[SCHEMA_ELEMENTS_COLOR_CLASS.default];
  protected isPointerMoveActive = false;
  protected noEventsAvailableOnGrid = true;
  protected dotColorClass: StrokeColor | "" = "";
  private flagCallResizeObservation = false;
  private resizeTimeout: ReturnType<typeof setTimeout> = 0;

  constructor() {
    // Pour stopper tracé du schéma si besoin qd nb de points survolés max.
    effect(() => {
      if(!this.selectState.recordedSchema()) {
        if(this.capturedDotsLength() === this.selectState.currentSchemaNbDotsMinMax()?.nbDotMax) this.stopDrawingSchema();
      } else {
        if(this.capturedDotsLength() === this.selectState.selectedValueNbDots()) this.stopDrawingSchema();
      }
    })

    // Qd redimensionnement de la fenêtre, redraw tracé du schéma
    effect(() => {
      if (this.canvas().height > 0) {
        // Custom debounce
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.redrawSchemaAfterResize();
        }, 200);
      }
    });

    // Qd click sur bouton 'Refaire un schéma'
    effect(() => {
      if(this.resetSchemaService.resetRequested() !== null) {
        if(this.resetSchemaService.resetRequested()) {
          this.colorationSchema("error")
        } else {
          this.resetSchema();
          queueMicrotask(() => this.resetSchemaService.triggerResetSchema(null));
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext("2d");
    this.sequenceSchemaValidService.registerSvgDirective(this.svgAnimationDirective);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedValue']) {
      const prev = changes['selectedValue'].previousValue;
      const curr = changes['selectedValue'].currentValue;
      if(curr !== prev && !!prev) { // Qd ni 1er chargement de page, ni qd précédente value correspond à value select par defaut et que value selected est différente de la précédente value
        this.resetGrid();   
      }
      if(curr) {
        this.initGrid();
      }
    }
  }

  protected handleDotHover(idDot: number): void {
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
      this.gridState.setCapturedDots([...this.capturedDots(), idDot]);
    }
  }

  protected isDrawingSchema(e: MouseEvent | PointerEvent): void {
    const cursorPositionInCanvas = this.drawing.getCursorPositionOnCanvas(e);
    // Ajout cordonnées du curseur sur fin dernier segment du schema
    this.coordStrokes[this.coordStrokes.length - 1].end = { x: cursorPositionInCanvas.x, y: cursorPositionInCanvas.y };
    if(this.ctx) {
      this.drawing.refreshCanvas(this.ctx);
      this.drawing.draw(this.ctx, this.coordStrokes, this.strokeCurrentColor);
    }
  }

  protected stopDrawingSchema(e?: MouseEvent | PointerEvent) {
    if(this.capturedDotsLength()) {
      this.isPointerMoveActive = false;   

      this.coordStrokes.pop();
      if(this.ctx) {
        this.drawing.refreshCanvas(this.ctx);
        this.drawing.draw(this.ctx, this.coordStrokes, this.strokeCurrentColor);
      }
      
      this.messageService.setComplementaryInfos(e?.type); // Update infos à afficher
      this.noEventsAvailableOnGrid = true; // Désactivation du click sur container qui arrete le dessin pendant l'anim du tracé + event sur survol de points pour créer le tracé

      const isSchemaValid = this.schemaValidityService.checkSchemaValidity();
      this.flashSchema(isSchemaValid)
        .subscribe({
          complete: () => {
            console.log('🎬 Animation "flashSchema" complète');
            // Tracé disparait sauf quand schema pas encore enregistré et valide
            if(!(!this.selectState.recordedSchema() && isSchemaValid)) {
              this.resetSchema();
            }
            if(this.selectState.recordedSchema() && isSchemaValid) { 
              this.sequenceSchemaValidService.runSequenceSchemaValid();
            } 
          }
        })

    }
  }

  private resetSchema(): void {
    if(this.ctx) this.drawing.refreshCanvas(this.ctx); // Retrait du tracé
    this.coordStrokes = []; // Réinitialisation coord.
    this.gridState.setCapturedDots([]); // Réinitialisation data points survolés
    
    this.dotColorClass = ""; // Réinitialisation classe CSS de couleur des points
    this.strokeCurrentColor = STROKE.color[SCHEMA_ELEMENTS_COLOR_CLASS.default]; // Trait schéma avec couleur par défaut

    if(this.isPointerMoveActive) this.isPointerMoveActive = false; // Cas de figure ou dessin en cours et changemt du select ou redimensionnement taille fenetre
    this.noEventsAvailableOnGrid = false; // Réactivation events sur container pour dessiner
    
    this.abortStrokesAnimationService.stopSequence();
  }
  
  private flashSchema(isSchemaValid: boolean): Observable<null> {   
    const sequence: StrokeColorationSequence[] = STROKES_COLORATION_SEQUENCE.map(p => ({
      ...p, // copie les propriétés
      color: (p.color === "custom" ? (isSchemaValid ? SCHEMA_ELEMENTS_COLOR_CLASS.valid : SCHEMA_ELEMENTS_COLOR_CLASS.error) : p.color) // écrase la valeur
    }));

    const sequence$ = from(sequence).pipe(
      concatMap((step) => {
        this.colorationSchema(step.color);
        return of(null).pipe(delay(step.duration));
      }),
      takeUntil(this.abortStrokesAnimationService.getAbort()), // ✅ annule si abort$ émet avant la fin
      // finalize(() => console.log("Animation complète !!"))
    )

    return sequence$;
  }

  private colorationSchema(colorClass: StrokeColor): void {
    this.dotColorClass = colorClass;
    this.strokeCurrentColor = STROKE.color[colorClass];
    if(this.ctx) this.drawing.draw(this.ctx, this.coordStrokes, this.strokeCurrentColor);
  }

  private redrawSchemaAfterResize(): void {  
    this.coordStrokes = [];
    const untrackedCapturedDots = untracked(this.capturedDots);
    if(untrackedCapturedDots.length === 0) return;
    for(let i = 0; i < untrackedCapturedDots.length; i++) {
      if(i > 0) {
        const previousDot = untrackedCapturedDots[i - 1];    
        const currentDot = untrackedCapturedDots[i];
        const segment: Stroke = {
          start: { x: untracked(this.dotsCoord)[previousDot].left, y: untracked(this.dotsCoord)[previousDot].top },
          end: { x: untracked(this.dotsCoord)[currentDot].left, y: untracked(this.dotsCoord)[currentDot].top }
        }  
        this.coordStrokes.push(segment);
      }
    }    
    if(this.ctx) {
      // Si tracé du schéma est en cours au moment du redimensionnement de la fenetre: On supprime le schéma
      if(this.isPointerMoveActive) {
        this.resetSchema();
        return;
      }
      this.drawing.refreshCanvas(this.ctx);
      this.drawing.draw(this.ctx, this.coordStrokes, this.strokeCurrentColor);
    }
  }

  private initGrid(): void {
    this.utils.setCustomProperties({'--nb-points-par-lgn-col': Math.sqrt(this.selectState.selectedValueNbDots()!)}); // Affectation var CSS pour positionnement grille de points
    
    this.noEventsAvailableOnGrid = true;
    setTimeout(() => {
      this.resizeObserverService.setDotsElements(this.dotsRef.map(p => p.nativeElement));
      this.noEventsAvailableOnGrid = false;
      if(!this.flagCallResizeObservation) {
        setTimeout(() => this.resizeObserverService.resizeObservation(this.containerRef.nativeElement, this.root), 50); // setTimeout pour laisser le temps au DOM de se mettre à jour
        this.flagCallResizeObservation = true;
      }
      
      // if(s.isTouchScreen) s.container.addEventListener('pointerdown', releasePointerCaptureOnTouchScreen);
    }, vars.transitionTime);
  }

  private resetGrid(): void {
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
