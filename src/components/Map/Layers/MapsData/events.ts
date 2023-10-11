import React, { useEffect } from 'react';
import { useMap } from 'react-map-gl';
import { useSearchParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useAppContext } from '../../../../context/App';
import { POIType, MapsAreaType } from '../../../../types';
import {
  HouseIcon,
  HouseActiveIcon,
  SchoolIcon,
  StoresIcon,
  HealthServicesIcon,
  LibraryIcon,
  CityBikesIcon,
} from '../../../Icon';
import {
  LAYER_ID_HOUSES,
  LAYER_ID_STORES,
  LAYER_ID_HEALTH_SERVICES,
  LAYER_ID_LIBRARY,
  LAYER_ID_CITY_BIKES,
  LAYER_ID_HOUSES_CLUSTER,
  LAYER_ID_PUBLIC_TRANSPORTATION_CLUSTER,
  LAYER_ID_SCHOOLS_CLUSTER,
  LAYER_ID_SCHOOLS,
  LAYER_ID_PUBLIC_TRANSPORTATION,
  LAYER_ID_RESIDENTAL_AREAS,
  LAYER_ID_LINES,
  LAYER_ID_METRO_LINE,
  LAYER_ID_TRAM_LINE,
  LAYER_ID_HSL_PAYMENT_ZONES_BADGES,
  HOAS_AREA_CLUSTER_MAXZOOM,
} from './constants';
import { PopupInfoProps } from './types';
import { getPolygonBounds, isInIframe } from '../../../../utils';

export const useSelectedItem = () => {
  const { state } = useAppContext();
  const { mainMap } = useMap();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = React.useState<
    POIType | (MapsAreaType & { coordinates: any }) | null
  >(null);

  React.useEffect(() => {
    const s = searchParams.get('selectedItem');
    const ps = searchParams.get('preSelectedItem');

    if (
      s &&
      !s.startsWith('area-') &&
      !s.startsWith('HSL:') &&
      !s.startsWith('CITYBIKE:')
    ) {
      const found = state.pois.find((p) => p.slug === s) || null;
      if (found) {
        if (found.slug !== ps) {
          setSelectedItem(found);
        }
        const coordinates: any = [found.coordinates.lng, found.coordinates.lat];

        // const currentZoom = mainMap.getZoom();
        // const mapZoom = currentZoom < 14 ? 14 : currentZoom;
        let coordinatesWithPadding: any = coordinates;
        if (found.categories.includes('hoas-houses')) {
          if (isMobile) {
            coordinatesWithPadding = [
              coordinates[0],
              coordinates[1] -
                0.8 *
                  0.33 *
                  (mainMap.getBounds().getNorth() -
                    mainMap.getBounds().getSouth()),
            ];
          } else {
            const px = mainMap.project(coordinates);
            px.y += 432 / 2;

            coordinatesWithPadding = mainMap.unproject(px);
          }
        }

        if (isInIframe()) {
          mainMap.flyTo({
            center: coordinates,
            zoom: 14,
            essential: true,
          });
          mainMap.once('zoomend', () => {
            if (
              mainMap.getZoom() <= 14 &&
              found.categories.includes('hoas-houses') &&
              found.slug !== ps
            ) {
              const px = mainMap.project(coordinates);
              px.y += 432 / 2;

              mainMap.panTo(mainMap.unproject(px));
            }
          });
        } else {
          mainMap.easeTo({
            center: coordinatesWithPadding,
            essential: true,
          });
        }
      }
    } else if (s && s.startsWith('area-')) {
      const found =
        state.areas.find((p) => {
          return `area-${p.slug}` === s;
        }) || null;

      if (found) {
        const geoJson = JSON.parse(found.geoJson);
        // const center =
        //   geoJson.geometry.coordinates[0][
        //     Math.floor(geoJson.geometry.coordinates[0].length / 2)
        //   ];
        let center = [];
        [[center]] = geoJson.geometry.coordinates;

        setSelectedItem({
          ...found,
          coordinates: { lat: center[1], lng: center[0] },
        });
        if (isMobile) {
          let propertyMobileCoordinate = center;
          propertyMobileCoordinate = [
            center[0],
            center[1] -
              0.8 *
                0.33 *
                (mainMap.getBounds().getNorth() -
                  mainMap.getBounds().getSouth()),
          ];
          const mapZoom = 14;
          mainMap.easeTo({
            center: propertyMobileCoordinate,
            zoom: mapZoom,
          });
        } else {
          mainMap.easeTo({ center });
        }
      }
    } else if (s && (s.startsWith('HSL:') || s.startsWith('CITYBIKE:'))) {
      const isCityBike = s.startsWith('CITYBIKE:');
      const queryParams = {
        layers: [LAYER_ID_PUBLIC_TRANSPORTATION],
        filter: ['==', 'gtfsId', s],
      };
      let categories = ['public-transportation'];

      if (isCityBike) {
        queryParams.layers = [LAYER_ID_CITY_BIKES];
        queryParams.filter = ['==', 'id', s.replace('CITYBIKE:', '')];
        categories = ['city-bikes'];
      }

      const features = mainMap.queryRenderedFeatures(undefined, queryParams);
      if (features.length > 0 && features[0].geometry.type === 'Point') {
        const feature: any = features[0];
        const { coordinates } = features[0].geometry;
        const center = { lat: coordinates[1], lng: coordinates[0] };

        mainMap.easeTo({
          center,
          zoom: 14,
        });

        setSelectedItem({
          ...feature.properties,
          categories,
          coordinates: center,
        });
      }
    } else {
      setSelectedItem(null);
    }
  }, [searchParams]);

  return { selectedItem, setSelectedItem };
};

