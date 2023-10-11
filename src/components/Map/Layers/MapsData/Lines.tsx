import React from 'react';
import { Source, Layer } from 'react-map-gl';

import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../../../context/App';
import { MapsLineType } from '../../../../types';

import {
  SOURCE_ID_LINES,
  SOURCE_ID_METRO_LINE,
  SOURCE_ID_TRAM_LINE,
} from './constants';
import {
  layerLinesStyle,
  layerMetroLinesStyle,
  layerTramLinesStyle,
} from './styles';

function Lines() {
  const { state } = useAppContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = searchParams.getAll('filters[]');

  const generateFeatureCollection = (
    filter: (lines: MapsLineType[]) => typeof lines,
  ) => {
    return {
      type: 'FeatureCollection',
      features: filter(state.lines).map((line: MapsLineType, i) => {
        const category = state.categories.find((c) =>
          line.categories.includes(c.slug),
        );

        return {
          type: 'Feature',
          // id: i,
          geometry: line.geoJson.geometry,
          properties: {
            ...line,
            ...line.meta,
            color: category?.color,
            categorySlug: category?.slug,
          },
        };
      }),
    };
  };

  const geojsonLines: any = React.useMemo(
    () =>
      generateFeatureCollection((lines) =>
        lines.filter(
          (l) =>
            l.meta.line !== null &&
            l.categories.includes('railway-line') &&
            !!filters.find((f) => l.categories.includes(f)),
        ),
      ),
    [state.lines, filters],
  );

  const geojsonMetroLines: any = React.useMemo(
    () =>
      generateFeatureCollection((lines) =>
        lines.filter(
          (l) =>
            l.meta.line !== null &&
            l.categories.includes('metro-line') &&
            !!filters.find((f) => l.categories.includes(f)),
        ),
      ),
    [state.lines, filters],
  );

  const geojsonTramLines: any = React.useMemo(
    () =>
      generateFeatureCollection((lines) =>
        lines.filter(
          (l) =>
            l.meta.line !== null &&
            l.categories.includes('tram-line') &&
            !!filters.find((f) => l.categories.includes(f)),
        ),
      ),
    [state.lines, filters],
  );

  return (
    <>
      {/*  RAILWAY LINE */}
      <Source
        id={SOURCE_ID_LINES}
        type="geojson"
        data={geojsonLines}
        generateId
      >
        <Layer {...layerLinesStyle} />
      </Source>
      <Source
        id={SOURCE_ID_METRO_LINE}
        type="geojson"
        data={geojsonMetroLines}
        generateId
      >
        <Layer {...layerMetroLinesStyle} />
      </Source>
      <Source
        id={SOURCE_ID_TRAM_LINE}
        type="geojson"
        data={geojsonTramLines}
        generateId
      >
        <Layer {...layerTramLinesStyle} />
      </Source>
    </>
  );
}

export default Lines;
