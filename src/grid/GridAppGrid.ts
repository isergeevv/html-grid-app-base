import GridAppComponent from './elements/GridAppComponent';
import GridApp from '../GridApp';
import GridAppGridElement from './GridAppGridElement';
import GridAppGridModule from './GridAppGridModule';
import {
  GridAppGridConfiguration,
  GridAppGridData,
  GridAppGridHTMLElement,
  GridAppZoomConfiguration,
  Position,
  Vector,
  GridAppGridElementHTMLElement,
  GridAppGridElementAppConfiguration,
  GridAppGridModuleData,
  GridAppElementData,
} from '../types';
import ElementData from '../ElementData';

export default class GridAppGrid {
  private _app: GridApp;

  private _element: GridAppGridHTMLElement;

  private _gridElementConstructors: GridAppGridElementAppConfiguration[];
  private _zoomConfig: GridAppZoomConfiguration;

  private _initialOffset: Vector;

  private _focusedComponent: GridAppComponent | null;
  private _pointerInteractingElement: GridAppGridElementHTMLElement | null;
  private _currentElementId: number;

  private _modules: Map<string, GridAppGridModule>;

  private _data: ElementData;

  constructor(app: GridApp, config: GridAppGridConfiguration) {
    this._app = app;

    this._element = document.createElement('div') as GridAppGridHTMLElement;
    this._element.gridAppInstance = this;

    this._gridElementConstructors = config.elements;

    this._zoomConfig = config.zoom;

    const appRect = app.element.getBoundingClientRect();
    this._initialOffset = {
      x: appRect.width / 2,
      y: appRect.height / 2,
    };
    this._currentElementId = 1;

    this.element.classList.add('app-grid');

    this.element.style.setProperty('--gridapp-grid-size', config.size.toString());
    this.element.style.setProperty('--gridapp-offset-x', this._initialOffset.x.toString());
    this.element.style.setProperty('--gridapp-offset-y', this._initialOffset.y.toString());
    this.element.style.setProperty('--gridapp-zoom', config.zoom.default.toString());

    this._focusedComponent = null;
    this._pointerInteractingElement = null;

    this._modules = new Map();
    for (const [moduleName, module] of Object.entries(config.modules)) {
      const moduleObj = new module.constructor(this, module.config);

      this._modules.set(moduleName, moduleObj);
    }

    this._data = new ElementData(this._element);

    this.setActiveTool('grab');
  }

  get app(): GridApp {
    return this._app;
  }

  get element(): GridAppGridHTMLElement {
    return this._element;
  }

  get data(): ElementData {
    return this._data;
  }

  get gridElementConstructors(): GridAppGridElementAppConfiguration[] {
    return this._gridElementConstructors;
  }

  get initialOffset(): Vector {
    return this._initialOffset;
  }

  get pointerInteractingElement(): GridAppGridElementHTMLElement | null {
    return this._pointerInteractingElement;
  }

  get focusedComponent(): GridAppComponent | null {
    return this._focusedComponent;
  }

  get zoom(): number {
    return Number(this.element.style.getPropertyValue('--gridapp-zoom'));
  }

  get offset(): Vector {
    return {
      x: Number(this.element.style.getPropertyValue('--gridapp-offset-x')),
      y: Number(this.element.style.getPropertyValue('--gridapp-offset-y')),
    };
  }

  get isGridMoving(): boolean {
    return this.data.get('moving') === 'grid';
  }

  get gridElements(): GridAppGridElement[] {
    return Array.from(this.element.querySelectorAll('.app-element')).map(
      (el) => (el as GridAppGridElementHTMLElement).gridAppInstance,
    );
  }

  get activeTool(): string {
    let activeTool = this.data.get('active-tool');

    if (!activeTool) {
      activeTool = 'grab';
      this._data.set('active-tool', activeTool);
    }

    return activeTool;
  }

  append(...elements: GridAppGridElement[]): void {
    for (const element of elements) {
      this._element.append(element.element);
    }
  }

  setMoving(value: 'grid' | 'element'): void {
    this._data.set('moving', value);
  }
  stopMoving(): void {
    this._data.remove('moving');
  }

  getNextGridElementId(): number {
    return this._currentElementId++;
  }

  createElement<T extends GridAppGridElement>(type: string, label: string): T {
    const GridElementConstructor = this._gridElementConstructors.find(
      (c) => c.type === type && c.label === label,
    )?.constructor;
    if (!GridElementConstructor) {
      throw new Error(`No component type registered for type "${type}" and id "${label}".`);
    }

    const component = new GridElementConstructor(this);
    component.setId(this.getNextGridElementId());

    return component as T;
  }

