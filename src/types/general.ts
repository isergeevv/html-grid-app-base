import GridApp from '../GridApp';
import GridAppGrid from '../grid/GridAppGrid';
import GridAppGridElement from '../grid/GridAppGridElement';
import GridAppGridModule from '../grid/GridAppGridModule';
import GridAppModule from '../GridAppModule';

export enum CONNECTOR_TYPES {
  INPUT = 'input',
  OUTPUT = 'output',
}

export enum RESIZE_TYPES {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export type RGBColor = [number, number, number];

export interface Vector {
  x: number;
  y: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export type GridAppModuleConstructor = new (app: GridApp, config: object) => GridAppModule;

export type GridAppGridModuleConstructor = new (grid: GridAppGrid, config: object) => GridAppGridModule;

export type GridAppGridElementConstructor = new (grid: GridAppGrid) => GridAppGridElement;
