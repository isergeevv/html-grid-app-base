import type { GridAppConfiguration, GridAppData, Position } from './types';
import GridAppModule from './GridAppModule';
import { EventEmitter } from 'node:events';
import GridAppGrid from './grid/GridAppGrid';
import * as util from './util';

export default class GridApp {
  private _element: HTMLDivElement;

  private _events: Map<string, EventEmitter>;

  private _mouseDown: boolean;
  private _lastMousePosition: Position;

  private _clickEventElement: HTMLElement | null;
  private _clickEventPosition: Position;

  private _grid: GridAppGrid;
  private _modules: Map<string, GridAppModule>;

  constructor(appContainer: HTMLDivElement | string, config: GridAppConfiguration) {
    this._element = this._getAppContainerElement(appContainer);
    this._element.classList.add('app-container');

    this._events = new Map();

    this._mouseDown = false;
    this._lastMousePosition = { x: 0, y: 0 };

    this._clickEventElement = null;
    this._clickEventPosition = { x: 0, y: 0 };

    this._grid = new GridAppGrid(this, config.grid);
    this._element.append(this._grid.element);

    this._modules = new Map();
    for (const [moduleName, module] of Object.entries(config.modules)) {
      const moduleObj = new module.constructor(this, module.config);

      this._element.append(moduleObj.element);

      this._modules.set(moduleName, moduleObj);
    }

    this._registerWindowEventListeners();
  }

  get element(): HTMLDivElement {
    return this._element;
  }

  get mouseDown(): boolean {
    return this._mouseDown;
  }

  get lastMousePosition(): Position {
    return this._lastMousePosition;
  }

  get modules(): Map<string, GridAppModule> {
    return this._modules;
  }

  get events(): Map<string, EventEmitter> {
    return this._events;
  }

  get grid(): GridAppGrid {
    return this._grid;
  }

  private _getAppContainerElement(appContainer: HTMLDivElement | string): HTMLDivElement {
    if (typeof appContainer === 'string') {
      appContainer = document.querySelector(appContainer) as HTMLDivElement;

      if (!appContainer) {
        throw new Error(`Element with selector "${appContainer}" not found.`);
      }
    }

    return appContainer;
  }

  private _registerWindowEventListeners(): void {
    window.addEventListener('pointerdown', (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (!target.closest('.app-container')) return;

      e.preventDefault();

      this._grid.onMouseDown(e);

      for (const module of this._modules.values()) {
        module.onMouseDown(e);
      }

      this.setMouseDown();
      this.setLastMousePosition({ x: e.clientX, y: e.clientY });

      this._clickEventElement = target;
      this._clickEventPosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (!target.closest('.app-container')) return;

      e.preventDefault();

      this._grid.onMouseMove(e);

      for (const module of this._modules.values()) {
        module.onMouseMove(e);
      }

      this.setLastMousePosition({ x: e.clientX, y: e.clientY });

      if (this.grid.data.get('moving')) {
        this._clickEventElement = null;
      }
    });

    window.addEventListener('pointerup', (e: MouseEvent): void => {
      const target = e.target as HTMLElement;

      e.preventDefault();

      this._grid.onMouseUp(e);

      for (const module of this._modules.values()) {
        module.onMouseUp(e);
      }

      this.setMouseUp();

      if (
        this._clickEventElement === target &&
        util.isWithinRadius(this._clickEventPosition, { x: e.clientX, y: e.clientY }, 5)
      ) {
        this._grid.onClick(e);

        for (const module of this._modules.values()) {
          module.onClick(e);
        }
      }
    });

    window.addEventListener(
      'wheel',
      (e: WheelEvent): void => {
        const target = e.target as HTMLElement;
        if (!target.closest('.app-container')) return;

        e.preventDefault();

        this._grid.onWheelMove(e);

        for (const module of this._modules.values()) {
          module.onWheelMove(e);
        }
      },
      { passive: false },
    );

    window.addEventListener('keydown', (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement;
      if (!target.closest('.app-container')) return;

      e.preventDefault();

      this._grid.onKeyDown(e);

      for (const module of this._modules.values()) {
        module.onKeyDown(e);
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement;
      if (!target.closest('.app-container')) return;

      e.preventDefault();

      this._grid.onKeyUp(e);

      for (const module of this._modules.values()) {
        module.onKeyUp(e);
      }
    });

    window.addEventListener('contextmenu', (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement;
      if (!target.closest('.app-container')) return;

      e.preventDefault();

      this._grid.onContextMenu(e);

      for (const module of this._modules.values()) {
        module.onContextMenu(e);
      }
    });
  }

  setMouseDown(): void {
    this._mouseDown = true;
  }
  setLastMousePosition(position: Position): void {
    this._lastMousePosition = position;
  }
  setMouseUp(): void {
    this._mouseDown = false;
  }

  import(data: GridAppData): void {
    for (const [moduleName, moduleData] of Object.entries(data.modules)) {
      const module = this._modules.get(moduleName);
      if (!module) {
        throw new Error(`Module "${moduleName}" is not registered.`);
      }

      module.import(moduleData);
    }
  }

  export(): GridAppData {
    const modulesData: Record<string, object> = {};

    for (const [moduleName, module] of this._modules.entries()) {
      modulesData[moduleName] = module.export();
    }

    return {
      grid: this._grid.export(),
      modules: modulesData,
    };
  }
}
