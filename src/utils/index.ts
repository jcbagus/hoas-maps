import mapboxgl from 'mapbox-gl';
import {
  BusIcon,
  FerryIcon,
  RailIcon,
  SubwayIcon,
  TramIcon,
} from '../components/Icon';
import { SpaceType } from '../types';

export const getPolygonBounds = (geometry: any) => {
  let bounds = null;
  const coordinates: any = [];
  if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((coords: any) => {
      coords.map((g: any) => coordinates.push(...g));
    });
    bounds = coordinates.reduce(
      (b: any, coord: any) =>
        // eslint-disable-next-line no-undef
        b.extend(coord),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
    );
  } else {
    geometry.coordinates.map((g: any) => coordinates.push(...g));
    bounds = coordinates.reduce(
      (b: any, coord: any) =>
        // eslint-disable-next-line no-undef
        b.extend(coord),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
    );
  }
  return bounds;
};

export const getFloorsString = (floors: SpaceType['floors']) => {
  if (floors.length === 1) {
    return floors[0].name;
  }

  return `${floors[0].name} - ${floors[floors.length - 1].name}`;
};

export const getPublicTransportIcon = (type: string) => {
  switch (type) {
    case 'BUS':
      return BusIcon;
    case 'TRAM':
      return TramIcon;
    case 'RAIL':
      return RailIcon;
    case 'SUBWAY':
      return SubwayIcon;
    case 'FERRY':
      return FerryIcon;
    default:
      return '';
  }
};

export const isInIframe = () => {
  const urlParams =
    typeof URLSearchParams !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : false;
  let embed = urlParams && urlParams.get('embed') !== null;

  // Check is iframe
  if (embed || typeof URLSearchParams !== 'undefined') {
    try {
      embed = window.self !== window.top;
    } catch (e) {
      embed = true;
    }
  }
  return embed;
};
