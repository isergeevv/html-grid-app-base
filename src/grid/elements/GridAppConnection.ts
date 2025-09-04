import GridAppGrid from '../GridAppGrid';
import GridAppGridElement from '../GridAppGridElement';
import type {
  GridAppConnectionElementConfiguration,
  GridAppComponentConnectorHTMLElement,
  Position,
  GridAppConnectionElementData,
} from '../../types';

export default abstract class GridAppConnection extends GridAppGridElement {
  constructor(grid: GridAppGrid, config: GridAppConnectionElementConfiguration) {
    super(grid, config);

    this.element.classList.add('app-element');

    this.element.dataset['startAnchorId'] = '0';
    this.element.dataset['endAnchorId'] = '0';

    this.element.style.setProperty('--x2', '0');
    this.element.style.setProperty('--y2', '0');
    this.element.style.setProperty('--deg', '0');
  }

  get startAnchorId(): number {
    return Number(this.element.dataset['startAnchorId']);
  }

  get endAnchorId(): number {
    return Number(this.element.dataset['endAnchorId']);
  }

  get distance(): number {
    return Number(this.element.style.getPropertyValue('--dist'));
  }

  get endPosition() {
    return {
      x: Number(this.element.style.getPropertyValue('--x2')),
      y: Number(this.element.style.getPropertyValue('--y2')),
    };
  }

  setDegree(deg: number): void {
    this.element.style.setProperty('--deg', deg.toString());
  }
  getDegree(): number {
    return Number(this.element.style.getPropertyValue('--deg'));
  }

  setDistance(distance: number): void {
    this.element.style.setProperty('--dist', distance.toString());
  }

  setEndPosition(position: Position) {
    this.element.style.setProperty('--x2', position.x.toString());
    this.element.style.setProperty('--y2', position.y.toString());
  }

  setStartAnchorId(id: number) {
    this.element.dataset['startAnchorId'] = id.toString();
  }

  setEndAnchorId(id: number) {
    this.element.dataset['endAnchorId'] = id.toString();
  }

  onMouseDown(e: MouseEvent): void {
    const zoom = this.grid.zoom;
    const offset = this.grid.offset;
    const initialOffset = this.grid.initialOffset;

    this.setEndAnchorId(0);
    this.generateConnectionPath({
      x: (e.clientX - initialOffset.x) / zoom + initialOffset.x - offset.x,
      y: (e.clientY - initialOffset.y) / zoom + initialOffset.y - offset.y,
    });

    this.grid.setPointerInteractingElement(this.element);
    this.toggleMoving(true);
  }

  onMouseMove(e: MouseEvent): void {
    const zoom = this.grid.zoom;
    const offset = this.grid.offset;
    const initialOffset = this.grid.initialOffset;

    this.generateConnectionPath({
      x: (e.clientX - initialOffset.x) / zoom + initialOffset.x - offset.x,
      y: (e.clientY - initialOffset.y) / zoom + initialOffset.y - offset.y,
    });
  }

  onMouseUp(e: MouseEvent): void {
    const target = e.target as HTMLDivElement;

    const pointedElement = target.closest(
      '.app-component-connector[data-connector-type="input"]',
    ) as GridAppComponentConnectorHTMLElement | null;

    if (pointedElement && pointedElement.gridAppInstance.component.id !== this.startAnchorId) {
      const zoom = this.grid.zoom;
      const offset = this.grid.offset;
      const initialOffset = this.grid.initialOffset;

      this.generateConnectionPath({
        x: (e.clientX - initialOffset.x) / zoom + initialOffset.x - offset.x,
        y: (e.clientY - initialOffset.y) / zoom + initialOffset.y - offset.y,
      });
      this.setEndAnchorId(pointedElement.gridAppInstance.component.id);

      this.toggleMoving(false);
    } else {
      this.element.parentElement!.removeChild(this.element);
    }
  }

  onClick(_e: MouseEvent): void {}

  onWheelMove(_e: WheelEvent): void {}

  onKeyDown(_e: KeyboardEvent): void {}

  onKeyUp(_e: KeyboardEvent): void {}

  abstract generateConnectionPath(endPosition: Position): void;

  abstract import(data: GridAppConnectionElementData): void;

  abstract export(): GridAppConnectionElementData;
}
