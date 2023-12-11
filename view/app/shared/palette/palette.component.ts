import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
})
export class PaletteComponent {
  private _scaleSuffix = ['lightest', 'light', 'base', 'dark', 'darkest'];
  private _colors = [
    'primary',
    'secondary',
    'tertiary',
    'quaternary',
    'success',
    'error',
    'warning',
    'info',
    'gray',
  ];
  public colorsVarCss: { name: string; values: string[] }[] = [];

  // ANCHOR : Constructor
  constructor() {
    this._createColorsVarCss();
  }

  // ANCHOR : Methods


  /**
   * ? Create the colors var css
   *
   * @private
   */
  private _createColorsVarCss(): void {
    for (let color of this._colors) {
      let scales: string[] = [];
      for (let scale of this._scaleSuffix) {
        if (scale === 'base') scales.push(`${color}`);
        else scales.push(`${color}-${scale}`);
      }
      this.colorsVarCss.push({ name: color, values: scales });
    }
  }
}
