import { ElementRef } from '@angular/core';
import { SvgAnimationDirective } from './svg-animation.directive';

describe('SvgAnimationDirective', () => {
  it('should create an instance', () => {
    const el = { nativeElement: document.createElement('object') } as ElementRef<HTMLObjectElement>;
    const directive = new SvgAnimationDirective(el);
    expect(directive).toBeTruthy();
  });
});
