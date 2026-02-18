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

    // TEST pour fix webkit : Animat° sur SVG ne fonctionne qu'une fois, après SVG pas visible
    // Explicitly reset stroke-dashoffset for the SVG elements
    (this.svgCheck['circle'] as SVGGeometryElement)?.setAttribute('stroke-dashoffset', '251.33');
    (this.svgCheck['smallLine'] as SVGGeometryElement)?.setAttribute('stroke-dashoffset', '23.45');
    (this.svgCheck['bigLine'] as SVGGeometryElement)?.setAttribute('stroke-dashoffset', '38.35');
    // FIN TEST pour fix webkit

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
}
