import GridAppGrid from '../GridAppGrid';
import GridAppGridElement from '../GridAppGridElement';
import type {
  GridAppComponentElementData,
  GridAppComponentHTMLElement,
  GridAppConnectionHTMLElement,
  Position,
  Vector,
  GridAppComponentElementConfiguration,
  GridAppComponentContainerHTMLElement,
} from '../../types';
import { RESIZE_TYPES } from '../../types';
import GridAppComponentContainer from './component/GridAppComponentContainer';

export default abstract class GridAppComponent extends GridAppGridElement {
  constructor(grid: GridAppGrid, config: GridAppComponentElementConfiguration) {
    super(grid, config);

    this.element.classList.add('app-element');

    this.setMinSize(config.minSize);
    this.setSize(config.size);

    if (config.resize.length > 0) {
      const resizeElements = this._generateResizeElements(config.resize);

      this.element.append(...resizeElements);
    }

    if (config.container) {
      const container = new GridAppComponentContainer(this.grid, {});
      this.element.append(container.element);
    }
  }

  get isResizing(): boolean {
    return this.data.has('resizing');
  }

  get isFocused(): boolean {
    return this.data.has('focused');
  }

  get resizingType(): string {
    const resizingType = this.data.get('resizing');
    if (!resizingType) {
      throw new Error('Resizing type is not set.');
    }

    return resizingType;
  }

  get containerElement(): GridAppComponentContainerHTMLElement | null {
    return this.element.querySelector('.app-component-container');
  }

  get container(): GridAppComponentContainer | null {
    const containerElement = this.containerElement;
    if (!containerElement) {
      return null;
    }

    return containerElement.gridAppInstance;
  }

  private _generateResizeElements(resizeConfig: RESIZE_TYPES[]): HTMLDivElement[] {
    const resizeElements: HTMLDivElement[] = [];

    for (const resizeType of resizeConfig) {
      const resizeElement = document.createElement('div');
      resizeElement.classList.add('app-component-resize');
      resizeElement.dataset['resizeType'] = resizeType;

      resizeElements.push(resizeElement);
    }

    return resizeElements;
  }

  private _checkPositionInContainerBounds(position: Position): boolean {
    const parent = this.parent;
    console.log(parent);
    if (!(parent instanceof GridAppComponent)) {
      return true;
    }

    const container = parent.container;
    console.log(container);
    if (!container) {
      return true;
    }

    const componentSize = this.size;

    const containerRect = container.element.getBoundingClientRect();

    console.log('Container Rect:', containerRect);
    console.log('Position to check:', position);

    return (
      position.x >= 0 &&
      position.x + componentSize.w <= containerRect.width &&
      position.y >= 0 &&
      position.y + componentSize.h <= containerRect.height
    );
  }

  toggleFocused(value: boolean): void {
    this.data.toggle('focused', value);
  }

  setResizing(value: string): void {
    this.data.set('resizing', value);
  }
  stopResizing(): void {
    this.data.remove('resizing');
  }

  moveConnectionElements(delta: Vector): void {
    const id = this.id;

    const startConnectionElements = this.grid.element.querySelectorAll(
      `[data-type="connection"][data-start-anchor-id="${id}"]`,
    );
    for (const connectionElement of startConnectionElements) {
      const gridAppConnection = (connectionElement as GridAppConnectionHTMLElement).gridAppInstance;

      const connectionStartPosition = gridAppConnection.position;
      const connectionEndPosition = gridAppConnection.endPosition;

      gridAppConnection.setPosition({
        x: connectionStartPosition.x - delta.x,
        y: connectionStartPosition.y - delta.y,
      });
      gridAppConnection.generateConnectionPath(connectionEndPosition);
    }

    const endConnectionElements = this.grid.element.querySelectorAll(
      `[data-type="connection"][data-end-anchor-id="${id}"]`,
    );
    for (const connectionElement of endConnectionElements) {
      const gridAppConnection = (connectionElement as GridAppConnectionHTMLElement).gridAppInstance;

      const connectionEndPosition = gridAppConnection.endPosition;

      gridAppConnection.generateConnectionPath({
        x: connectionEndPosition.x - delta.x,
        y: connectionEndPosition.y - delta.y,
      });
    }
  }

