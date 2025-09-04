import { EventEmitter } from 'node:events';

declare class ElementData {
    private _element;
    constructor(element: HTMLElement);
    has(key: string): boolean;
    get(key: string): string | null;
    set(key: string, value?: string): void;
    remove(key: string): void;
    toggle(key: string, value: boolean): void;
}

declare abstract class GridAppGridElement {
    private _grid;
    private _element;
    private _data;
    constructor(grid: GridAppGrid, config: GridAppGridElementConfiguration);
    get element(): GridAppGridElementHTMLElement;
    get parentElement(): GridAppGridHTMLElement | GridAppComponentContainerHTMLElement;
    get parent(): GridAppGrid | GridAppGridElement;
    get data(): ElementData;
    get type(): string;
    get label(): string;
    get id(): number;
    get grid(): GridAppGrid;
    get position(): Position;
    get minSize(): Size;
    get size(): Size;
    get isMoving(): boolean;
    get backgroundColor(): RGBColor;
    get textColor(): RGBColor;
    toggleMoving(value: boolean): void;
    setMinSize(size: Size): void;
    setSize(size: Size): void;
    setId(value: number): void;
    setPosition(position: Position): void;
    setBackgroundColor(color: RGBColor): void;
    setTextColor(color: RGBColor): void;
    abstract onMouseDown(e: MouseEvent): void;
    abstract onMouseMove(e: MouseEvent): void;
    abstract onMouseUp(e: MouseEvent): void;
    abstract onClick(e: MouseEvent): void;
    abstract onWheelMove(e: WheelEvent): void;
    abstract onKeyDown(e: KeyboardEvent): void;
    abstract onKeyUp(e: KeyboardEvent): void;
    abstract import(data: GridAppElementData): void;
    abstract export(): GridAppElementData;
}

declare class GridAppComponentContainer {
    private _grid;
    private _element;
    constructor(grid: GridAppGrid, _config: GridAppComponentContainerConfiguration);
    get element(): GridAppComponentContainerHTMLElement;
    get grid(): GridAppGrid;
    get component(): GridAppComponent;
}

declare abstract class GridAppComponent extends GridAppGridElement {
    constructor(grid: GridAppGrid, config: GridAppComponentElementConfiguration);
    get isResizing(): boolean;
    get isFocused(): boolean;
    get resizingType(): string;
    get containerElement(): GridAppComponentContainerHTMLElement | null;
    get container(): GridAppComponentContainer | null;
    private _generateResizeElements;
    private _checkPositionInContainerBounds;
    toggleFocused(value: boolean): void;
    setResizing(value: string): void;
    stopResizing(): void;
    moveConnectionElements(delta: Vector): void;
    move(e: MouseEvent): void;
    resize(e: MouseEvent): void;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onClick(_e: MouseEvent): void;
    onWheelMove(_e: WheelEvent): void;
    onKeyDown(_e: KeyboardEvent): void;
    onKeyUp(_e: KeyboardEvent): void;
    abstract copy(): GridAppComponent;
    abstract import(data: GridAppComponentElementData): void;
    abstract export(): GridAppComponentElementData;
}

declare class GridAppGrid {
    private _app;
    private _element;
    private _gridElementConstructors;
    private _zoomConfig;
    private _initialOffset;
    private _focusedComponent;
    private _pointerInteractingElement;
    private _currentElementId;
    private _modules;
    private _data;
    constructor(app: GridApp, config: GridAppGridConfiguration);
    get app(): GridApp;
    get element(): GridAppGridHTMLElement;
    get data(): ElementData;
    get gridElementConstructors(): GridAppGridElementAppConfiguration[];
    get initialOffset(): Vector;
    get pointerInteractingElement(): GridAppGridElementHTMLElement | null;
    get focusedComponent(): GridAppComponent | null;
    get zoom(): number;
    get offset(): Vector;
    get isGridMoving(): boolean;
    get gridElements(): GridAppGridElement[];
    get activeTool(): string;
    append(...elements: GridAppGridElement[]): void;
    setMoving(value: 'grid' | 'element'): void;
    stopMoving(): void;
    getNextGridElementId(): number;
    createElement(type: string, label: string): GridAppGridElement;
    calculateMovePosition(viewPortMouseCoords: Position, position: Position): {
        x: number;
        y: number;
    };
    setZoom(zoom: number): void;
    updateZoom(moveDelta: number): void;
    setOffset(offset: Vector): void;
    updateOffset(move: Vector): void;
    setPointerInteractingElement(element: GridAppGridElementHTMLElement | null): void;
    setFocusedComponent(component: GridAppComponent | null): void;
    setActiveTool(tool: string): void;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onClick(e: MouseEvent): void;
    onWheelMove(e: WheelEvent): void;
    onKeyDown(_e: KeyboardEvent): void;
    onKeyUp(_e: KeyboardEvent): void;
    onContextMenu(_e: KeyboardEvent): void;
    import(data: GridAppGridData): void;
    export(): GridAppGridData;
}