  calculateMovePosition(viewPortMouseCoords: Position, position: Position) {
    const zoom = this.zoom;

    const delta: Vector = {
      x: (this.app.lastMousePosition.x - viewPortMouseCoords.x) / zoom,
      y: (this.app.lastMousePosition.y - viewPortMouseCoords.y) / zoom,
    };

    return {
      x: position.x - delta.x,
      y: position.y - delta.y,
    };
  }

  setZoom(zoom: number): void {
    this.element.style.setProperty('--gridapp-zoom', zoom.toString());
  }

  updateZoom(moveDelta: number): void {
    const zoom = moveDelta * this._zoomConfig.step;

    const currentZoom = this.zoom;
    const newZoom = Math.min(this._zoomConfig.max, Math.max(this._zoomConfig.min, currentZoom + zoom));

    this.setZoom(newZoom);
  }

  setOffset(offset: Vector): void {
    this.element.style.setProperty('--gridapp-offset-x', offset.x.toString());
    this.element.style.setProperty('--gridapp-offset-y', offset.y.toString());
  }

  updateOffset(move: Vector): void {
    const offset: Vector = this.offset;

    this.setOffset({
      x: offset.x - move.x,
      y: offset.y - move.y,
    });
  }

  setPointerInteractingElement(element: GridAppGridElementHTMLElement | null): void {
    this._pointerInteractingElement = element;
  }

  setFocusedComponent(component: GridAppComponent | null): void {
    if (this._focusedComponent) {
      this._focusedComponent.toggleFocused(false);
    }

    this._focusedComponent = component;
    if (this._focusedComponent) {
      this._focusedComponent.toggleFocused(true);

      let currentElement: HTMLElement = this._focusedComponent.element;
      while (currentElement.parentElement && currentElement.parentElement.closest('.app-grid')) {
        currentElement.parentElement.append(currentElement);

        currentElement = currentElement.parentElement;
      }
    }
  }

  setActiveTool(tool: string): void {
    this.data.set('active-tool', tool);
  }

  onMouseDown(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.app-grid')) return;

    // fix for mouse up outside window
    if (this._pointerInteractingElement) {
      this._pointerInteractingElement.gridAppInstance.toggleMoving(false);

      this._pointerInteractingElement = null;
    }

    for (const module of this._modules.values()) {
      module.onMouseDown(e);
    }

    if (this.activeTool === 'grab' && this.pointerInteractingElement === null) {
      this.setMoving('grid');
      this.setFocusedComponent(null);
    }
  }

  onMouseMove(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.app-grid')) return;
    if (!this.app.mouseDown) return;

    for (const module of this._modules.values()) {
      module.onMouseMove(e);
    }

    if (this.isGridMoving) {
      const zoom = this.zoom;

      this.updateOffset({
        x: (this.app.lastMousePosition.x - e.clientX) / zoom,
        y: (this.app.lastMousePosition.y - e.clientY) / zoom,
      });
    }
  }

  onMouseUp(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.app-grid')) return;
    if (!this.app.mouseDown) return;

    for (const module of this._modules.values()) {
      module.onMouseUp(e);
    }

    if (this.isGridMoving) {
      this.stopMoving();
    }

    this.setPointerInteractingElement(null);
  }

  onClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.app-grid')) return;

    for (const module of this._modules.values()) {
      module.onClick(e);
    }
  }

  onWheelMove(e: WheelEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.app-grid')) return;

    this.updateZoom(e.deltaY < 0 ? 1 : -1);
  }

  onKeyDown(_e: KeyboardEvent): void {}

  onKeyUp(_e: KeyboardEvent): void {}

  onContextMenu(_e: KeyboardEvent): void {}

  import(data: GridAppGridData): void {
    this._currentElementId = data.currentElementId;

    this.setZoom(data.zoom);
    this.setOffset(data.offset);

    for (const elementData of data.elements) {
      const component = this.createElement(elementData.type, elementData.label);
      component.import(elementData);
      this.element.append(component.element);
    }
  }

  export(): GridAppGridData {
    const currentElementId = this._currentElementId;
    const zoom = this.zoom;
    const offset = this.offset;

    const elementsData: GridAppElementData[] = this.gridElements.map((component) => component.export());

    const modulesData: Record<string, GridAppGridModuleData> = {};
    for (const [name, module] of this._modules.entries()) {
      modulesData[name] = module.export();
    }

    return {
      currentElementId: currentElementId,
      zoom: zoom,
      offset: offset,
      elements: elementsData,
      modules: modulesData,
    };
  }
}
