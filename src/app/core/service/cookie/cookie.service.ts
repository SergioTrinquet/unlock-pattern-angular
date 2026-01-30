import { Injectable } from '@angular/core';
import { COOKIE_NAME_PREFIX } from '../../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  public hasCookieFor(gridSize: number | null): boolean {
    if(!gridSize || !document.cookie) return false;

    const cookieName = `${COOKIE_NAME_PREFIX}${gridSize}`;
    const cookieEntry = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${cookieName}=`));

    if(!cookieEntry) return false;

    try {
      const jsonValue = cookieEntry.split("=")[1];
      const data = JSON.parse(jsonValue);
      return data.gridSize === gridSize;
    } catch (error) {
      console.error("Erreur lors du parsing de la valeur du cookie", error);
      return false;
    }
  }

  public deleteCookie(gridSize: number | null): void {
    const cookieName = `${COOKIE_NAME_PREFIX}${gridSize}`;
    document.cookie = `${cookieName}=;max-age=0; path=/`;
  }

  public setCookie(gridSize: number, combination: number[]): void {  
    const data = { gridSize, combination };
    const durationCookieInSec = 60*60*24*30;
    const cookie = `${COOKIE_NAME_PREFIX}${gridSize}=${JSON.stringify(data)}; max-age=${durationCookieInSec}; path=/`; // Voir aussi avec les parametres 'sameSite', 'lax', 'strict', 'secure',...
    document.cookie = cookie;
  }

  public getCookieValue(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? "";
    return "";
  }
}
