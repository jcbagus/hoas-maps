import React from 'react';
import { Source, Layer, SymbolLayer, useMap, LineLayer } from 'react-map-gl';
import centroid from '@turf/centroid';

import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../../../context/App';
import { MapsAreaType } from '../../../../types';
import { layerResidentalAreasStyle } from './styles';

import {
  HOAS_AREA_CLUSTER_MAXZOOM,
  SOURCE_ID_RESIDENTAL_AREAS,
} from './constants';

const layerStyleSpacesSymbols: SymbolLayer = {
  id: 'residental-areas-symbols',
  type: 'symbol',
  layout: {
    'text-field': ['get', 'title'],
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-variable-anchor': ['center'],
    'text-justify': 'center',
    'text-max-width': 1,
    'text-allow-overlap': true,
    'text-size': ['interpolate', ['linear'], ['zoom'], 10, 6, 13, 26],
  },
  paint: {
    'text-color': '#FFFFFF',
    'text-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      10,
      1,
      12.5,
      1,
      HOAS_AREA_CLUSTER_MAXZOOM,
      0,
    ],
  },
};

function Areas() {
  const { state } = useAppContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = searchParams.getAll('filters[]');
  const { mainMap } = useMap();

  const generateFeatureCollection = (
    filter: (areas: MapsAreaType[]) => typeof areas,
  ) => {
    return {
      type: 'FeatureCollection',
      features: filter(state.areas).map((area: MapsAreaType, i) => {
        const category = state.categories.find((c) =>
          area.categories.includes(c.slug),
        );

        const areaFeature = JSON.parse(area.geoJson);
        areaFeature.properties = {
          ...areaFeature.properties,
          ...area.meta,
        };

        areaFeature.properties.title = area.name;
        areaFeature.properties.orgSlug = area.slug;
        areaFeature.properties.slug = `area-${area.slug}`;
        areaFeature.properties.categories = area.categories;
        areaFeature.properties.categorySlug = category?.slug;
        areaFeature.properties.color = category?.color || '#000';
        areaFeature.properties.polygonGeometry = areaFeature.geometry;
        return centroid(areaFeature, { properties: areaFeature.properties });
      }),
    };
  };

  const geojsonResidentalAreas: any = React.useMemo(
    () =>
      generateFeatureCollection((areas) =>
        areas.filter(
          (area) => !!filters.find((f) => area.subCategories.includes(f)),
        ),
      ),
    [state.areas, filters],
  );

  return (
    <>
      {/* RESIDENTAL_AREAS */}
      <Source
        id={SOURCE_ID_RESIDENTAL_AREAS}
        type="geojson"
        data={geojsonResidentalAreas}
        generateId
      >
        <Layer
          {...layerResidentalAreasStyle}
          maxzoom={HOAS_AREA_CLUSTER_MAXZOOM}
        />
        <Layer
          {...layerStyleSpacesSymbols}
          maxzoom={HOAS_AREA_CLUSTER_MAXZOOM}
        />
      </Source>
    </>
  );
}

export default Areas;