declare abstract class GridAppGridModule {
    private _grid;
    private _element;
    constructor(grid: GridAppGrid, config: GridAppGridModuleConfiguration);
    get grid(): GridAppGrid;
    get element(): GridAppGridModuleHTMLElement;
    get label(): string;
    calculateMovePosition(viewPortMouseCoords: Vector, position: Position): {
        x: number;
        y: number;
    };
    abstract onMouseDown(e: MouseEvent): void;
    abstract onMouseMove(e: MouseEvent): void;
    abstract onMouseUp(e: MouseEvent): void;
    abstract onClick(e: MouseEvent): void;
    abstract onWheelMove(e: WheelEvent): void;
    abstract onKeyDown(e: KeyboardEvent): void;
    abstract onKeyUp(e: KeyboardEvent): void;
    abstract import(data: GridAppGridModuleData): void;
    abstract export(): GridAppGridModuleData;
}

declare abstract class GridAppModule {
    private _app;
    private _element;
    private _data;
    constructor(app: GridApp, config: GridAppModuleConfiguration);
    get app(): GridApp;
    get element(): GridAppModuleHTMLElement;
    get data(): ElementData;
    get label(): string;
    abstract onMouseDown(e: MouseEvent): void;
    abstract onMouseMove(e: MouseEvent): void;
    abstract onMouseUp(e: MouseEvent): void;
    abstract onClick(e: MouseEvent): void;
    abstract onWheelMove(e: WheelEvent): void;
    abstract onKeyDown(e: KeyboardEvent): void;
    abstract onKeyUp(e: KeyboardEvent): void;
    abstract onContextMenu(e: KeyboardEvent): void;
    abstract import(data: object): void;
    abstract export(): object;
}

declare enum CONNECTOR_TYPES {
    INPUT = "input",
    OUTPUT = "output"
}
declare enum RESIZE_TYPES {
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
    BOTTOM = "bottom"
}
type RGBColor = [number, number, number];
interface Vector {
    x: number;
    y: number;
}
interface Position {
    x: number;
    y: number;
}
interface Size {
    w: number;
    h: number;
}
type GridAppModuleConstructor = new (app: GridApp, config: object) => GridAppModule;
type GridAppGridModuleConstructor = new (grid: GridAppGrid, config: object) => GridAppGridModule;
type GridAppGridElementConstructor = new (grid: GridAppGrid) => GridAppGridElement;

