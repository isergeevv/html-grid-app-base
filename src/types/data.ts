import { CONNECTOR_TYPES, Position, RGBColor, Size, Vector } from './general';

export interface GridAppGridData {
  currentElementId: number;
  zoom: number;
  offset: Vector;
  elements: GridAppElementData[];
  modules: Record<string, GridAppGridModuleData>;
}

export interface GridAppData {
  grid: GridAppGridData;
  modules: Record<string, object>;
}

export interface GridAppGridModuleData {}

export interface GridAppElementData {
  id: number;
  type: string;
  label: string;
  position: Position;
  size: Size;
  backgroundColor: RGBColor;
  textColor: RGBColor;
}

/* Connections Data */

export interface GridAppConnectionElementData extends GridAppElementData {
  startAnchorId: number;
  endAnchorId: number;
  endPosition: Position;
}

export interface GridAppComponentConnectorData {
  label: string;
  connectorType: CONNECTOR_TYPES;
}

/* Components Data */

export interface GridAppComponentElementData extends GridAppElementData {
  backgroundColor: RGBColor;
  textColor: RGBColor;
}
