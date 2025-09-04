import GridAppGrid from './GridAppGrid';
import {
  GridAppComponentContainerHTMLElement,
  GridAppElementData,
  GridAppGridElementConfiguration,
  GridAppGridElementHTMLElement,
  GridAppGridHTMLElement,
  Position,
  RGBColor,
  Size,
} from '../types';
import ElementData from '../ElementData';

export default abstract class GridAppGridElement {
  private _grid: GridAppGrid;
  private _element: GridAppGridElementHTMLElement;
  private _data: ElementData;

  constructor(grid: GridAppGrid, config: GridAppGridElementConfiguration) {
    this._grid = grid;

    this._element = document.createElement('div') as GridAppGridElementHTMLElement;
    this._element.gridAppInstance = this;

    this._data = new ElementData(this._element);

    this._data.set('type', config.type);
    this._data.set('label', config.label);

    this.setPosition({ x: 0, y: 0 });
    this.setMinSize({ w: 0, h: 0 });
    this.setSize({ w: 0, h: 0 });
    this.setBackgroundColor(config.defaultBackgroundColor);
    this.setTextColor(config.defaultTextColor);
  }

  get element(): GridAppGridElementHTMLElement {
    return this._element;
  }

  get parentElement(): GridAppGridHTMLElement | GridAppComponentContainerHTMLElement {
    const parentElement = this._element.parentElement as
      | GridAppGridHTMLElement
      | GridAppComponentContainerHTMLElement
      | null;
    if (!parentElement) {
      throw new Error('Element has no parent element.');
    }

    return parentElement;
  }

  get parent(): GridAppGrid | GridAppGridElement {
    if (this.parentElement.gridAppInstance instanceof GridAppGrid) {
      return this.parentElement.gridAppInstance;
    }

    return this.parentElement.gridAppInstance.component;
  }

  get data(): ElementData {
    return this._data;
  }

  get type(): string {
    const type = this._data.get('type');
    if (!type) {
      throw new Error('Element type is not set.');
    }

    return type;
  }

  get label(): string {
    const label = this._data.get('label');
    if (!label) {
      throw new Error('Element label is not set.');
    }

    return label;
  }

  get id(): number {
    const id = this._data.get('id');
    if (!id) {
      throw new Error('Element id is not set.');
    }

    return Number(id);
  }

  get grid(): GridAppGrid {
    return this._grid;
  }

  get position(): Position {
    return {
      x: Number(this._element.style.getPropertyValue('--gridapp-element-x')),
      y: Number(this._element.style.getPropertyValue('--gridapp-element-y')),
    };
  }

  get minSize(): Size {
    return {
      w: Number(this._element.style.getPropertyValue('--gridapp-element-min-w')),
      h: Number(this._element.style.getPropertyValue('--gridapp-element-min-h')),
    };
  }

  get size(): Size {
    return {
      w: Number(this._element.style.getPropertyValue('--gridapp-element-w')),
      h: Number(this._element.style.getPropertyValue('--gridapp-element-h')),
    };
  }

  get isMoving(): boolean {
    return this._data.has('moving');
  }

  get backgroundColor(): RGBColor {
    const bgColor = this._element.style.getPropertyValue('--gridapp-element-bg-color');
    return bgColor.split(',').map(Number) as RGBColor;
  }

  get textColor(): RGBColor {
    const textColor = this._element.style.getPropertyValue('--gridapp-element-text-color');
    return textColor.split(',').map(Number) as RGBColor;
  }

  toggleMoving(value: boolean): void {
    this._data.toggle('moving', value);
  }

  setMinSize(size: Size): void {
    this._element.style.setProperty('--gridapp-element-min-w', size.w.toString());
    this._element.style.setProperty('--gridapp-element-min-h', size.h.toString());
  }

  setSize(size: Size): void {
    this._element.style.setProperty('--gridapp-element-w', size.w.toString());
    this._element.style.setProperty('--gridapp-element-h', size.h.toString());
  }

  setId(value: number): void {
    this._data.set('id', value.toString());
  }

  setPosition(position: Position): void {
    this._element.style.setProperty('--gridapp-element-x', position.x.toString());
    this._element.style.setProperty('--gridapp-element-y', position.y.toString());
  }

  setBackgroundColor(color: RGBColor): void {
    this._element.style.setProperty('--gridapp-element-bg-color', color.join(', '));
  }

  setTextColor(color: RGBColor): void {
    this._element.style.setProperty('--gridapp-element-text-color', color.join(', '));
  }

  abstract onMouseDown(e: MouseEvent): void;

  abstract onMouseMove(e: MouseEvent): void;

  abstract onMouseUp(e: MouseEvent): void;

  abstract onClick(e: MouseEvent): void;

  abstract onWheelMove(e: WheelEvent): void;

  abstract onKeyDown(e: KeyboardEvent): void;

  abstract onKeyUp(e: KeyboardEvent): void;

  abstract import(data: GridAppElementData): void;

  abstract export(): GridAppElementData;
}
