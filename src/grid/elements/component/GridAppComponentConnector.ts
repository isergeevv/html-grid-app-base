import GridAppComponent from '../GridAppComponent';
import { CONNECTOR_TYPES } from '../../../types';
import type {
  GridAppComponentConnectorHTMLElement,
  GridAppComponentHTMLElement,
  GridAppComponentConnectorConfiguration,
} from '../../../types';
import GridAppGrid from '../../GridAppGrid';
import GridAppConnection from '../GridAppConnection';

export default class GridAppComponentConnector {
  private _grid: GridAppGrid;

  private _element: GridAppComponentConnectorHTMLElement;

  constructor(grid: GridAppGrid, config: GridAppComponentConnectorConfiguration) {
    this._grid = grid;

    this._element = document.createElement('div') as GridAppComponentConnectorHTMLElement;
    this._element.gridAppInstance = this;

    this._element.classList.add(`app-component-connector`);

    this._element.dataset['label'] = config.label;
    this._element.dataset['connectorType'] = config.connectorType;
  }

  get element(): GridAppComponentConnectorHTMLElement {
    return this._element;
  }

  get grid(): GridAppGrid {
    return this._grid;
  }

  get component(): GridAppComponent {
    const gridComponentElement = this._element.closest(
      '.app-element[data-type="component"]',
    ) as GridAppComponentHTMLElement | null;
    if (!gridComponentElement) {
      throw new Error('No grid component found for connector.');
    }

    return gridComponentElement.gridAppInstance;
  }

  get label(): string {
    const label = this._element.dataset['label'];
    if (!label) {
      throw new Error('Connector label is not set.');
    }

    return label;
  }

  get connectorType(): CONNECTOR_TYPES {
    const type = this._element.dataset['connectorType'];
    if (!type) {
      throw new Error('Connector type is not set.');
    }

    return type as CONNECTOR_TYPES;
  }

  onMouseDown(e: MouseEvent): boolean {
    const zoom = this.grid.zoom;
    const offset = this.grid.offset;

    const connection = this.grid.createElement('connection', 'line') as GridAppConnection;
    connection.setStartAnchorId(this.component.id);
    this.grid.append(connection);

    connection.setPosition({
      x: (e.clientX - this.grid.initialOffset.x) / zoom + this.grid.initialOffset.x - offset.x,
      y: (e.clientY - this.grid.initialOffset.y) / zoom + this.grid.initialOffset.y - offset.y,
    });

    this.grid.setPointerInteractingElement(connection.element);
    connection.toggleMoving(true);

    return true;
  }

  onConnectionStart(): void {
    // Implement connection start logic if needed
    console.log(`Connection started for connector: ${this.label}`);
  }

  onConnectionEnd(): void {
    // Implement connection end logic if needed
    console.log(`Connection ended for connector: ${this.label}`);
  }
}
