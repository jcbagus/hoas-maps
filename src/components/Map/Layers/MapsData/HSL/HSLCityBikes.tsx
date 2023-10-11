import React from 'react';
import { Source, Layer, SymbolLayer } from 'react-map-gl';
import { useSearchParams } from 'react-router-dom';
import {
  SOURCE_ID_CITY_BIKES,
  LAYER_ID_CITY_BIKES,
  LAYER_ID_CITY_BIKES_SELECTED,
} from '../constants';

const SOURCE_URL =
  'https://cdn.digitransit.fi/map/v2/hsl-citybike-map/index.json';

const layerStyle: SymbolLayer = {
  id: LAYER_ID_CITY_BIKES,
  'source-layer': 'stations',
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

const layerStyleSelected: SymbolLayer = {
  ...layerStyle,
  id: LAYER_ID_CITY_BIKES_SELECTED,
  layout: {
    ...layerStyle.layout,
    'icon-size': {
      base: 0.2,
      stops: [
        [10, 0.3],
        [13, 0.35],
        [17, 0.35],
      ],
    },
  },
};

interface IMemo {
  filters: string[];
  selectedSlug: string;
}

export default function HSLCityBikesLayer() {
  const [searchParams] = useSearchParams();
  const { filters, selectedSlug } = React.useMemo(
    (): IMemo => ({
      filters: searchParams.getAll('filters[]') || [],
      selectedSlug: searchParams.get('selectedItem') || '',
    }),
    [searchParams],
  );

  const FEATURE_FILTERS = React.useMemo(() => {
    const base = ['boolean', filters.includes('city-bikes')];
    return base;
  }, [filters]);

  return (
    <Source
      id={SOURCE_ID_CITY_BIKES}
      type="vector"
      url={SOURCE_URL}
      promoteId="id"
    >
      <Layer {...layerStyle} filter={FEATURE_FILTERS} />
      <Layer
        {...layerStyleSelected}
        filter={['==', 'id', `${selectedSlug.replace('CITYBIKE:', '')}`]}
      />
    </Source>
  );
}
