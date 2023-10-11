import React, { useEffect } from 'react';
import { Source, Layer, useMap } from 'react-map-gl';

import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../../../context/App';
import { POIType } from '../../../../types';

import {
  SOURCE_ID_HOUSES,
  SOURCE_ID_SCHOOLS,
  SOURCE_ID_STORES,
  SOURCE_ID_HEALTH_SERVICES,
  SOURCE_ID_LIBRARY,
  HOAS_AREA_CLUSTER_MAXZOOM,
} from './constants';
import { useSelectedItem } from './events';
import {
  // layerClusterStyle,
  layerHousesClusterStyle,
  layerHousesUnClusteredStyle,
  layerSchoolsClusterStyle,
  layerSchoolsUnClusteredStyle,
  layerSchoolsSelectedStyle,
  layerStoresClusterStyle,
  layerStoresUnClusteredStyle,
  layerStoresSelectedStyle,
  layerHealthServicesClusterStyle,
  layerHealthServicesUnClusteredStyle,
  layerHealthServicesSelectedStyle,
  layerLibraryClusterStyle,
  layerLibraryUnClusteredStyle,
  layerLibrarySelectedStyle,
  layerHousesSelectedStyle,
} from './styles';

const COMMON_CLUSTER_PROPERTIES = {
  color: ['get', 'color'],
};

function generateId(input: string) {
  return [...input.split('')].reduce((hash, chr) => {
    return hash * 33 + chr.charCodeAt(0);
  }, 0);
}

