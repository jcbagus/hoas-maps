import React, { useEffect } from 'react';
import {
  Source,
  Layer,
  FillLayer,
  useMap,
  SymbolLayer,
  LineLayer,
} from 'react-map-gl';
import centroid from '@turf/centroid';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../../context/App';
import { BuildingType, SpaceType } from '../../../types';
import { getFloorsString } from '../../../utils';
import { useTranslation } from '../../../context/Translations';

type HoverInfoProps = {
  features: Array<any>;
  x: number;
  y: number;
};

const LAYER_ID = 'spaces';
const LAYER_ID_SYMBOLS = 'spaces-symbols';
const LAYER_ID_HOVER = 'spaces-hover';
const SOURCE_ID = 'spaces-data';
const SOURCE_ID_SYMBOLS = 'spaces-data-symbols';

const getCategoryColor = (categoryId: string) => {
  const colors: any = {
    TRHK: '#2F3DBB', // Hissi ja porras
    TRJT: '#4F33F7', // Jätteenlajittelu
    TRPE: '#9098f9', // Pesutilat
    TRSA: '#007fcf', // Saunatilat
    TRVS: '#40C5E2', // Väestönsuojelu
    TRVT: '#4264fb', // Varastotilat
    TRKP: '#0F197D', // Käytävä- ja porrastilat
    TRHI: '#2F3DBB', // Hissit
  };
  return colors[categoryId] || '#000000';
};

const layerStyleSpacesSymbols: SymbolLayer = {
  id: LAYER_ID_SYMBOLS,
  type: 'symbol',
  source: 'places',
  layout: {
    'text-field': ['get', 'name'],
    'text-variable-anchor': ['left'],
    'text-radial-offset': -1,
    'text-justify': 'left',
  },
  paint: {
    'text-halo-blur': 0.1,
    'text-color': '#FFFFFF',
    'text-halo-width': 0.1,
    'text-halo-color': '#222222',
  },
};

const layerStyleSpaces: FillLayer = {
  id: LAYER_ID,
  type: 'fill',
  paint: {
    'fill-color': ['get', 'color'],
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.75,
      0.75,
    ],
    // 'fill-extrusion-color': ['get', 'color'],
    // 'fill-extrusion-height': ['get', 'height'],
    // 'fill-extrusion-base': ['get', 'baseHeight'],
    // 'fill-extrusion-opacity': 0.5,
  },
};

const layerHoverStyle: LineLayer = {
  id: LAYER_ID_HOVER,
  type: 'line',
  paint: {
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      2,
      0,
    ],
  },
};

function ToolTip({ tooltipInfo }: any) {
  return (
    <div
      className="tooltip"
      style={{ left: tooltipInfo.x, top: tooltipInfo.y }}
    >
      {tooltipInfo.features.map((feature: any) => (
        <div key={feature.id} className="tooltip__feature">
          <div className="tooltip__feature__name">
            {feature.properties.name} ({feature.properties.floorsString})
          </div>
          <div className="tooltip__feature__category">
            {feature.properties.categoryName}
          </div>
        </div>
      ))}
    </div>
  );
}

const getSpaces = (buildings: BuildingType[]) =>
  buildings.map((b) => b.spaces).flat();

let hoveredId: any = null;
function Spaces() {
  const { mainMap } = useMap();
  const { state } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = searchParams.getAll('filters[]');
  const [hoverInfo, setHoverInfo] = React.useState<HoverInfoProps | null>(null);
  const { translate } = useTranslation();

  const floorsString = (floors: SpaceType['floors']) => {
    return `${translate(
      floors.length === 1 ? 'floor' : 'floors',
    )}: ${getFloorsString(floors)}`;
  };

  const geojsonSpaces: any = React.useMemo(
    () => ({
      type: 'FeatureCollection',
      features: getSpaces(state.selectedProperty?.buildings || []).map(
        (space: SpaceType) => ({
          type: 'Feature',
          id: +space.fid,
          geometry: space.geo,
          properties: {
            spaceId: space.id,
            floorsString: floorsString(space.floors),
            // height: 1,
            // base_height: +space.floorName,
            color: getCategoryColor(space.category.id),
            ...space,
            categoryId: space.category.id,
            categoryName: space.category.name,
          },
        }),
      ),
    }),
    [state.selectedProperty],
  );

  const geojsonSymbols: any = React.useMemo(
    () => ({
      type: 'FeatureCollection',
      features: geojsonSpaces.features.map((f: any) =>
        centroid(f, {
          properties: { ...f.properties, name: `∙ ${f.properties.name}` },
        }),
      ),
    }),
    [geojsonSpaces],
  );

  const setHoverFeatureState = (id: number | null) => {
    // un-hilight current
    if (hoveredId !== null) {
      mainMap.setFeatureState(
        { source: SOURCE_ID, id: hoveredId },
        { hover: false },
      );

      hoveredId = null;
    }

    // if feature id provided. set feature state
    if (id) {
      hoveredId = id;
      mainMap.setFeatureState(
        { source: SOURCE_ID, id: hoveredId },
        { hover: true },
      );
    }
  };

  const onHover = React.useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;

    const hoveredFeature = features && features[0];
    setHoverFeatureState(hoveredFeature.id);
    setHoverInfo(hoveredFeature ? { features, x, y } : null);
  }, []);

  const onMouseLeave = () => {
    setHoverFeatureState(null);
    setHoverInfo(null);
  };

  useEffect(() => {
    mainMap.on('mousemove', LAYER_ID, onHover);
    mainMap.on('mouseleave', LAYER_ID, onMouseLeave);
  }, []);

  const filter = React.useMemo(() => ['in', 'spaceId', ...filters], [filters]);

  return (
    <>
      <Source id={SOURCE_ID} type="geojson" data={geojsonSpaces}>
        <Layer {...layerStyleSpaces} filter={filter} />
        <Layer {...layerHoverStyle} filter={filter} />
      </Source>
      <Source id={SOURCE_ID_SYMBOLS} type="geojson" data={geojsonSymbols}>
        <Layer {...layerStyleSpacesSymbols} filter={filter} />
      </Source>
      {hoverInfo && <ToolTip tooltipInfo={hoverInfo} />}
    </>
  );
}

export default Spaces;
