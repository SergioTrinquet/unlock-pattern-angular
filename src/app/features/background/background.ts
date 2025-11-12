import { Component, OnInit } from '@angular/core';
import { SQUARE_COLUMNS_CLASSES, NB_SQUARES_PER_COLUMN, STRIKE_PATTERNS, DOT_RADIUS, GRID } from './constants/background.constants';
import { NbStrikePatterns } from './types/background.type';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [],
  templateUrl: './background.html',
  styleUrl: './background.scss'
})
export class BackgroundComponent implements OnInit {
  private nbSquaresColumn = NB_SQUARES_PER_COLUMN;
  protected squareColumns = SQUARE_COLUMNS_CLASSES;
  protected svgMaxNbImgs = Math.floor(this.nbSquaresColumn / 2);  

  protected gridSide = GRID.side;
  private gridMargin = GRID.margin;
  protected dotRadius = DOT_RADIUS;
  protected viewBox = `0 0 ${this.gridSide} ${this.gridSide}`

  protected dotsCoord: Array<number[]> = [];
  private strikePatterns: string[] = [];

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
    /* let sp = STRIKE_PATTERNS;
    if(STRIKE_PATTERNS.length < this.nbSquaresColumn) {
      const nbTimes = Math.floor(this.nbSquaresColumn / STRIKE_PATTERNS.length);
      const copyStrikePatterns = [...STRIKE_PATTERNS]
      for(let i = 0; i < nbTimes; i++) sp.push(...copyStrikePatterns)
    }
    if(sp.length !== this.nbSquaresColumn) sp = sp.slice(0, this.nbSquaresColumn);
    // console.log("sp", sp) */

    ////////
    const sp:NbStrikePatterns = STRIKE_PATTERNS;
    ////////

    sp.map(strike => {
      let strikePath = "";
      strike.map((dot, i) => {
        strikePath += `${i !== 0 ? " " : ""}${i === 0 ? "M" : "L"}${this.dotsCoord[dot][0]} ${this.dotsCoord[dot][1]}`;
      })
      this.strikePatterns.push(strikePath)
    })
  }

  protected get nbSquares(): number[] {
    return Array.from({ length: this.nbSquaresColumn }, ((_, i) => i))
  }

  protected getPatternFor(idxSvg: number, idxColumn: number): string {
    // console.log("AVANT:", idxSvg, "id column:", idxColumn)
    // Même logique que ton code JS : alterner entre les 2 moitiés
    if (idxColumn % 2) idxSvg += this.svgMaxNbImgs;
    // console.log("APRES:", idxSvg, "id column:", idxColumn)
    return this.strikePatterns[idxSvg];
  }
}
