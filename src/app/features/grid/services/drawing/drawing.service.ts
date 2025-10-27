import { inject, Injectable } from '@angular/core';
import { CoordStrokeExtremity, Stroke } from '../../types/grid.type';
import { ResizeObserverService } from '../resize-observer/resize-observer.service';
import { STROKE } from '../../../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private canvas = inject(ResizeObserverService).canvas;

  // Peut-être à mettre dans un service à part
  getCursorPositionOnCanvas(e: MouseEvent | PointerEvent): CoordStrokeExtremity {
    const { clientX, clientY } = e;
    // Return position from the origin of canvas
    return { 
        x: clientX - (this.canvas().left || 0), 
        y: clientY - (this.canvas().top || 0)
    }
  }


  refreshCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.canvas().width, this.canvas().height);
  }

  draw(ctx: CanvasRenderingContext2D, coordStrokes: Stroke[], currentColor: string): void { /* 'currentColor' utile ? Parce que qd tracé, est tjs blanc! */
    // Boucle sur nb de traits
    for(const stroke of coordStrokes) {
      if(stroke.end.x && stroke.end.y) {
        ctx.beginPath();
        ctx.moveTo(stroke.start.x, stroke.start.y); 
        ctx.lineTo(stroke.end.x, stroke.end.y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = STROKE.width;
        ctx.stroke();
      } else {
        throw Error("Pas de coordonnées sur un des segments du tracé");
      }
    }
  }

}
