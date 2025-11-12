import { Component, inject, OnInit } from '@angular/core';
import { SQUARE_COLUMNS_CLASSES, NB_SQUARES_PER_COLUMN, STRIKE_PATTERNS, DOT_RADIUS, GRID } from './constants/background.constants';
import { StrikePatterns } from './types/background.type';
import { SelectStateService } from '../select/services';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [],
  templateUrl: './background.html',
  styleUrl: './background.scss'
})
export class BackgroundComponent implements OnInit {
  protected isValueInListboxSelected = inject(SelectStateService).isSelectedValueNbDots;
  private nbSquaresColumn = NB_SQUARES_PER_COLUMN;
  protected squareColumns = SQUARE_COLUMNS_CLASSES;
  protected svgMaxNbImgs = Math.floor(this.nbSquaresColumn / 2);  
  private gridMargin = GRID.margin;
  protected gridSide = GRID.side;
  protected dotRadius = DOT_RADIUS;
  protected viewBox = `0 0 ${this.gridSide} ${this.gridSide}`
  protected dotsCoord: Array<number[]> = [];
  private strikePaths: string[] = [];

  ngOnInit(): void {
    this.setDotsCoord();
    this.setStrikePatterns();
  }

  // Création coordonnées points
  private setDotsCoord(): void {
    const firstColumn = this.gridMargin;
    const centerColumn = this.gridSide / 2;
    const lastColumn = this.gridSide - this.gridMargin;

    [firstColumn, centerColumn, lastColumn].map(x => {
      return [firstColumn, centerColumn, lastColumn].map(y => {
        return this.dotsCoord.push([x, y])
      })
    })
  }

  // Création tracés
  private setStrikePatterns(): void {
    const strikes:StrikePatterns = STRIKE_PATTERNS;
    strikes.map(strike => {
      let strikePath = "";
      strike.map((dot, i) => {
        strikePath += `${i !== 0 ? " " : ""}${i === 0 ? "M" : "L"}${this.dotsCoord[dot][0]} ${this.dotsCoord[dot][1]}`;
      })
      this.strikePaths.push(strikePath)
    })
  }

  protected get nbSquares(): number[] {
    return Array.from({ length: this.nbSquaresColumn }, ((_, i) => i))
  }

  protected getPatternFor(idxSvg: number, idxColumn: number): string {
    // Alternance dans patterns 0-4 et 5-9
    if (idxColumn % 2) idxSvg += this.svgMaxNbImgs;
    return this.strikePaths[idxSvg];
  }
}
