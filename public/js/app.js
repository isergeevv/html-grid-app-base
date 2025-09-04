const gridAppElement = document.getElementById('gridApp');
const componentsGridModuleConfig = {
  label: 'components',
  collision: {
    group: ['group'],
  },
  componentConnectors: [
    {
      type: 'default',
      constructor: GridAppComponentConnector,
    },
  ],
};
const connectionsGridModuleConfig = {
  label: 'connections',
};
const toolboxModuleConfig = {
  label: 'toolbox',
  backgroundColor: [240, 240, 240],
  tools: [
    [
      {
        type: 'grab',
        label: '🖐',
      },
    ],
    [
      {
        type: 'resize',
        label: '↔',
      },
    ],
    [
      {
        type: 'connector',
        label: '─',
      },
    ],
  ],
};
const panelModuleConfig = {
  label: 'panel',
  panelElementTypes: ['component'],
  backgroundColor: [255, 255, 255],
};
const miniMapModuleConfig = {
  label: 'minimap',
  backgroundColor: [240, 240, 240],
};

const gridAppConfig = {
  grid: {
    size: 5,
    zoom: {
      default: 5,
      min: 1,
      max: 50,
      step: 1,
    },
    modules: {
      components: {
        constructor: GridAppGridComponents,
        config: componentsGridModuleConfig,
      },
      connections: {
        constructor: GridAppGridConnections,
        config: connectionsGridModuleConfig,
      },
    },
    elements: [
      {
        type: 'component',
        label: 'block',
        constructor: GridAppBlockComponent,
      },
      {
        type: 'component',
        label: 'group',
        constructor: GridAppGroupComponent,
      },
      {
        type: 'connection',
        label: 'line',
        constructor: GridAppLineConnection,
      },
    ],
  },
  modules: {
    toolbox: {
      constructor: GridAppToolBox,
      config: toolboxModuleConfig,
    },
    panel: {
      constructor: GridAppPanel,
      config: panelModuleConfig,
    },
    minimap: {
      constructor: GridAppMiniMap,
      config: miniMapModuleConfig,
    },
  },
};

const gridApp = new GridApp(gridAppElement, gridAppConfig);

console.log(gridApp.export());
