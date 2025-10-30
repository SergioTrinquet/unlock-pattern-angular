import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectControlService {
  private _selectElement?: HTMLSelectElement;

  register(select: HTMLSelectElement) {
    this._selectElement = select;
  }

  resetSelectToDefault() {
    if (!this._selectElement) return;
    this._selectElement.options[0].selected = true;
    this._selectElement.dispatchEvent(new Event('change'));
  }
}
