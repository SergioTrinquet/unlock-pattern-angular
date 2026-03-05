import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  getComputedStyles(customProperty: string): number {
      const root = document.documentElement;
      const computedStyles = getComputedStyle(root);
      return parseInt(computedStyles.getPropertyValue(customProperty));
  }

  setCustomProperties(styles: styles): void {
    if (Object.prototype.toString.call(styles) === '[object Object]') {
      const root = document.documentElement;
      for (const [property, value] of Object.entries(styles)) {
          root.style.setProperty(property, String(value));
      }
    }
  }
}

type styles = { [key: string]: string | number; };
