import { computed, inject, Injectable, Injector } from '@angular/core';
import { COOKIE_NAME_PREFIX } from '../../../app.constants';
import { SelectStateService } from '../../../features/select/services/select-state/select-state.service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private injector = inject(Injector);
  private get selectState(): SelectStateService {
    return this.injector.get(SelectStateService);
  }

  // private selectState = inject(SelectStateService);

  readonly isCookiePresent = computed(() => {
    if(!document.cookie) {
        return !!document.cookie;
    } else {
        let data = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${COOKIE_NAME_PREFIX}${this.selectState.selectedValueNbDots()}=`))
            ?.split("=")[1];
        return !!data ? (JSON.parse(data).gridSize == this.selectState.selectedValueNbDots()) : !!data;
    }
  });

  readonly deleteCookie = computed(() => {
    document.cookie = `${COOKIE_NAME_PREFIX}${this.selectState.selectedValueNbDots()}=;max-age=0; path=/`;
  });

  setCookie(gridSize: number, combination: number[]): void {  
    const data = { gridSize, combination };
    const durationCookieInSec = 60*60*24*30;
    const cookie = `${COOKIE_NAME_PREFIX}${gridSize}=${JSON.stringify(data)}; max-age=${durationCookieInSec}; path=/`; // Voir aussi avec les parametres 'sameSite', 'lax', 'strict', 'secure',...
    document.cookie = cookie;
  }

  /* getCookieValue(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  } */
 getCookieValue(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? "";
    return "";
  }
}
