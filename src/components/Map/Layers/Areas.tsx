import centroid from '@turf/centroid';
import React, { useEffect } from 'react';
import { Source, Layer, FillLayer, useMap, SymbolLayer } from 'react-map-gl';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../../context/App';

const SOURCE_ID = 'areas-data';
const SOURCE_ID_SYMBOLS = 'areas-data-symbols';

const LAYER_ID = 'areas';
const LAYER_ID_SYMBOLS = 'areas-symbols';

const layerStyleAreas: FillLayer = {
  id: LAYER_ID,
  type: 'fill',
  layout: {
    'fill-sort-key': 0,
  },
  paint: {
    'fill-color': '#a1a8fa', // blue color fill
    'fill-opacity': 0.5,
  },
};

const layerStyleSpacesSymbols: SymbolLayer = {
  id: LAYER_ID_SYMBOLS,
  type: 'symbol',
  layout: {
    'symbol-sort-key': 200,
    'text-field': ['get', 'name'],
    'text-radial-offset': 0.5,
    'text-justify': 'center',
  },
  paint: {
    'text-halo-blur': 0.1,
    'text-color': '#FFFFFF',
    'text-halo-width': 0.1,
    'text-halo-color': '#222222',
  },
};

function ToolTip({ tooltipInfo }: any) {
  return (
    <div
      className="tooltip"
      style={{ left: tooltipInfo.x, top: tooltipInfo.y }}
    >
      <div>{tooltipInfo.feature.properties.name}</div>
    </div>
  );
}

function Areas() {
  const { mainMap } = useMap();
  const { state } = useAppContext();
  const [hoverInfo, setHoverInfo] = React.useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = searchParams.getAll('filters[]');

  const geojsonAreas: any = React.useMemo(
    () => ({
      type: 'FeatureCollection',
      features: state.selectedProperty?.areas?.map((area) => ({
        type: 'Feature',
        geometry: area.geo,
        properties: { ...area },
      })),
    }),
    [state.selectedProperty],
  );

  const geojsonSymbols: any = React.useMemo(
    () => ({
      type: 'FeatureCollection',
      features: geojsonAreas.features.map((f: any) =>
        centroid(f, { properties: f.properties }),
      ),
    }),
    [geojsonAreas],
  );

  const onHover = React.useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];
    // setHoverFeatureState(hoveredFeature.id);

    setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
  }, []);

  const onMouseLeave = () => {
    // setHoverFeatureState(null);
    setHoverInfo(null);
  };

  useEffect(() => {
    mainMap.on('mousemove', LAYER_ID, onHover);
    mainMap.on('mouseleave', LAYER_ID, onMouseLeave);
  }, []);

  const filter = React.useMemo(() => ['in', 'id', ...filters], [filters]);

  return (
    <>
      <Source id={SOURCE_ID} type="geojson" data={geojsonAreas}>
        <Layer {...layerStyleAreas} filter={filter} />
      </Source>
      <Source id={SOURCE_ID_SYMBOLS} type="geojson" data={geojsonSymbols}>
        <Layer {...layerStyleSpacesSymbols} filter={filter} />
      </Source>
      {hoverInfo && <ToolTip tooltipInfo={hoverInfo} />}
    </>
  );
}

export default Areas;
