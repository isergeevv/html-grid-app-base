import { CONNECTOR_TYPES, RESIZE_TYPES } from './general';
import type {
  GridAppGridElementConstructor,
  GridAppGridModuleConstructor,
  GridAppModuleConstructor,
  RGBColor,
  Size,
} from './general';

export interface GridAppOffsetConfiguration {
  x: number;
  y: number;
}

export interface GridAppZoomConfiguration {
  default: number;
  min: number;
  max: number;
  step: number;
}

export interface GridAppGridElementConfiguration {
  type: string;
  label: string;
  defaultBackgroundColor: RGBColor;
  defaultTextColor: RGBColor;
}

export interface GridAppComponentElementConfiguration extends GridAppGridElementConfiguration {
  size: Size;
  minSize: Size;
  resize: RESIZE_TYPES[];
  container: boolean;
}

export interface GridAppComponentConnectorConfiguration {
  label: string;
  connectorType: CONNECTOR_TYPES;
}

export interface GridAppComponentContainerConfiguration {}

export interface GridAppConnectionElementConfiguration extends GridAppGridElementConfiguration {}

export interface GridAppModuleConfiguration {
  label: string;
  [key: string]: unknown;
}

export interface GridAppGridModuleConfiguration {
  label: string;
  [key: string]: unknown;
}

export interface GridAppModuleAppConfiguration {
  constructor: GridAppModuleConstructor;
  config: GridAppModuleConfiguration;
}

export interface GridAppGridModuleAppConfiguration {
  constructor: GridAppGridModuleConstructor;
  config: GridAppGridModuleConfiguration;
}

export interface GridAppGridElementAppConfiguration {
  type: string;
  label: string;
  constructor: GridAppGridElementConstructor;
}

export interface GridAppGridConfiguration {
  size: number;
  zoom: GridAppZoomConfiguration;
  modules: Record<string, GridAppGridModuleAppConfiguration>;
  elements: GridAppGridElementAppConfiguration[];
}

export interface GridAppConfiguration {
  grid: GridAppGridConfiguration;
  modules: Record<string, GridAppModuleAppConfiguration>;
}

/* Grid Modules */

export interface GridAppGridConnectionsModuleConfiguration extends GridAppGridModuleConfiguration {}

export interface GridAppGridComponentsModuleConfiguration extends GridAppGridModuleConfiguration {
  collision: Record<string, string[]>;
}
