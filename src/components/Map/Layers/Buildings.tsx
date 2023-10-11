import React from 'react';
import { Source, Layer, useMap, FillLayer } from 'react-map-gl';
import { useAppContext } from '../../../context/App';
import { getPolygonBounds } from '../../../utils';
import Spaces from './Spaces';

const layerStyleBuildings: FillLayer = {
  id: 'buildings',
  type: 'fill',
  paint: {
    'fill-color': '#5865F6',
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      0.8,
    ],
  },
};
function Buildings() {
  const { state } = useAppContext();
  const { mainMap } = useMap();

  const geojsonBuildings: any = React.useMemo(
    () => ({
      type: 'FeatureCollection',
      features: state.selectedProperty?.buildings?.map((building) => ({
        type: 'Feature',
        geometry: building.geo,
        properties: { ...building },
      })),
    }),
    [state.selectedProperty],
  );

  // Get property slug from url and zoom to bounds
  React.useEffect(() => {
    let bounds = null;
    if (state.selectedBuilding) {
      bounds = getPolygonBounds(state.selectedBuilding.geo);
    } else if (!state.selectedBuilding && state.selectedProperty) {
      bounds = getPolygonBounds(state.selectedProperty.geo);
    }

    if (bounds) {
      mainMap.fitBounds(bounds, { padding: 100, maxZoom: 20 });
    }
  }, [mainMap, state.selectedBuilding]);

  return (
    <>
      <Source id="buildings-data" type="geojson" data={geojsonBuildings}>
        <Layer {...layerStyleBuildings} />
      </Source>
      <Spaces />
    </>
  );
}

export default Buildings;
