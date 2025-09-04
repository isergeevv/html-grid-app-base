import GridAppConnection from '../elements/GridAppConnection';
import GridAppGrid from '../GridAppGrid';
import { GridAppConnectionElementData, Position } from '../../types';

export default class GridAppLineConnection extends GridAppConnection {
  constructor(grid: GridAppGrid) {
    super(grid, {
      type: 'connection',
      label: 'line',
      defaultBackgroundColor: [255, 0, 0],
      defaultTextColor: [0, 0, 0],
    });
  }

  generateConnectionPath(endPosition: Position): void {
    this.setEndPosition(endPosition);

    const startPosition = this.position;

    const deg = this._calcRotateDeg(startPosition, endPosition);
    const distance = this._calcDistance(startPosition, endPosition);

    this.setDegree(deg);
    this.setDistance(distance);
  }

  private _calcRotateDeg(pos1: Position, pos2: Position): number {
    const x = pos2.x - pos1.x;
    const y = pos2.y - pos1.y;

    const angle = Math.atan2(x, y);

    const deg = -angle * (180 / Math.PI);

    return deg;
  }

  private _calcDistance(pos1: Position, pos2: Position): number {
    const x = (pos2.x - pos1.x) ** 2;
    const y = (pos2.y - pos1.y) ** 2;

    return Math.sqrt(x + y);
  }

  import(data: GridAppConnectionElementData): void {
    this.setPosition(data.position);
    this.setEndPosition(data.endPosition);
    this.setDegree(this._calcRotateDeg(data.position, data.endPosition));
    this.setStartAnchorId(data.startAnchorId);
    this.setEndAnchorId(data.endAnchorId);
    this.setBackgroundColor(data.backgroundColor);
    this.setTextColor(data.textColor);
  }

  export(): GridAppConnectionElementData {
    const id = this.id;
    const type = this.type;
    const label = this.label;
    const startAnchorId = this.startAnchorId;
    const endAnchorId = this.endAnchorId;
    const position = this.position;
    const endPosition = this.endPosition;
    const size = this.size;
    const backgroundColor = this.backgroundColor;
    const textColor = this.textColor;

    return {
      id: id,
      type: type,
      label: label,
      startAnchorId: startAnchorId,
      endAnchorId: endAnchorId,
      position: { x: position.x, y: position.y },
      endPosition: { x: endPosition.x, y: endPosition.y },
      size: size,
      backgroundColor: backgroundColor,
      textColor: textColor,
    };
  }
}