let hoveredFeature: any = null;

export default function usePOIEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mainMap } = useMap();
  const [hoverPopupInfo, setHoverPopupInfo] =
    React.useState<PopupInfoProps | null>(null);

  const addImages = () => {
    if (!mainMap?.hasImage('house-icon')) {
      const houseIcon = new Image(32, 40);
      houseIcon.onload = () => {
        if (!mainMap?.hasImage('house-icon')) {
          mainMap?.addImage('house-icon', houseIcon);
        }
      };
      houseIcon.src = HouseIcon;
    }

    if (!mainMap?.hasImage('house-icon-active')) {
      const houseIcon = new Image(46, 59);
      houseIcon.onload = () => {
        if (!mainMap?.hasImage('house-icon-active')) {
          mainMap?.addImage('house-icon-active', houseIcon);
        }
      };
      houseIcon.src = HouseActiveIcon;
    }

    if (!mainMap?.hasImage('school-icon')) {
      const schoolIcon = new Image(90, 120);
      schoolIcon.onload = () => {
        if (!mainMap?.hasImage('school-icon')) {
          mainMap?.addImage('school-icon', schoolIcon);
        }
      };
      schoolIcon.src = SchoolIcon;
    }

    if (!mainMap?.hasImage('stores-icon')) {
      const storesIcon = new Image(60, 60);
      storesIcon.onload = () => {
        if (!mainMap?.hasImage('stores-icon')) {
          mainMap?.addImage('stores-icon', storesIcon);
        }
      };
      storesIcon.src = StoresIcon;
    }

    if (!mainMap?.hasImage('health-services-icon')) {
      const healthServicesIcon = new Image(60, 60);
      healthServicesIcon.onload = () => {
        if (!mainMap?.hasImage('health-services-icon')) {
          mainMap?.addImage('health-services-icon', healthServicesIcon);
        }
      };
      healthServicesIcon.src = HealthServicesIcon;
    }

    if (!mainMap?.hasImage('library-icon')) {
      const libraryIcon = new Image(90, 90);
      libraryIcon.onload = () => {
        if (!mainMap?.hasImage('library-icon')) {
          mainMap?.addImage('library-icon', libraryIcon);
        }
      };
      libraryIcon.src = LibraryIcon;
    }

    if (!mainMap?.hasImage('city-bikes-icon')) {
      const cityBikesIcon = new Image(60, 60);
      cityBikesIcon.onload = () => {
        if (!mainMap?.hasImage('city-bikes-icon')) {
          mainMap?.addImage('city-bikes-icon', cityBikesIcon);
        }
      };
      cityBikesIcon.src = CityBikesIcon;
    }

    mainMap.once('style.load', () => {
      addImages();
    });
  };

  const setHoverFeatureState = (feature: any) => {
    // un-hilight current
    if (hoveredFeature !== null) {
      mainMap.setFeatureState(hoveredFeature, { hover: false });

      hoveredFeature = null;
    }

    // if feature id provided. set feature state
    if (feature) {
      hoveredFeature = feature;
      mainMap.setFeatureState(hoveredFeature, { hover: true });
    }
  };

  const closeHoverPopup = () => {
    setHoverFeatureState(null);
    setHoverPopupInfo(null);
  };

  const toggleHoasHousesHover = (feature: any, hover: boolean) => {
    if (feature.properties.children && feature.properties.bbox) {
      const children = JSON.parse(feature.properties.children);
      mainMap
        .queryRenderedFeatures(undefined, { layers: [LAYER_ID_HOUSES] })
        .forEach((f) => {
          if (f.properties && children.includes(f.properties.slug)) {
            mainMap.setFeatureState(
              { source: f.source, id: f.id },
              { areaHover: hover },
            );
          }
        });
    }
  };

  const onClick = (
    event: mapboxgl.MapMouseEvent & {
      features?: any;
    } & mapboxgl.EventData,
  ) => {
    if (
      document.getElementsByClassName('popup-main').length ||
      typeof event.features === 'undefined'
    ) {
      return null;
    }

    if (
      hoverPopupInfo ||
      document.getElementsByClassName('popup-hover').length
    ) {
      closeHoverPopup();
    }

    const feature = event.features[0];

    const currentState = mainMap.getFeatureState(feature);
    if (!currentState.length || currentState.popupOpen === false) {
      mainMap.setFeatureState(feature, {
        popupOpen: true,
        embedActive: true,
        hover: false,
      });
    }

    let { slug } = feature.properties;

    if (feature.layer.id === LAYER_ID_PUBLIC_TRANSPORTATION) {
      slug = feature.properties.gtfsId;
    }

    if (feature.layer.id === LAYER_ID_CITY_BIKES) {
      slug = `CITYBIKE:${feature.properties.id}`;
    }

    if (isMobile) {
      setHoverFeatureState(null);
    }

    if (feature.layer.id === LAYER_ID_RESIDENTAL_AREAS) {
      setHoverFeatureState(null);
      mainMap.fitBounds(
        getPolygonBounds(JSON.parse(feature.properties.polygonGeometry)),
        {
          zoom: HOAS_AREA_CLUSTER_MAXZOOM,
          padding: 50,
          essential: true,
        },
      );
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set('selectedItem', slug);
    if (params.has('preSelectedItem')) {
      params.delete('preSelectedItem');
    }
    setSearchParams(params);
  };

  const onHover = (
    event: mapboxgl.MapMouseEvent & {
      features?: any;
    } & mapboxgl.EventData,
  ) => {
    if (!isMobile) {
      const { features } = event;
      let feature = features && features[0];

      // Do not show popup for areas
      if (feature.layer.id === LAYER_ID_RESIDENTAL_AREAS) {
        mainMap.getCanvas().style.cursor = 'pointer';
        setHoverFeatureState(feature);
        return;
      }

      if (mainMap.getZoom() < 10.5) {
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const selectedItem = params.get('selectedItem');

      mainMap.getCanvas().style.cursor = 'pointer';

      if (event.features.length > 1 && feature.geometry.type === 'Polygon') {
        feature = features.find((f: any) => f.geometry.type !== 'Polygon');
        if (!feature) {
          feature = features && features[0];
        }
      }

      if (selectedItem !== feature.properties.slug) {
        if (feature.geometry.type === 'Point') {
          const coordinates = feature.geometry.coordinates.slice();

          while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          setHoverFeatureState(feature);
          setHoverPopupInfo(feature ? { feature, coordinates } : null);
        } else if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates[0][0];
          setHoverFeatureState(feature);
          setHoverPopupInfo(feature ? { feature, coordinates } : null);
          toggleHoasHousesHover(feature, true);
        } else if (
          feature.geometry.type === 'MultiLineString' ||
          feature.geometry.type === 'LineString'
        ) {
          const coordinates = [event.lngLat.lng, event.lngLat.lat];
          while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          setHoverFeatureState(feature);
          setHoverPopupInfo(feature ? { feature, coordinates } : null);
        }
      }
    }
  };

  const onMouseLeave = () => {
    closeHoverPopup();
    mainMap.getCanvas().style.cursor = '';
  };

  const onClusterClick = (e: any) => {
    mainMap.flyTo({ center: e.lngLat, zoom: 15 });
  };

  useEffect(() => {
    const layers: any = [
      LAYER_ID_STORES,
      LAYER_ID_HEALTH_SERVICES,
      LAYER_ID_LIBRARY,
      LAYER_ID_CITY_BIKES,
      LAYER_ID_HOUSES,
      LAYER_ID_SCHOOLS,
      LAYER_ID_PUBLIC_TRANSPORTATION,
      LAYER_ID_RESIDENTAL_AREAS,
      LAYER_ID_LINES,
      LAYER_ID_METRO_LINE,
      LAYER_ID_TRAM_LINE,
      LAYER_ID_HSL_PAYMENT_ZONES_BADGES,
    ];

    const clusterLayers: any = [
      LAYER_ID_HOUSES_CLUSTER,
      LAYER_ID_SCHOOLS_CLUSTER,
      LAYER_ID_PUBLIC_TRANSPORTATION_CLUSTER,
    ];
    mainMap.on('load', () => mainMap.resize());
    mainMap.on('mousemove', layers, onHover);
    mainMap.on('mouseleave', layers, onMouseLeave);
    mainMap.on('click', layers, onClick);
    mainMap.on('click', clusterLayers, onClusterClick);

    addImages();

    return () => {
      mainMap.off('mousemove', layers, onHover);
      mainMap.off('mouseleave', layers, onMouseLeave);
      mainMap.off('click', layers, onClick);
      mainMap.off('click', clusterLayers, onClusterClick);
    };
  }, []);

  return { hoverPopupInfo };
}
