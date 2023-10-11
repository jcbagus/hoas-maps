import React from 'react';
import { Source, Layer, CircleLayer } from 'react-map-gl';
import { useSearchParams } from 'react-router-dom';
import {
  SOURCE_ID_PUBLIC_TRANSPORTATION,
  LAYER_ID_PUBLIC_TRANSPORTATION,
  LAYER_ID_PUBLIC_TRANSPORTATION_SELECTED,
} from '../constants';

import { getTypeColor } from './utils';

const SOURCE_URL = 'https://cdn.digitransit.fi/map/v2/hsl-stop-map/index.json';

const layerStyle: CircleLayer = {
  id: LAYER_ID_PUBLIC_TRANSPORTATION,
  type: 'circle',
  'source-layer': 'stops',
  layout: {},
  paint: {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      // zoom is 11 (or less) -> circle radius will be 1px
      11,
      1,
      // zoom is 12 (or greater) -> circle radius will be 2px
      12,
      2,
      // zoom is 16 (or greater) -> circle radius will be 10px
      16,
      8,
    ],
    'circle-opacity': [
      'case',
      ['==', ['get', 'type'], ''],
      0, // IF no type set, do now show
      1,
    ],
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#FFFFFF',
      ['==', ['get', 'type'], 'BUS'],
      getTypeColor('BUS'), // IF BUS
      ['==', ['get', 'type'], 'TRAM'],
      getTypeColor('TRAM'), // IF TRAM
      ['==', ['get', 'type'], 'RAIL'],
      getTypeColor('RAIL'), // IF RAIL
      ['==', ['get', 'type'], 'SUBWAY'],
      getTypeColor('SUBWAY'), // IF SUBWAY
      ['==', ['get', 'type'], 'FERRY'],
      getTypeColor('FERRY'), // IF FERRY
      getTypeColor(undefined), // result of all tests failing
    ],
    'circle-stroke-color': [
      'case',
      ['==', ['get', 'type'], 'BUS'],
      getTypeColor('BUS'), // IF BUS
      ['==', ['get', 'type'], 'TRAM'],
      getTypeColor('TRAM'), // IF TRAM
      ['==', ['get', 'type'], 'RAIL'],
      getTypeColor('RAIL'), // IF RAIL
      ['==', ['get', 'type'], 'SUBWAY'],
      getTypeColor('SUBWAY'), // IF SUBWAY
      ['==', ['get', 'type'], 'FERRY'],
      getTypeColor('FERRY'), // IF FERRY
      getTypeColor(undefined), // result of all tests failing
    ],
    'circle-stroke-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      5,
      0,
    ],
  },
};

const layerStyleSelected = {
  ...layerStyle,
  id: LAYER_ID_PUBLIC_TRANSPORTATION_SELECTED,
  paint: {
    ...layerStyle.paint,
    'circle-color': '#FFFFFF',
    'circle-stroke-width': 5,
  },
};

const convertCategoryToType = (category: string) => {
  switch (category) {
    case 'bus-stop':
      return 'BUS';
    case 'tram-stop':
      return 'TRAM';
    case 'rail-stop':
      return 'RAIL';
    case 'subway-stop':
      return 'SUBWAY';
    case 'ferry-stop':
      return 'FERRY';
    default:
      return '';
  }
};

interface IMemo {
  filters: string[];
  selectedSlug: string;
}

export default function HSLStopsLayer() {
  const [searchParams] = useSearchParams();
  const { filters, selectedSlug } = React.useMemo(
    (): IMemo => ({
      filters: searchParams.getAll('filters[]') || [],
      selectedSlug: searchParams.get('selectedItem') || '',
    }),
    [searchParams],
  );

  const FEATURE_FILTERS = React.useMemo(() => {
    const base = ['any', ['==', 'type', 'any']];
    if (filters.length > 0) {
      return filters.reduce((acc, filter) => {
        const type = convertCategoryToType(filter);
        if (type) {
          return [...acc, ['==', 'type', type]];
        }
        return acc;
      }, base);
    }
    return base;
  }, [filters]);

  return (
    <Source
      id={SOURCE_ID_PUBLIC_TRANSPORTATION}
      type="vector"
      url={SOURCE_URL}
      promoteId="gtfsId"
    >
      <Layer {...layerStyle} filter={FEATURE_FILTERS} source-layer="stops" />
      <Layer
        {...layerStyleSelected}
        filter={['==', 'gtfsId', selectedSlug]}
        source-layer="stops"
      />
    </Source>
  );
}
