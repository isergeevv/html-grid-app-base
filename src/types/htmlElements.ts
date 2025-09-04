import GridAppComponent from '../grid/elements/GridAppComponent';
import GridAppConnection from '../grid/elements/GridAppConnection';
import GridAppComponentConnector from '../grid/elements/component/GridAppComponentConnector';
import GridAppModule from '../GridAppModule';
import GridAppGrid from '../grid/GridAppGrid';
import GridAppGridModule from '../grid/GridAppGridModule';
import GridAppGridElement from '../grid/GridAppGridElement';
import GridAppComponentContainer from '../grid/elements/component/GridAppComponentContainer';

export interface GridAppGridElementHTMLElement extends HTMLDivElement {
  gridAppInstance: GridAppGridElement;
}

export interface GridAppConnectionHTMLElement extends GridAppGridElementHTMLElement {
  gridAppInstance: GridAppConnection;
}

export interface GridAppComponentHTMLElement extends GridAppGridElementHTMLElement {
  gridAppInstance: GridAppComponent;
}

export interface GridAppComponentConnectorHTMLElement extends HTMLDivElement {
  gridAppInstance: GridAppComponentConnector;
}

export interface GridAppComponentContainerHTMLElement extends HTMLDivElement {
  gridAppInstance: GridAppComponentContainer;
}

export interface GridAppGridHTMLElement extends HTMLDivElement {
  gridAppInstance: GridAppGrid;
}

export interface GridAppModuleHTMLElement extends HTMLDivElement {
  gridAppInstance: GridAppModule;
}

export interface GridAppGridModuleHTMLElement extends HTMLDivElement {
  gridAppInstance: GridAppGridModule;
}
