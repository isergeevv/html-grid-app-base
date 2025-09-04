import GridAppComponent from '../elements/GridAppComponent';
import GridAppGrid from '../GridAppGrid';
import GridAppGridModule from '../GridAppGridModule';
import type {
  GridAppComponentHTMLElement,
  GridAppGridComponentsModuleConfiguration,
  Position,
  Size,
  Vector,
} from '../../types';

export default class GridAppGridComponents extends GridAppGridModule {
  private _collisionConfig: Record<string, string[]>;

  constructor(grid: GridAppGrid, config: GridAppGridComponentsModuleConfiguration) {
    super(grid, config);

    this._collisionConfig = config.collision || {};
  }

  private _getCollisionComponents(component: GridAppComponent): GridAppComponent[] {
    const id = component.id;
    const label = component.label;

    return this.grid.gridElements.filter(
      (c) =>
        c.type === 'component' &&
        c.id !== id &&
        this._collisionConfig[label] &&
        (this._collisionConfig[label].length === 0 || this._collisionConfig[label].includes(c.label)),
    ) as GridAppComponent[];
  }

  private _getPositionsOverlap(position1: Position, size1: Size, position2: Position, size2: Size): boolean {
    if (
      position1.x < position2.x + size2.w &&
      position1.x + size1.w > position2.x &&
      position1.y < position2.y + size2.h &&
      position1.y + size1.h > position2.y
    ) {
      return true;
    }

    return false;
  }

  private _detectCollision(component: GridAppComponent, movePosition: Position): boolean {
    const componentSize = component.size;
    const componentPosition = component.position;

    const collisionComponents = this._getCollisionComponents(component);

    for (const collisionComponent of collisionComponents) {
      const collisionComponentPosition = collisionComponent.position;
      const collisionComponentSize = collisionComponent.size;

      if (
        this._getPositionsOverlap(movePosition, componentSize, collisionComponentPosition, collisionComponentSize) &&
        !this._getPositionsOverlap(componentPosition, componentSize, collisionComponentPosition, collisionComponentSize)
      ) {
        return true;
      }
    }

    return false;
  }

  onMouseDown(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    const componentElement = target.closest('[data-type="component"]') as GridAppComponentHTMLElement | null;
    if (componentElement) {
      componentElement.gridAppInstance.onMouseDown(e);

      this.grid.setFocusedComponent(componentElement.gridAppInstance);
    }
  }

  onMouseMove(e: MouseEvent): void {
    const element = this.grid.pointerInteractingElement;
    if (element === null) return;
    if (element.dataset['type'] !== 'component') return;

    const componentElement = element as GridAppComponentHTMLElement;

    const viewPortMouseCoords: Vector = {
      x: e.clientX,
      y: e.clientY,
    };

    const componentPosition = componentElement.gridAppInstance.position;
    const movePosition = this.calculateMovePosition(viewPortMouseCoords, componentPosition);

    if (!this._detectCollision(componentElement.gridAppInstance, movePosition)) {
      componentElement.gridAppInstance.onMouseMove(e);
    }
  }

  onMouseUp(e: MouseEvent): void {
    const element = this.grid.pointerInteractingElement;
    if (element === null) return;
    if (element.dataset['type'] !== 'component') return;

    const componentElement = element as GridAppComponentHTMLElement;

    componentElement.gridAppInstance.onMouseUp(e);
  }

  onClick(_e: MouseEvent): void {}

  onWheelMove(_e: WheelEvent): void {}

  onKeyDown(_e: KeyboardEvent): void {}

  onKeyUp(_e: KeyboardEvent): void {}

  import(_data: object): void {}

  export(): object {
    return {};
  }
}
