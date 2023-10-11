import { CircleLayer, FillLayer, LineLayer, SymbolLayer } from 'mapbox-gl';
import {
  LAYER_ID_HOUSES,
  LAYER_ID_HOUSES_ACTIVE,
  LAYER_ID_HOUSES_CLUSTER,
  LAYER_ID_SCHOOLS,
  LAYER_ID_SCHOOLS_CLUSTER,
  LAYER_ID_SCHOOLS_SELECTED,
  LAYER_ID_HEALTH_SERVICES,
  LAYER_ID_HEALTH_SERVICES_CLUSTER,
  LAYER_ID_HEALTH_SERVICES_SELECTED,
  LAYER_ID_LIBRARY,
  LAYER_ID_LIBRARY_CLUSTER,
  LAYER_ID_LIBRARY_SELECTED,
  LAYER_ID_CITY_BIKES,
  LAYER_ID_CITY_BIKES_CLUSTER,
  LAYER_ID_CITY_BIKES_SELECTED,
  LAYER_ID_STORES,
  LAYER_ID_STORES_CLUSTER,
  LAYER_ID_STORES_SELECTED,
  LAYER_ID_RESIDENTAL_AREAS,
  LAYER_ID_LINES,
  LAYER_ID_METRO_LINE,
  LAYER_ID_TRAM_LINE,
  LAYER_ID_HSL_PAYMENT_ZONES,
  LAYER_ID_HSL_PAYMENT_ZONES_LINE,
  LAYER_ID_HSL_PAYMENT_ZONES_BADGES,
  LAYER_ID_HSL_PAYMENT_ZONES_BADGES_LABELS,
  HOAS_AREA_CLUSTER_MAXZOOM,
} from './constants';

