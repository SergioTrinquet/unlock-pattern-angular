import { Directive, ElementRef } from '@angular/core';
import { STROKE } from '../../../app.constants';
import { SCHEMA_ELEMENTS_COLOR_CLASS } from '../constants/grid.constants';

@Directive({
  selector: '[svgAnimation]',
  standalone: true
})
export class SvgAnimationDirective {
  private svgDoc: Document | null = null;
  private svgCheck: Record<string, SVGElement | null> = {
    circle: null,
    smallLine: null,
    bigLine: null,
  };
  private initialDashOffsets: Record<string, string | null | undefined> = {
    circle: null,
    smallLine: null,
    bigLine: null,
  };

        // 03/06/26 : Store the initial data URL of the SVG object
        private svgDataUrl: string | null = null;

  constructor(private el: ElementRef<HTMLObjectElement>) { }

   public init(): void {
    this.svgDoc = this.el.nativeElement.contentDocument;
    if(!this.svgDoc) return;

        // 03/06/26 :Capture the data URL only once when init is called for the first time    
         if (!this.svgDataUrl) {
           this.svgDataUrl = this.el.nativeElement.data;
         }

    this.svgCheck['circle'] = this.svgDoc.querySelector('#circleCheckIcon');
    this.svgCheck['smallLine'] = this.svgDoc.querySelector('#smallLineCheckIcon');
    this.svgCheck['bigLine'] = this.svgDoc.querySelector('#bigLineCheckIcon');

    this.initialDashOffsets['circle'] = this.svgCheck['circle']?.getAttribute('stroke-dashoffset');
    this.initialDashOffsets['smallLine'] = this.svgCheck['smallLine']?.getAttribute('stroke-dashoffset');
    this.initialDashOffsets['bigLine'] = this.svgCheck['bigLine']?.getAttribute('stroke-dashoffset');

    Object.values(this.svgCheck).forEach(el => {
      el?.setAttribute('stroke', STROKE.color[SCHEMA_ELEMENTS_COLOR_CLASS.valid]);
    });
  }

  public resetAnimations(): void {
    if (!this.svgDoc) return;

    // Fix bug webkit : On reset stroke-dashoffset explicitement pour chacun des éléments SVG
    (this.svgCheck['circle'] as SVGGeometryElement)?.setAttribute('stroke-dashoffset', this.initialDashOffsets['circle'] || '');
    (this.svgCheck['smallLine'] as SVGGeometryElement)?.setAttribute('stroke-dashoffset', this.initialDashOffsets['smallLine'] || '');
    (this.svgCheck['bigLine'] as SVGGeometryElement)?.setAttribute('stroke-dashoffset', this.initialDashOffsets['bigLine'] || '');

    const animTags = [
      { el: this.svgCheck['circle'], anim: this.svgDoc.getElementById('animCircleCheckIcon') },
      { el: this.svgCheck['smallLine'], anim: this.svgDoc.getElementById('animSmallLineCheckIcon') },
      { el: this.svgCheck['bigLine'], anim: this.svgDoc.querySelector('#bigLineCheckIcon > animate') },
    ];

    animTags.forEach(tag => {
      if (tag.anim && typeof (tag.anim as any).beginElement === 'function') {
        const clone = tag.anim.cloneNode(false);
        tag.el?.replaceChild(clone, tag.anim);
      }
    });
  }

  public startAnimation(): void {
    this.svgDoc?.querySelector<SVGAnimationElement>('#animCircleCheckIcon')?.beginElement();
  }




////////// 03/06/26 ////////////
  // New method to reload the SVG and ensure initialization is complete.
  // Retourne une Promesse qui est "resolve" qd le SVG est reloadé et initialisé.
  public reloadAndInitSvg(): Promise<void> {
    return new Promise((resolve) => {
        if (this.svgDataUrl) {
          // Temporarily remove and then restore the data attribute to force reload
          this.el.nativeElement.data = '';
          queueMicrotask(() => { // Use queueMicrotask to ensure DOM update
            if (this.svgDataUrl) {
              this.el.nativeElement.data = this.svgDataUrl;
              // Wait for the 'load' event of the object element to ensure SVG content is read
              this.el.nativeElement.onload = () => {
                this.init(); // Re-initialize the directive after the SVG loads
                resolve();
              };
              // Fallback for cases where onload might not fire immediately, though less reliable
              setTimeout(() => {
                  if(!this.svgDoc) { // If init() wasn't called by onload
                      this.init();
                      resolve();
                  }
              }, 100); // Increased timeout to 100ms for robustness
            } else {
              resolve(); // No data URL, resolve immediately
            }
          });
      } else {
        this.init(); // First time, just init
        resolve();
      }
    });
  }
/////////// Fin 03/06/26 ///////////



}