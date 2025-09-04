import GridAppComponent from '../GridAppComponent';
import type {
  GridAppComponentContainerHTMLElement,
  GridAppComponentHTMLElement,
  GridAppComponentContainerConfiguration,
} from '../../../types';
import GridAppGrid from '../../GridAppGrid';

export default class GridAppComponentContainer {
  private _grid: GridAppGrid;

  private _element: GridAppComponentContainerHTMLElement;

  constructor(grid: GridAppGrid, _config: GridAppComponentContainerConfiguration) {
    this._grid = grid;

    this._element = document.createElement('div') as GridAppComponentContainerHTMLElement;
    this._element.gridAppInstance = this;

    this._element.classList.add(`app-component-container`);
  }

  get element(): GridAppComponentContainerHTMLElement {
    return this._element;
  }

  get grid(): GridAppGrid {
    return this._grid;
  }

  get component(): GridAppComponent {
    const componentElement = this._element.closest(
      '.app-element[data-type="component"]',
    ) as GridAppComponentHTMLElement | null;
    if (!componentElement) {
      throw new Error('No grid component found for connector.');
    }

    return componentElement.gridAppInstance;
  }
}