interface GridAppOffsetConfiguration {
    x: number;
    y: number;
}
interface GridAppZoomConfiguration {
    default: number;
    min: number;
    max: number;
    step: number;
}
interface GridAppGridElementConfiguration {
    type: string;
    label: string;
    defaultBackgroundColor: RGBColor;
    defaultTextColor: RGBColor;
}
interface GridAppComponentElementConfiguration extends GridAppGridElementConfiguration {
    size: Size;
    minSize: Size;
    resize: RESIZE_TYPES[];
    container: boolean;
}
interface GridAppComponentConnectorConfiguration {
    label: string;
    connectorType: CONNECTOR_TYPES;
}
interface GridAppComponentContainerConfiguration {
}
interface GridAppConnectionElementConfiguration extends GridAppGridElementConfiguration {
}
interface GridAppModuleConfiguration {
    label: string;
    [key: string]: unknown;
}
interface GridAppGridModuleConfiguration {
    label: string;
    [key: string]: unknown;
}
interface GridAppModuleAppConfiguration {
    constructor: GridAppModuleConstructor;
    config: GridAppModuleConfiguration;
}
interface GridAppGridModuleAppConfiguration {
    constructor: GridAppGridModuleConstructor;
    config: GridAppGridModuleConfiguration;
}
interface GridAppGridElementAppConfiguration {
    type: string;
    label: string;
    constructor: GridAppGridElementConstructor;
}
interface GridAppGridConfiguration {
    size: number;
    zoom: GridAppZoomConfiguration;
    modules: Record<string, GridAppGridModuleAppConfiguration>;
    elements: GridAppGridElementAppConfiguration[];
}
interface GridAppConfiguration {
    grid: GridAppGridConfiguration;
    modules: Record<string, GridAppModuleAppConfiguration>;
}
interface GridAppGridConnectionsModuleConfiguration extends GridAppGridModuleConfiguration {
}
interface GridAppGridComponentsModuleConfiguration extends GridAppGridModuleConfiguration {
    collision: Record<string, string[]>;
}

declare abstract class GridAppConnection extends GridAppGridElement {
    constructor(grid: GridAppGrid, config: GridAppConnectionElementConfiguration);
    get startAnchorId(): number;
    get endAnchorId(): number;
    get distance(): number;
    get endPosition(): {
        x: number;
        y: number;
    };
    setDegree(deg: number): void;
    getDegree(): number;
    setDistance(distance: number): void;
    setEndPosition(position: Position): void;
    setStartAnchorId(id: number): void;
    setEndAnchorId(id: number): void;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onClick(_e: MouseEvent): void;
    onWheelMove(_e: WheelEvent): void;
    onKeyDown(_e: KeyboardEvent): void;
    onKeyUp(_e: KeyboardEvent): void;
    abstract generateConnectionPath(endPosition: Position): void;
    abstract import(data: GridAppConnectionElementData): void;
    abstract export(): GridAppConnectionElementData;
}

declare class GridAppComponentConnector {
    private _grid;
    private _element;
    constructor(grid: GridAppGrid, config: GridAppComponentConnectorConfiguration);
    get element(): GridAppComponentConnectorHTMLElement;
    get grid(): GridAppGrid;
    get component(): GridAppComponent;
    get label(): string;
    get connectorType(): CONNECTOR_TYPES;
    onMouseDown(e: MouseEvent): boolean;
    onConnectionStart(): void;
    onConnectionEnd(): void;
}

interface GridAppGridElementHTMLElement extends HTMLDivElement {
    gridAppInstance: GridAppGridElement;
}
interface GridAppConnectionHTMLElement extends GridAppGridElementHTMLElement {
    gridAppInstance: GridAppConnection;
}
interface GridAppComponentHTMLElement extends GridAppGridElementHTMLElement {
    gridAppInstance: GridAppComponent;
}
interface GridAppComponentConnectorHTMLElement extends HTMLDivElement {
    gridAppInstance: GridAppComponentConnector;
}
interface GridAppComponentContainerHTMLElement extends HTMLDivElement {
    gridAppInstance: GridAppComponentContainer;
}
interface GridAppGridHTMLElement extends HTMLDivElement {
    gridAppInstance: GridAppGrid;
}
interface GridAppModuleHTMLElement extends HTMLDivElement {
    gridAppInstance: GridAppModule;
}
interface GridAppGridModuleHTMLElement extends HTMLDivElement {
    gridAppInstance: GridAppGridModule;
}

interface GridAppGridData {
    currentElementId: number;
    zoom: number;
    offset: Vector;
    elements: GridAppElementData[];
    modules: Record<string, GridAppGridModuleData>;
}
interface GridAppData {
    grid: GridAppGridData;
    modules: Record<string, object>;
}
interface GridAppGridModuleData {
}
interface GridAppElementData {
    id: number;
    type: string;
    label: string;
    position: Position;
    size: Size;
    backgroundColor: RGBColor;
    textColor: RGBColor;
}
interface GridAppConnectionElementData extends GridAppElementData {
    startAnchorId: number;
    endAnchorId: number;
    endPosition: Position;
}
interface GridAppComponentConnectorData {
    label: string;
    connectorType: CONNECTOR_TYPES;
}
interface GridAppComponentElementData extends GridAppElementData {
    backgroundColor: RGBColor;
    textColor: RGBColor;
}