// SCHOOLS
export const layerSchoolsUnClusteredStyle: SymbolLayer = {
  id: LAYER_ID_SCHOOLS,
  type: 'symbol',
  layout: {
    'icon-image': 'school-icon',
    'icon-size': {
      base: 0.1,
      stops: [
        [10, 0.1],
        [13, 0.2],
        [17, 0.275],
      ],
    },
    'icon-allow-overlap': true,
  },
};
export const layerSchoolsSelectedStyle: SymbolLayer = {
  id: LAYER_ID_SCHOOLS_SELECTED,
  type: 'symbol',
  layout: {
    'icon-image': 'school-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.3],
        [13, 0.35],
        [17, 0.35],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// SCHOOLS CLUSTER
export const layerSchoolsClusterStyle: SymbolLayer = {
  id: LAYER_ID_SCHOOLS_CLUSTER,
  type: 'symbol',
  layout: {
    'icon-image': 'school-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.15],
        [13, 0.25],
        [17, 0.3],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// STORES
export const layerStoresUnClusteredStyle: SymbolLayer = {
  id: LAYER_ID_STORES,
  type: 'symbol',
  layout: {
    'icon-image': 'stores-icon',
    'icon-size': {
      base: 0.1,
      stops: [
        [10, 0.1],
        [13, 0.2],
        [17, 0.275],
      ],
    },
    'icon-allow-overlap': true,
  },
};
export const layerStoresSelectedStyle: SymbolLayer = {
  id: LAYER_ID_STORES_SELECTED,
  type: 'symbol',
  layout: {
    'icon-image': 'stores-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.3],
        [13, 0.35],
        [17, 0.35],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// STORES CLUSTER
export const layerStoresClusterStyle: SymbolLayer = {
  id: LAYER_ID_STORES_CLUSTER,
  type: 'symbol',
  layout: {
    'icon-image': 'stores-icon',
    'icon-size': {
      base: 0.5,
      stops: [
        [10, 0.15],
        [13, 0.25],
        [17, 0.3],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// HEALTH SERVICES
export const layerHealthServicesUnClusteredStyle: SymbolLayer = {
  id: LAYER_ID_HEALTH_SERVICES,
  type: 'symbol',
  layout: {
    'icon-image': 'health-services-icon',
    'icon-size': {
      base: 0.1,
      stops: [
        [10, 0.1],
        [13, 0.2],
        [17, 0.275],
      ],
    },
    'icon-allow-overlap': true,
  },
};
export const layerHealthServicesSelectedStyle: SymbolLayer = {
  id: LAYER_ID_HEALTH_SERVICES_SELECTED,
  type: 'symbol',
  layout: {
    'icon-image': 'health-services-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.3],
        [13, 0.35],
        [17, 0.35],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// HEALTH SERVICES CLUSTER
export const layerHealthServicesClusterStyle: SymbolLayer = {
  id: LAYER_ID_HEALTH_SERVICES_CLUSTER,
  type: 'symbol',
  layout: {
    'icon-image': 'health-services-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.15],
        [13, 0.25],
        [17, 0.3],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// LIBRARY SERVICES
export const layerLibraryUnClusteredStyle: SymbolLayer = {
  id: LAYER_ID_LIBRARY,
  type: 'symbol',
  layout: {
    'icon-image': 'library-icon',
    'icon-size': {
      base: 0.1,
      stops: [
        [10, 0.1],
        [13, 0.2],
        [17, 0.275],
      ],
    },
    'icon-allow-overlap': true,
  },
};
export const layerLibrarySelectedStyle: SymbolLayer = {
  id: LAYER_ID_LIBRARY_SELECTED,
  type: 'symbol',
  layout: {
    'icon-image': 'library-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.3],
        [13, 0.35],
        [17, 0.35],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// LIBRARY CLUSTER
export const layerLibraryClusterStyle: SymbolLayer = {
  id: LAYER_ID_LIBRARY_CLUSTER,
  type: 'symbol',
  layout: {
    'icon-image': 'library-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.15],
        [13, 0.25],
        [17, 0.3],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// CITY BIKES
export const layerCityBikesUnClusteredStyle: SymbolLayer = {
  id: LAYER_ID_CITY_BIKES,
  type: 'symbol',
  layout: {
    'icon-image': 'city-bikes-icon',
    'icon-size': {
      base: 0.1,
      stops: [
        [10, 0.1],
        [13, 0.2],
        [17, 0.275],
      ],
    },
    'icon-allow-overlap': true,
  },
};
export const layerCityBikesSelectedStyle: SymbolLayer = {
  id: LAYER_ID_CITY_BIKES_SELECTED,
  type: 'symbol',
  layout: {
    'icon-image': 'city-bikes-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.3],
        [13, 0.35],
        [17, 0.35],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// CITY BIKES CLUSTER
export const layerCityBikesClusterStyle: SymbolLayer = {
  id: LAYER_ID_CITY_BIKES_CLUSTER,
  type: 'symbol',
  layout: {
    'icon-image': 'city-bikes-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.15],
        [13, 0.25],
        [17, 0.3],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// HOAS HOUSES
export const layerHousesUnClusteredStyle: SymbolLayer = {
  id: LAYER_ID_HOUSES,
  type: 'symbol',
  layout: {
    'icon-image': 'house-icon',
    'icon-size': {
      base: 1,
      stops: [
        [10, 0.3],
        [13, 1],
        [17, 1],
      ],
    },
    'icon-allow-overlap': true,
  },
  paint: {
    'icon-opacity': [
      'case',
      ['boolean', ['feature-state', 'inactive'], false],
      0.5,
      1,
    ],
  },
};

// HOAS HOUSES SELECTED
export const layerHousesSelectedStyle: SymbolLayer = {
  id: LAYER_ID_HOUSES_ACTIVE,
  type: 'symbol',
  layout: {
    'icon-image': 'house-icon',
    'icon-size': {
      base: 1,
      stops: [
        [10, 0.3],
        [13, 1],
        [17, 1],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// HOAS HOUSES CLUSTER
export const layerHousesClusterStyle: SymbolLayer = {
  id: LAYER_ID_HOUSES_CLUSTER,
  type: 'symbol',
  layout: {
    'icon-image': 'house-icon',
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.2],
        [13, 0.3],
        [17, 0.475],
      ],
    },
    'icon-allow-overlap': true,
  },
};

// RESIDENTAL AREAS
// export const layerResidentalAreasStyle: FillLayer = {
//   id: LAYER_ID_RESIDENTAL_AREAS,
//   type: 'fill',
//   layout: {
//     visibility: 'visible',
//     'fill-sort-key': 0,
//   },
//   paint: {
//     'fill-color': [
//       'case',
//       ['boolean', ['feature-state', 'hover'], false],
//       '#CB4FFF',
//       '#8B27B5',
//     ],
//     'fill-opacity': [
//       'case',
//       ['boolean', ['feature-state', 'hover'], false],
//       0.9,
//       0.8,
//     ],
//   },
// };

export const layerResidentalAreasStyle: CircleLayer = {
  id: LAYER_ID_RESIDENTAL_AREAS,
  type: 'circle',
  layout: {
    visibility: 'visible',
  },
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 25, 13, 100],
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#828cfa',
      '#5865F6',
    ],
    'circle-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      10,
      0.8,
      12.5,
      0.8,
      HOAS_AREA_CLUSTER_MAXZOOM,
      0,
    ],
  },
};

// RAIlWAY LINES
export const layerLinesStyle: LineLayer = {
  id: LAYER_ID_LINES,
  type: 'line',
  layout: {
    visibility: 'visible',
    'line-join': 'round',
    'line-cap': 'butt',
  },
  paint: {
    'line-color': '#8C4799',
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      3,
      1,
    ],
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'visible'], true],
      1,
      0,
    ],
  },
};

// METRO LINES
export const layerMetroLinesStyle = {
  ...layerLinesStyle,
  id: LAYER_ID_METRO_LINE,
  paint: {
    ...layerLinesStyle.paint,
    'line-color': '#CA4000',
  },
};

// TRAM LINES
export const layerTramLinesStyle = {
  ...layerLinesStyle,
  id: LAYER_ID_TRAM_LINE,
  paint: {
    ...layerLinesStyle.paint,
    'line-color': '#008151',
  },
};

// HSL PAYMENT ZONES
export const layerHSLPaymentZoneStyle: FillLayer = {
  id: LAYER_ID_HSL_PAYMENT_ZONES,
  type: 'fill',
  layout: {
    visibility: 'visible',
    'fill-sort-key': 0,
  },
  paint: {
    'fill-color': ['get', 'color'],
    'fill-opacity': 0.1,
  },
};
export const layerHSLPaymentZoneLineStyle: LineLayer = {
  id: LAYER_ID_HSL_PAYMENT_ZONES_LINE,
  type: 'line',
  layout: {
    visibility: 'visible',
    'line-join': 'round',
    'line-cap': 'butt',
  },
  paint: {
    'line-color': ['get', 'color'],
    'line-dasharray': [1, 2],
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      3,
      2,
    ],
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'visible'], true],
      1,
      0,
    ],
  },
};

export const layerHSLPaymentZoneBadgeStyle: CircleLayer = {
  id: LAYER_ID_HSL_PAYMENT_ZONES_BADGES,
  type: 'circle',
  layout: {
    visibility: 'visible',
  },
  paint: {
    'circle-radius': 15,
    'circle-color': ['get', 'color'],
  },
};
export const layerHSLPaymentZoneBadgeLabelStyle: SymbolLayer = {
  id: LAYER_ID_HSL_PAYMENT_ZONES_BADGES_LABELS,
  type: 'symbol',
  source: 'zone-badges-source',
  layout: {
    'text-field': '{Zone}',
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size': 11,
    'text-transform': 'uppercase',
    'text-letter-spacing': 0.05,
  },
  paint: {
    'text-color': '#ffffff',
  },
};
