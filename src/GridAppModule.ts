import ElementData from './ElementData';
import GridApp from './GridApp';
import { GridAppModuleConfiguration, GridAppModuleHTMLElement } from './types';

export default abstract class GridAppModule {
  private _app: GridApp;
  private _element: GridAppModuleHTMLElement;
  private _data: ElementData;

  constructor(app: GridApp, config: GridAppModuleConfiguration) {
    this._app = app;

    this._element = document.createElement('div') as GridAppModuleHTMLElement;
    this._element.gridAppInstance = this;

    this._data = new ElementData(this._element);

    this.element.classList.add('app-module');

    this.element.dataset['label'] = config.label;
  }

  get app(): GridApp {
    return this._app;
  }

  get element(): GridAppModuleHTMLElement {
    return this._element;
  }

  get data(): ElementData {
    return this._data;
  }

  get label(): string {
    const label = this._data.get('label');
    if (!label) {
      throw new Error('Module label is not set.');
    }

    return label;
  }

  abstract onMouseDown(e: MouseEvent): void;

  abstract onMouseMove(e: MouseEvent): void;

  abstract onMouseUp(e: MouseEvent): void;

  abstract onClick(e: MouseEvent): void;

  abstract onWheelMove(e: WheelEvent): void;

  abstract onKeyDown(e: KeyboardEvent): void;

  abstract onKeyUp(e: KeyboardEvent): void;

  abstract onContextMenu(e: KeyboardEvent): void;

  abstract import(data: object): void;

  abstract export(): object;
}
