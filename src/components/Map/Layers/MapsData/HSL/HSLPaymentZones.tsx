import React from 'react';
import { Source, Layer, Popup, useMap } from 'react-map-gl';
import centroid from '@turf/centroid';

import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../../../../context/App';
import HSLPaymentZonesJson from '../../../../../files/hsl-payment-zones.json';

import { LAYER_ID_HOUSES, SOURCE_ID_HSL_PAYMENT_ZONES } from '../constants';
import {
  layerHSLPaymentZoneStyle,
  layerHSLPaymentZoneLineStyle,
  layerHSLPaymentZoneBadgeStyle,
  layerHSLPaymentZoneBadgeLabelStyle,
} from '../styles';

function HSLPaymentZones() {
  const { state } = useAppContext();
  const { mainMap } = useMap();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = searchParams.getAll('filters[]');

  const generateFeatureCollection = () => {
    const features: any = [];
    const category = state.categories.find(
      (c) => c.slug === 'hsl-payment-zones',
    );

    if (category) {
      HSLPaymentZonesJson.features.forEach((feature, i) => {
        const badges = [];
        const properties = {
          ...feature.properties,
          color: category.color,
          categorySlug: category.slug,
        };

        if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach((coordinates) => {
            badges.push(
              centroid(
                { type: 'Polygon', coordinates },
                {
                  properties,
                },
              ),
            );
          });
        } else {
          badges.push(
            centroid(feature.geometry, {
              properties,
            }),
          );
        }

        feature.properties = properties;
        features.push(feature);
        features.push(...badges);
      });
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  };

  const geojson: any = React.useMemo(() => generateFeatureCollection(), []);

  const filter = React.useMemo(
    () => ['in', 'categorySlug', ...filters],
    [filters],
  );

  const moveLayer = () => {
    if (mainMap.getMap().getLayer(LAYER_ID_HOUSES)) {
      return LAYER_ID_HOUSES;
    }
    return '';
  };

  return (
    <>
      {/* HSL PAYMENT ZONES */}
      <Source
        id={SOURCE_ID_HSL_PAYMENT_ZONES}
        type="geojson"
        data={geojson}
        generateId
      >
        <Layer
          {...layerHSLPaymentZoneStyle}
          filter={['all', ['!=', '$type', 'Point'], filter]}
        />
        <Layer
          {...layerHSLPaymentZoneLineStyle}
          filter={['all', ['!=', '$type', 'Point'], filter]}
        />
        <Layer
          {...layerHSLPaymentZoneBadgeStyle}
          filter={['all', ['==', '$type', 'Point'], filter]}
          beforeId={moveLayer()}
        />
        <Layer
          {...layerHSLPaymentZoneBadgeLabelStyle}
          filter={['all', ['==', '$type', 'Point'], filter]}
          beforeId={moveLayer()}
        />
      </Source>
    </>
  );
}

export default HSLPaymentZones;