const selectedId: number | null = null;
function POIs() {
  const { state } = useAppContext();
  const { mainMap } = useMap();
  const { selectedItem } = useSelectedItem();

  const [searchParams] = useSearchParams();
  const filters = React.useMemo(
    () => searchParams.getAll('filters[]'),
    [searchParams],
  );

  const generateFeatureCollection = (
    filter: (pois: POIType[]) => typeof pois,
  ) => {
    return {
      type: 'FeatureCollection',
      features: filter(state.pois).map((poi: POIType, i) => {
        const category = state.categories.find((c) =>
          poi.categories.includes(c.slug),
        );

        return {
          type: 'Feature',
          id: generateId(poi.slug) % state.pois.length,
          geometry: {
            type: 'Point',
            coordinates: [poi.coordinates.lng, poi.coordinates.lat],
          },
          properties: {
            ...poi,
            ...poi.meta,
            name_sv: poi.meta.name_sv?.S.trim() || poi.name,
            name_en: poi.meta.name_en?.S.trim() || poi.name,
            titleExtension_sv:
              poi.meta.titleExtension_sv?.S.trim() || poi.titleExtension,
            titleExtension_en:
              poi.meta.titleExtension_en?.S.trim() || poi.titleExtension,
            vehicleMode: poi.meta.vehicleMode?.S,
            stopCode: poi.meta.code?.S,
            stopDesc: poi.meta.desc?.S,
            color: category?.color,
            categorySlug: category?.slug,
          },
        };
      }),
    };
  };

  const geojsonHouses: any = React.useMemo(
    () =>
      generateFeatureCollection((pois) =>
        pois.filter(
          (poi) =>
            poi.categories.includes('hoas-houses') &&
            !!filters.find((f) => poi.categories.includes(f)),
        ),
      ),
    [state.pois, filters],
  );

  const geojsonSchools: any = React.useMemo(
    () =>
      generateFeatureCollection((pois) =>
        pois.filter(
          (poi) =>
            poi.categories.includes('schools') &&
            !!filters.find((f) => poi.categories.includes(f)),
        ),
      ),
    [state.pois, filters],
  );

  const geojsonStores: any = React.useMemo(
    () =>
      generateFeatureCollection((pois) =>
        pois.filter(
          (poi) =>
            poi.categories.includes('stores') &&
            !!filters.find((f) => poi.categories.includes(f)),
        ),
      ),
    [state.pois, filters],
  );

  const geojsonHealthServices: any = React.useMemo(
    () =>
      generateFeatureCollection((pois) =>
        pois.filter(
          (poi) =>
            poi.categories.includes('health-services') &&
            !!filters.find((f) => poi.categories.includes(f)),
        ),
      ),
    [state.pois, filters],
  );

  const geojsonLibrary: any = React.useMemo(
    () =>
      generateFeatureCollection((pois) =>
        pois.filter(
          (poi) =>
            poi.categories.includes('library') &&
            !!filters.find((f) => poi.categories.includes(f)),
        ),
      ),
    [state.pois, filters],
  );

  const setActiveFeatureState = (poi: POIType | null) => {
    const inactive = poi && poi.categories.includes('hoas-houses');
    geojsonHouses.features.forEach((feature: any) => {
      mainMap.setFeatureState(
        { source: SOURCE_ID_HOUSES, id: feature.id },
        { inactive },
      );
    });
  };

  useEffect(() => {
    setActiveFeatureState(selectedItem as POIType);
  }, [selectedItem]);

  // const filter = React.useMemo(() => ['==', 'visible', true], []);

  const selectedSlug = searchParams.get('selectedItem') || '';

  // FILTERS
  const CLUSTER_FILTER = ['all', ['has', 'point_count']];
  const NON_CLUSTER_FILTER = [
    'all',
    ['!=', 'slug', selectedSlug],
    ['!has', 'point_count'],
  ];
  const ACTIVE_FILTER = [
    'all',
    ['==', 'slug', selectedSlug],
    ['!has', 'point_count'],
  ];
  return (
    <>
      {/* SCHOOLS */}
      <Source
        id={SOURCE_ID_SCHOOLS}
        type="geojson"
        data={geojsonSchools}
        cluster
        clusterMaxZoom={12}
        clusterRadius={20}
        generateId
        clusterProperties={COMMON_CLUSTER_PROPERTIES}
      >
        <Layer {...layerSchoolsClusterStyle} filter={CLUSTER_FILTER} />
        <Layer {...layerSchoolsSelectedStyle} filter={ACTIVE_FILTER} />
        <Layer {...layerSchoolsUnClusteredStyle} filter={NON_CLUSTER_FILTER} />
      </Source>

      {/* Stores */}
      <Source
        id={SOURCE_ID_STORES}
        type="geojson"
        data={geojsonStores}
        generateId
        clusterProperties={COMMON_CLUSTER_PROPERTIES}
      >
        <Layer {...layerStoresClusterStyle} filter={CLUSTER_FILTER} />
        <Layer {...layerStoresSelectedStyle} filter={ACTIVE_FILTER} />
        <Layer {...layerStoresUnClusteredStyle} filter={NON_CLUSTER_FILTER} />
      </Source>

      {/* Health Services */}
      <Source
        id={SOURCE_ID_HEALTH_SERVICES}
        type="geojson"
        data={geojsonHealthServices}
        cluster
        clusterMaxZoom={12}
        clusterRadius={20}
        generateId
      >
        <Layer {...layerHealthServicesClusterStyle} filter={CLUSTER_FILTER} />
        <Layer {...layerHealthServicesSelectedStyle} filter={ACTIVE_FILTER} />
        <Layer
          {...layerHealthServicesUnClusteredStyle}
          filter={NON_CLUSTER_FILTER}
        />
      </Source>

      {/* Library */}
      <Source
        id={SOURCE_ID_LIBRARY}
        type="geojson"
        data={geojsonLibrary}
        cluster
        clusterMaxZoom={12}
        clusterRadius={20}
        generateId
      >
        <Layer {...layerLibraryClusterStyle} filter={CLUSTER_FILTER} />
        <Layer {...layerLibrarySelectedStyle} filter={ACTIVE_FILTER} />
        <Layer {...layerLibraryUnClusteredStyle} filter={NON_CLUSTER_FILTER} />
      </Source>

      {/* HOUSES */}
      <Source
        id={SOURCE_ID_HOUSES}
        type="geojson"
        data={geojsonHouses}
        cluster
        clusterMaxZoom={11}
        clusterRadius={20}
        clusterProperties={COMMON_CLUSTER_PROPERTIES}
      >
        <Layer
          {...layerHousesClusterStyle}
          filter={CLUSTER_FILTER}
          minzoom={HOAS_AREA_CLUSTER_MAXZOOM}
        />
        <Layer
          {...layerHousesSelectedStyle}
          filter={ACTIVE_FILTER}
          minzoom={HOAS_AREA_CLUSTER_MAXZOOM}
        />
        <Layer
          {...layerHousesUnClusteredStyle}
          filter={NON_CLUSTER_FILTER}
          minzoom={HOAS_AREA_CLUSTER_MAXZOOM}
        />
      </Source>
    </>
  );
}

export default POIs;
