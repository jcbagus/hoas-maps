/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from 'react';
import Map, {
  MapProvider,
  useMap,
  NavigationControl,
  ScaleControl,
  MapRef,
  useControl,
} from 'react-map-gl';
import { useParams } from 'react-router-dom';

import MapboxGl from 'mapbox-gl';

import { RulerControl } from 'mapbox-gl-controls';

import './Map.scss';
import FullscreenControl from './FullscreenControl';
import MapStyleSelect from '../MapStyleSelect';
import { useAppContext } from '../../context/App';
import Loader from '../Loaders';
import SingleProperty from './Layers/SingleProperty';
import MapsData from './Layers/MapsData/MapsData';
import { isInIframe } from '../../utils';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
MapboxGl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MapDefaultState: any = {
  minZoom: 9.5,
  maxZoom: 50,
  hash: true,
  attributionControl: false,
  center: [24.9305, 60.2418],
  maxBounds: [
    [23.9244, 59.9345],
    [25.6728, 60.6309],
  ],
  mapStyle:
    localStorage.getItem('layerStyle') || 'mapbox://styles/mapbox/light-v9',
  mapboxAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '',
};

function MapRouteHandler({
  setLoader,
}: {
  setLoader: (state: boolean) => void;
}) {
  const { state, fetchProperty, selectProperty } = useAppContext();
  const { propertySlug, buildingSlug } = useParams<
    'propertySlug' | 'buildingSlug'
  >();
  const { mainMap } = useMap();

  // Listen propertySlug param changes
  useEffect(() => {
    if (propertySlug) {
      if (+propertySlug !== state.selectedProperty?.id) {
        setLoader(true);
        fetchProperty(+propertySlug)
          // If only 1 building in property, navigate to building url
          // .then((property: PropertyType) => {
          //   if (property.buildings && property.buildings?.length === 1) {
          //     navigate(`/${propertySlug}/${property.buildings[0].id}`, {
          //       replace: true,
          //     });
          //   }
          // })
          .finally(() => setLoader(false));
      }
    } else if (state.selectedProperty?.id && !propertySlug && mainMap) {
      setTimeout(() => {
        mainMap.easeTo({
          center: MapDefaultState.center,
          zoom: 11,
        });
      }, 250);
      mainMap.once('moveend', () => selectProperty(null));
    }
  }, [propertySlug]);

  // Listen buildingSlug param changes
  // useEffect(() => {
  //   if (state.selectedProperty && buildingSlug) {
  //     const found = state.selectedProperty?.buildings?.find(
  //       (b) => b.id === +buildingSlug,
  //     );
  //     selectBuilding(found);
  //   } else if (state.selectedProperty && !buildingSlug) {
  //     selectBuilding(null);
  //   }
  // }, [buildingSlug, state.selectedProperty]);

  return null;
}

function RulerControlComponent() {
  useControl(
    () =>
      new RulerControl({
        mainColor: '#f13a6f',
        fontHalo: 0,
        fontSize: 15,
      }),
    {
      position: 'top-right',
    },
  );

  return null;
}

function MainMap() {
  // const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [cursor, setCursor] = useState<string>('auto');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [showPropertyLoader, setShowProperyLoader] = useState<boolean>(false);
  const { propertySlug, buildingSlug } = useParams<
    'propertySlug' | 'buildingSlug'
  >();

  const mapRef = React.useRef<MapRef>(null);

  const [viewState, setViewState] = React.useState(MapDefaultState);

  const onMouseEnter = React.useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = React.useCallback(() => {
    setCursor('auto');
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      dispatch({
        type: 'SET_MAP',
        payload: mapRef.current,
      });
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (state.mainMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    mapRef.current?.resize();
    // setTimeout(() => {
    //   mapRef.current?.resize();
    // }, 10);
  }, [state.mainMenuOpen]);

  const useWindowResize = (handler: () => void) => {
    useEffect(() => {
      window.addEventListener('resize', handler);
      return () => {
        window.removeEventListener('resize', handler);
      };
    }, [handler]);
  };

  const onWindowResize = React.useCallback(() => {
    if (mapRef.current !== null) {
      setTimeout(() => mapRef.current?.resize(), 350);
    }
  }, [mapRef.current]);

  useWindowResize(onWindowResize);

  if (!state.categories || !state.categories.length) {
    return <Loader />;
  }

  return (
    <MapProvider>
      <Map
        ref={mapRef}
        id="mainMap"
        {...viewState}
        initialViewState={{
          maxBounds: MapDefaultState.maxBounds,
          latitude: MapDefaultState.center[1],
          longitude: MapDefaultState.center[0],
        }}
        cursor={cursor}
        style={{
          cursor: 'pointer',
          maxWidth: state.mainMenuOpen ? 'calc(100vw - 25rem)' : '100vw',
          width: '100%',
          // transform: state.mainMenuOpen ? 'translate(-100%)' : 'translate(0%)',
        }}
        className={state.mainMenuOpen ? 'menu-open' : ''}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onLoad={() => setMapLoaded(true)}
      >
        <MapRouteHandler setLoader={setShowProperyLoader} />
        <FullscreenControl visible={isInIframe()} />
        <RulerControlComponent />
        <MapStyleSelect />
        <ScaleControl maxWidth={80} />
        <NavigationControl position="bottom-right" showCompass visualizePitch />

        {showPropertyLoader && <Loader />}

        {mapLoaded ? (
          <>
            {state.selectedProperty ? (
              <SingleProperty property={state.selectedProperty} />
            ) : null}
            <MapsData />
          </>
        ) : (
          <Loader />
        )}
      </Map>
    </MapProvider>
  );
}

export default MainMap;
