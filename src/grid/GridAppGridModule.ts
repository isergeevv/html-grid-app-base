import GridAppGrid from './GridAppGrid';
import {
  GridAppGridModuleHTMLElement,
  Vector,
  Position,
  GridAppGridModuleConfiguration,
  GridAppGridModuleData,
} from '../types';

export default abstract class GridAppGridModule {
  private _grid: GridAppGrid;

  private _element: GridAppGridModuleHTMLElement;

  constructor(grid: GridAppGrid, config: GridAppGridModuleConfiguration) {
    this._grid = grid;

    this._element = document.createElement('div') as GridAppGridModuleHTMLElement;
    this._element.gridAppInstance = this;

    this.element.classList.add('app-module');

    this.element.dataset['label'] = config.label;
  }

  get grid(): GridAppGrid {
    return this._grid;
  }

  get element(): GridAppGridModuleHTMLElement {
    return this._element;
  }

  get label(): string {
    const label = this._element.dataset['label'];
    if (!label) {
      throw new Error('Module label is not set.');
    }

    return label;
  }

  calculateMovePosition(viewPortMouseCoords: Vector, position: Position) {
    const zoom = this.grid.zoom;

    const delta: Vector = {
      x: (this.grid.app.lastMousePosition.x - viewPortMouseCoords.x) / zoom,
      y: (this.grid.app.lastMousePosition.y - viewPortMouseCoords.y) / zoom,
    };

    return {
      x: position.x - delta.x,
      y: position.y - delta.y,
    };
  }

  abstract onMouseDown(e: MouseEvent): void;

  abstract onMouseMove(e: MouseEvent): void;

  abstract onMouseUp(e: MouseEvent): void;

  abstract onClick(e: MouseEvent): void;

  abstract onWheelMove(e: WheelEvent): void;

  abstract onKeyDown(e: KeyboardEvent): void;

  abstract onKeyUp(e: KeyboardEvent): void;

  abstract import(data: GridAppGridModuleData): void;

  abstract export(): GridAppGridModuleData;
}
