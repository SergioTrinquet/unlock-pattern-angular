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
  private svgDataUrl: string | null = null;

  constructor(private el: ElementRef<HTMLObjectElement>) { }

  public init(): void {
    this.svgDoc = this.el.nativeElement.contentDocument;
    if(!this.svgDoc) return;

    this.svgCheck['circle'] = this.svgDoc.querySelector('#circleCheckIcon');
    this.svgCheck['smallLine'] = this.svgDoc.querySelector('#smallLineCheckIcon');
    this.svgCheck['bigLine'] = this.svgDoc.querySelector('#bigLineCheckIcon');

    Object.values(this.svgCheck).forEach(el => {
      el?.setAttribute('stroke', STROKE.color[SCHEMA_ELEMENTS_COLOR_CLASS.valid]);
    });
  }

  public resetAnimations(): void {
    if (!this.svgDoc) return;

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

  // Fix bug sur webkit devices: Animation du SVG qui ne se fait que la 1ere fois, et pas ensuite => On s'assure que le reload du SVG se fait.
  // Retourne une Promesse qui est "resolved" qd le SVG est reloadé.
  public reloadSvg(): Promise<void> {
    return new Promise((resolve) => {
        if (this.svgDataUrl) {
          // On retire temporairement puis on restaure l'attribut data pour forcer le reload
          this.el.nativeElement.data = '';
          queueMicrotask(() => { // queueMicrotask pour s'assurer de l'update du DOM
            if (this.svgDataUrl) {
              this.el.nativeElement.data = this.svgDataUrl;
              // On attend l'événement 'load' de l'élément object pour s'assurer que le contenu SVG est bien pris en compte
              this.el.nativeElement.onload = () => {
                resolve();
              };
              // On ajoute un Falback qui est le timeout ci-dessous pour s'assurer que la promesse est résolue même si l'événement 'load' ne se déclenche pas comme prévu (ex: sur certains navigateurs ou conditions de cache)
              setTimeout(() => {
                  if(!this.svgDoc) { // Si resolve() n'a pas été appelé par onload
                      resolve();
                  }
              }, 100); // On met le timeout à 100ms pour robusté
            } else {
              resolve(); // Si pas de data URL, resolve immédiatement
            }
          });
      } else {
        this.svgDataUrl = this.el.nativeElement.data; // 1er appel : on stocke la data URL du SVG
        resolve();
      }
    });
  }

}