  move(e: MouseEvent): void {
    const zoom = this.grid.zoom;
    const position = this.position;

    const delta: Vector = {
      x: (this.grid.app.lastMousePosition.x - e.clientX) / zoom,
      y: (this.grid.app.lastMousePosition.y - e.clientY) / zoom,
    };

    const newPosition = {
      x: position.x - delta.x,
      y: position.y - delta.y,
    };

    if (this._checkPositionInContainerBounds(newPosition)) {
      this.setPosition(newPosition);

      this.moveConnectionElements(delta);
    }
  }

  resize(e: MouseEvent): void {
    const zoom = this.grid.zoom;
    const position = this.position;
    const resizingType = this.resizingType;
    const size = this.size;
    const minSize = this.minSize;

    const delta: Vector = {
      x: (this.grid.app.lastMousePosition.x - e.clientX) / zoom,
      y: (this.grid.app.lastMousePosition.y - e.clientY) / zoom,
    };

    switch (resizingType) {
      case RESIZE_TYPES.LEFT:
        if (size.w + delta.x < minSize.w) {
          delta.x = minSize.w - size.w;
        }

        this.setSize({ w: size.w + delta.x, h: size.h });
        this.setPosition({ x: position.x - delta.x, y: position.y });
        break;
      case RESIZE_TYPES.RIGHT:
        this.setSize({ w: size.w - delta.x, h: size.h });
        break;
      case RESIZE_TYPES.TOP:
        if (size.h + delta.y < minSize.h) {
          delta.y = minSize.h - size.h;
        }

        this.setSize({ w: size.w, h: size.h + delta.y });
        this.setPosition({ x: position.x, y: position.y - delta.y });
        break;
      case RESIZE_TYPES.BOTTOM:
        this.setSize({ w: size.w, h: size.h - delta.y });
        break;
      default:
        throw new Error(`Invalid resize type: ${resizingType}`);
    }

    this.moveConnectionElements(delta);
  }

  onMouseDown(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    switch (this.grid.activeTool) {
      case 'grab': {
        this.grid.setPointerInteractingElement(this.element);
        this.toggleMoving(true);
        this.grid.setMoving('element');

        break;
      }
      case 'resize': {
        if (target.classList.contains('app-component-resize')) {
          const resizeType = target.dataset['resizeType'];
          if (!resizeType) {
            throw new Error('Resize type is not set.');
          }

          this.grid.setPointerInteractingElement(this.element);
          this.setResizing(resizeType);
        }

        break;
      }
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (this.isMoving) {
      this.move(e);
    } else if (this.isResizing) {
      this.resize(e);
    }
  }

  onMouseUp(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    const targetComponentContainerElement = target.closest(
      '.app-element[data-type="component"] > .app-component-container',
    );
    if (targetComponentContainerElement) {
      const componentElement = targetComponentContainerElement.closest(
        '.app-element[data-type="component"]',
      ) as GridAppComponentHTMLElement | null;
      if (!componentElement) {
        throw new Error('Component element not found.');
      }

      if (this.parentElement !== targetComponentContainerElement) {
        const component = componentElement.gridAppInstance;

        if (confirm(`Place ${this.type} component inside this ${component.type} component container?`)) {
          targetComponentContainerElement.append(this.element);

          this.setPosition({ x: 0, y: 0 });
        }
      }
    }

    this.toggleMoving(false);
    this.grid.stopMoving();
    this.stopResizing();
  }

  onClick(_e: MouseEvent): void {}

  onWheelMove(_e: WheelEvent): void {}

  onKeyDown(_e: KeyboardEvent): void {}

  onKeyUp(_e: KeyboardEvent): void {}

  abstract copy(): GridAppComponent;

  abstract import(data: GridAppComponentElementData): void;

  abstract export(): GridAppComponentElementData;
}
