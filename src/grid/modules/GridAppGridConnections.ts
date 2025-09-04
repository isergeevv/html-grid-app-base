import GridAppGrid from '../GridAppGrid';
import GridAppGridModule from '../GridAppGridModule';
import type {
  GridAppComponentConnectorHTMLElement,
  GridAppConnectionHTMLElement,
  GridAppGridConnectionsModuleConfiguration,
} from '../../types';

export default class GridAppGridConnections extends GridAppGridModule {
  private _currentConnectionType: string;

  constructor(grid: GridAppGrid, config: GridAppGridConnectionsModuleConfiguration) {
    super(grid, config);

    const connectionTypes = Object.keys(this.grid.gridElementConstructors.filter((c) => c.type === 'connection'));
    if (connectionTypes.length === 0) {
      throw new Error('No connection types registered.');
    }
    this._currentConnectionType = connectionTypes[0];
  }

  get currentConnectionType(): string {
    return this._currentConnectionType;
  }

  onMouseDown(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    const connectionElement = target.closest('[data-type="connection"]') as GridAppConnectionHTMLElement | null;
    if (connectionElement) {
      connectionElement.gridAppInstance.onMouseDown(e);
      return;
    }

    const componentConnectorElement = target.closest(
      '.app-component-connector[data-connector-type="output"]',
    ) as GridAppComponentConnectorHTMLElement | null;
    if (componentConnectorElement) {
      componentConnectorElement.gridAppInstance.onMouseDown(e);
    }
  }

  onMouseMove(e: MouseEvent): void {
    const element = this.grid.pointerInteractingElement;
    if (element === null) return;
    if (element.dataset['type'] !== 'connection') return;

    const connectionElement = element as GridAppConnectionHTMLElement;

    connectionElement.gridAppInstance.onMouseMove(e);
  }

  onMouseUp(e: MouseEvent): void {
    const element = this.grid.pointerInteractingElement;
    if (element === null) return;
    if (element.dataset['type'] !== 'connection') return;

    const connectionElement = element as GridAppConnectionHTMLElement;

    connectionElement.gridAppInstance.onMouseUp(e);
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
