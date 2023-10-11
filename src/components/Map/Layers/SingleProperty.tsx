import React, { useEffect } from 'react';
import { useMap, Source, Layer, LineLayer } from 'react-map-gl';
import { PropertyType } from '../../../types';
import { getPolygonBounds } from '../../../utils';
import Loader from '../../Loaders';
import Areas from './Areas';
import Buildings from './Buildings';

const layerStyleProperty: LineLayer = {
  id: 'property',
  type: 'line',
  layout: {
    'line-sort-key': 0,
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#5865F6',
    'line-width': 3,
    'line-dasharray': [1, 4],
    'line-opacity': 1,
  },
};

function SingleProperty({ property }: { property: PropertyType }) {
  const { mainMap } = useMap();

  const geojsonProperty: any = React.useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: property.geo }],
    }),
    [property],
  );

  // Get property slug from url and zoom to bounds
  useEffect(() => {
    const bounds = getPolygonBounds(property.geo);
    if (bounds) {
      mainMap.fitBounds(bounds);
    }
  }, [mainMap, property]);

  if (!property) {
    return null;
  }

  if (!geojsonProperty.features) {
    return <Loader />;
  }

  return (
    <>
      <Source id="property-data" type="geojson" data={geojsonProperty}>
        <Layer {...layerStyleProperty} />
      </Source>
      <Buildings />
      <Areas />
    </>
  );
}

export default SingleProperty;
