import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStore { // A GARDER ???
  captureDots = signal<number[]>([]);
}