declare class GridApp {
    private _element;
    private _events;
    private _mouseDown;
    private _lastMousePosition;
    private _clickEventElement;
    private _clickEventPosition;
    private _grid;
    private _modules;
    constructor(appContainer: HTMLDivElement | string, config: GridAppConfiguration);
    get element(): HTMLDivElement;
    get mouseDown(): boolean;
    get lastMousePosition(): Position;
    get modules(): Map<string, GridAppModule>;
    get events(): Map<string, EventEmitter>;
    get grid(): GridAppGrid;
    private _getAppContainerElement;
    private _registerWindowEventListeners;
    setMouseDown(): void;
    setLastMousePosition(position: Position): void;
    setMouseUp(): void;
    import(data: GridAppData): void;
    export(): GridAppData;
}

declare class GridAppGridComponents extends GridAppGridModule {
    private _collisionConfig;
    constructor(grid: GridAppGrid, config: GridAppGridComponentsModuleConfiguration);
    private _getCollisionComponents;
    private _getPositionsOverlap;
    private _detectCollision;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onClick(_e: MouseEvent): void;
    onWheelMove(_e: WheelEvent): void;
    onKeyDown(_e: KeyboardEvent): void;
    onKeyUp(_e: KeyboardEvent): void;
    import(_data: object): void;
    export(): object;
}

declare class GridAppGridConnections extends GridAppGridModule {
    private _currentConnectionType;
    constructor(grid: GridAppGrid, config: GridAppGridConnectionsModuleConfiguration);
    get currentConnectionType(): string;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onClick(_e: MouseEvent): void;
    onWheelMove(_e: WheelEvent): void;
    onKeyDown(_e: KeyboardEvent): void;
    onKeyUp(_e: KeyboardEvent): void;
    import(_data: object): void;
    export(): object;
}

declare class GridAppLineConnection extends GridAppConnection {
    constructor(grid: GridAppGrid);
    generateConnectionPath(endPosition: Position): void;
    private _calcRotateDeg;
    private _calcDistance;
    import(data: GridAppConnectionElementData): void;
    export(): GridAppConnectionElementData;
}

export { CONNECTOR_TYPES, GridApp, GridAppComponent, GridAppComponentConnector, GridAppComponentContainer, GridAppConnection, GridAppGrid, GridAppGridComponents, GridAppGridConnections, GridAppGridElement, GridAppGridModule, GridAppLineConnection, GridAppModule, RESIZE_TYPES };
export type { GridAppComponentConnectorConfiguration, GridAppComponentConnectorData, GridAppComponentConnectorHTMLElement, GridAppComponentContainerConfiguration, GridAppComponentContainerHTMLElement, GridAppComponentElementConfiguration, GridAppComponentElementData, GridAppComponentHTMLElement, GridAppConfiguration, GridAppConnectionElementConfiguration, GridAppConnectionElementData, GridAppConnectionHTMLElement, GridAppData, GridAppElementData, GridAppGridComponentsModuleConfiguration, GridAppGridConfiguration, GridAppGridConnectionsModuleConfiguration, GridAppGridData, GridAppGridElementAppConfiguration, GridAppGridElementConfiguration, GridAppGridElementConstructor, GridAppGridElementHTMLElement, GridAppGridHTMLElement, GridAppGridModuleAppConfiguration, GridAppGridModuleConfiguration, GridAppGridModuleConstructor, GridAppGridModuleData, GridAppGridModuleHTMLElement, GridAppModuleAppConfiguration, GridAppModuleConfiguration, GridAppModuleConstructor, GridAppModuleHTMLElement, GridAppOffsetConfiguration, GridAppZoomConfiguration, Position, RGBColor, Size, Vector };
